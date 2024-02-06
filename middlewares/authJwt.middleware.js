const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const Groupe = require("../models/groupe.model.js");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: "Aucun token fourni!" });
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Non autorisé!",
                });
            }
            req.userId = decoded.id;
            next();
        });
};

estAdmin = (req, res, next) => {
    User.findById(req.userId).exec().then((user) => {
        Groupe.find({ _id: {$in: user.groupes} }).then((userGroupes) =>{
            for (let i = 0; i < userGroupes.length; i++) {
                if (userGroupes[i].name === "administrateur") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "L'utilisateur doit être un administrateur!" });
            return;
        }).then((err) => {
            res.status(500).send({ message: err });
            return;
        })
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    });
};

estEmploye = (req, res, next) => {
    User.findById(req.userId).exec().then((user) => {
        Groupe.find({ _id: {$in: user.groupes} }).then((userGroupes) =>{
            for (let i = 0; i < userGroupes.length; i++) {
                if (userGroupes[i].name === "employe") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "L'utilisateur doit être un employé!" });
            return;
        }).then((err) => {
            res.status(500).send({ message: err });
            return;
        })
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    });
};

const authJwt = {
    verifyToken,
    estAdmin,
    estEmploye,
};

module.exports = authJwt;
