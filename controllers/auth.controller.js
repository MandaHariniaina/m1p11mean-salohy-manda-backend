const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Groupe = db.groupe;
const logger = require("../logger")

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

    try{
        user = await user.save({ session: session });

        if (req.body.groupes) {
            let groupes = await Groupe.find({ nom: { $in: req.body.groupes } });
            user.groupes = groupes.map((groupe) => groupe._id);
        } else {
            let groupe = await Groupe.findOne({ nom: "client" });
            user.groupes = [groupe._id];
        }
        await user.save({ session: session });
        await session.commitTransaction();
        await session.endSession();
        return res.send({ message: "Utilsateur inscrit" });
    } catch(error){
        logger.error(error);
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
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

    var authorities = [];

    for (let i = 0; i < user.groupes.length; i++) {
        authorities.push("GROUPE_" + user.groupes[i].nom.toUpperCase());
    }

    req.session.token = token;

    res.status(200).send({
        id: user._id,
        email: user.email,
        roles: authorities,
    });

};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "Vous avez été déconnecté!" });
    } catch (err) {
        this.next(err);
    }
};
