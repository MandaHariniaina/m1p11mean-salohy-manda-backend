const yup = require('yup');

validateRequestBody = async (req, res, next) => {
    try{
        const signInSchema = yup.object().shape({
            email: yup.string().lowercase()
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Le format de l'adresse email est invalide")
                .required("Identifiant requis"),
            password: yup.string().required("Mot de passe requis")
        });
        const validatedBody = await signInSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

const verifySignIn = { validateRequestBody };

module.exports = verifySignIn;
