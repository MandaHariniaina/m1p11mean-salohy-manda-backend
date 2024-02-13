const config = require("../config/auth.config");
const db = require("../models");
const { user: User, groupe: Groupe, refreshToken: RefreshToken } = db;
const { logger } = require("../config")
const { mailService } = require("../services");

const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    let body = req.body;
    body.password = bcrypt.hashSync(body.password);
    body.salt = "random-salt"
    // body.password = bcrypt.hashSync(body.password, 8),
    const session = await mongoose.startSession();
    session.startTransaction();
    let user = new User(body);

    try {
        user = await user.save({ session: session });

        if (req.body.groupes) {
            let groupes = await Groupe.find({ nom: { $in: req.body.groupes } });
            user.groupes = groupes.map((groupe) => groupe._id);
        } else {
            let groupe = await Groupe.findOne({ nom: "client" });
            user.groupes = [groupe._id];
        }
        await user.save({ session: session });
        await mailService.sendConfirmationCompteMail(user.email);
        await session.commitTransaction();
        await session.endSession();
        return res.send({ message: "Utilsateur inscrit" });
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).send({ message: "Erreur survenue pendant l'inscription de l'utilisateur" });
    }
};

exports.signin = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).send({ message: "Identifiant ou mot de passe erroné" });
    }

    let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
    );

    if (!passwordIsValid) {
        return res.status(401).send({ message: "Identifiant ou mot de passe erroné" });
    }
    const token = jwt.sign({ id: user.id }, 
        config.secret, 
        { 
            algorithm: 'HS256', 
            expiresIn: config.jwtExpiration 
    });

    let refreshToken = await RefreshToken.createToken(user);

    let authorities = [];

    for (let i = 0; i < user.groupes.length; i++) {
        let groupe = await Groupe.findById(user.groupes[i]._id)
        authorities.push("GROUPE_" + groupe.nom.toUpperCase());
    }

    // JWT
    // req.session.token = token;

    res.status(200).send({
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
    });

};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Le jeton d'actualisation est requis!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            res.status(403).json({ message: "Le jeton d'actualisation n'est pas dans la base de données!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

            res.status(403).json({
                message: "Le jeton d'actualisation a expiré. Veuillez vous reconnecter",
            });
            return;
        }

        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

// exports.signout = async (req, res) => {
//     try {
//         // JWT
//         // req.session = null;
//         return res.status(200).send({ message: "Vous avez été déconnecté!" });
//     } catch (err) {
//         this.next(err);
//     }
// };
