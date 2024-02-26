const yup = require('yup');
const { isValidObjectId } = require('mongoose');

exports.validateGetRequestParams = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            page: yup.number().integer().default(1),
            limit: yup.number().integer().default(10),
            dateDebut: yup.date().notRequired(),
            dateFin: yup.date().notRequired(),
        });
        const validatedParams = await validationSchema.validate(req.query);
        req.query = validatedParams;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateDeleteRequestBody = async (req, res, next) => {
    try{
        const validationSchema = yup.object().shape({
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
        const validatedBody = await validationSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateUpdateRequestBody = async (req, res, next) => {
    try{
        const depenseUpdateSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform((value) => {
                    if (isValidObjectId(value)){
                        return value;
                    }
                    return '';
                }),
            motif: yup.string().required(),
            montant: yup.number().required().min(0),
        });
        const validatedBody = await depenseUpdateSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateCreateRequestBody = async (req, res, next) => {
    try{
        const depenseCreateSchema = yup.object().shape({
            motif: yup.string().required(),
            montant: yup.number().required().min(0),
        });
        const validatedBody = await depenseCreateSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error });
        return;
    }
};