const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const Groupe = require("../models/groupe.model.js");
const User = db.user;
const { TokenExpiredError } = jwt;


const catchError = (err, res) => {
    if(err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Non autorisé! La jeton d'accès est expiré!" })
    }

    return res.status(403).send({ message: "Non autorisé!" })
}

verifyToken = (req, res, next) => {
    // JWT
    // let token = req.session.token;
    // x-access
    let token = req.headers["x-access-token"];

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
                if (userGroupes[i].nom === "administrateur") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "L'utilisateur doit être un administrateur!" });
            return;
        }).catch((err) => {
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
            console.group(userGroupes);
            for (let i = 0; i < userGroupes.length; i++) {
                if (userGroupes[i].nom === "employe") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "L'utilisateur doit être un employé!" });
            return;
        }).catch((err) => {
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
