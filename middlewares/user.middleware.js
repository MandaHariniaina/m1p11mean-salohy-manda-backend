const yup = require('yup');
const { isValidObjectId } = require('mongoose');
const db = require('../models');
const User = db.user;

validateDeactivateRequestParams = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform((value) => {
                    if (isValidObjectId(value)){
                        return value;
                    }
                    return '';
                })
        });
        const validatedParams = await validationSchema.validate(req.body);
        req.body = validatedParams;
        let user = User.findById(req.body.id);
        if (user == false){
            return req.status(404).send({ message: "Utilisateur non existant" });
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

const userMiddleware = {
    validateDeactivateRequestParams,
};

module.exports = userMiddleware;