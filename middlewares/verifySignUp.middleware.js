const db = require("../models");
const GROUPES = db.GROUPES;
const User = db.user;
const yup = require('yup');

validateRequestBody = async (req, res, next) => {
    try{
        const signUpSchema = yup.object().shape({
            nom: yup.string().lowercase().required(),
            prenom: yup.string().lowercase().required(),
            email: yup.string().lowercase()
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Le format de l'adresse email est invalide")
                .required(),
            password: yup.string()
                .min(8, "Le mot de passe doit inclure au moins 8 caractères")
                .matches(/^(?=.*[a-z])/, 'Le mot de passe doit inclure au moins une lettre en minuscule')
                .matches(/^(?=.*[A-Z])/, 'Le mot de passe doit inclure au moins une lettre en majuscule')
                .matches(/^(?=.*[0-9])/, 'Le mot de passe doit inclure au moins un chiffre')
                .matches(/^(?=.*[!@#%&])/, 'Le mot de passe doit inclure au moins un caractère spécial')
                .required("Mot de passe requis"),
            passwordConfirmation: yup
                .string()
                .oneOf([yup.ref('password')], 'Les mots de passe doivent se ressembler')
                .required("Confirmation mot de passe requis")
        });
        const validatedBody = await signUpSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

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
            if (!GROUPES.includes(req.body.groupes[i])) {
                res.status(400).send({
                    message: `Echec! Le groupe ${req.body.groupes[i]} n'existe pas!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    validateRequestBody,
    checkDuplicateEmail,
    checkGroupesExist
};

module.exports = verifySignUp;
