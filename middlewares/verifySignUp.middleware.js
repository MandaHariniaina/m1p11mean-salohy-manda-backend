const db = require("../models");
const GROUPES = db.GROUPES;
const User = db.user;

checkDuplicateEmail = async (req, res, next) => {
    // Username
    let userExists = await User.exists({ email: req.body.email })
    if (userExists) {
        res.status(400).send({ message: "L'adresse email est déjà utilisée" });
        return;
    }
    next();
};

checkGroupesExist = (req, res, next) => {
    if (req.body.groupes) {
        for (let i = 0; i < req.body.groupes.length; i++) {
            if (!GROUPES.includes(req.body.groupe[i])) {
                res.status(400).send({
                    message: `Echec! Le groupe ${req.body.groupe[i]} n'existe pas!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateEmail,
    checkGroupesExist
};

module.exports = verifySignUp;
