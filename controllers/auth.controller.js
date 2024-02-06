const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Groupe = db.groupe;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const user = new User({
        email: req.body.email,
        // password: bcrypt.hashSync(req.body.password, 8),
        password: bcrypt.hashSync(req.body.password),
    });

    user = await user.save();

    if (req.body.groupes) {
        let groupes = await Groupe.find({ name: { $in: req.body.groupes } });
        user.groupes = groupes.map((groupe) => groupe._id);
        await user.save();
        return res.send({ message: "Utilsateur enregistré" });
    } else {
        let groupe = await Groupe.findOne({ name: "client" });
        user.groupes = [groupe._id];
        user = await user.save()
        return res.send({ message: "Client enregistré" })
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
