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
        return res.status(403).send({ message: "Non authentifié!" });
    }

    jwt.verify(token,
        config.secret,
        async (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Non autorisé!",
                });
            }
            req.userId = decoded.id;
            let user;
            try {
                user = await User.findById(decoded.id);
                req.user = user;
            } catch (error){
                res.status(500).send({ message: err.message });
                return;
            }
            if (user.estVerifie == false){
                return res.status(403).send({ message: "Compte non vérifié" });
            } else if (user.estActif == false){
                return res.status(403).send({ message: "Compte non activé" })
            }
            next();
        });
};


estAdmin = (req, res, next) => {
    let user = req.user;
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
    });
};

estEmploye = (req, res, next) => {
    let user = req.user;
    Groupe.find({ _id: {$in: user.groupes} }).then((userGroupes) =>{
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
    });
};

const authJwt = {
    verifyToken,
    estAdmin,
    estEmploye,
};

module.exports = authJwt;
