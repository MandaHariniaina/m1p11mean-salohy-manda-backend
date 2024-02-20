const yup = require('yup');
const { isValidObjectId } = require('mongoose');

exports.validateChiffreAffaireMoisGetParams = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            mois: yup.number().integer().min(1).max(12).required(),
            annee: yup.number().integer().required()
        });
        req.params = await validationSchema.validate(req.params);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
}

exports.validateDateParams = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            date: yup.date().required()
        });
        await validationSchema.validate(req.params);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
}

exports.validatePaiementRequestBody = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform( (value) => {
                    if(isValidObjectId(value)) return value;
                    return '';
                }),
            compte: yup.string().required(),
        });
        req.body = await validationSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};