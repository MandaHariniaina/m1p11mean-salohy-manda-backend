const yup = require('yup');
const { isValidObjectId } = require('mongoose');

exports.validatePromotionRequestBody = async (req, res, next) => {
    try{
        const validationSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform( value => {
                    if (isValidObjectId(value)) return value;
                    return '';
                }),
            description: yup.string().required(),
            pourcentageReduction: yup.number().integer().min(0).max(100),
            dateDebut: yup
                .date()
                .transform((value, originalValue) => {
                    let dateWithoutTz = new Date(originalValue);
                    return dateWithoutTz;
                })
                .min(new Date(), 'Veuillez choisir une date à venir')
                .required('La date de debut est requise'),
            dateFin: yup
                .date()
                .when('dateDebut', ([dateDebut], schema) => {
                    if (dateDebut) {
                        return schema.min(dateDebut, 'La date de fin doit être ultérieur à la date de début');
                    }
                    return schema;
                })
                .required('La date de fin est requise')
                .transform((value, originalValue) => {
                    let dateWithoutTz = new Date(originalValue);
                    return dateWithoutTz;
                }),
        });
        req.body = await validationSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateGetRequestQuery = async (req, res, next) => {
    try{
        const validationSchema = yup.object().shape({
            nom: yup.string().notRequired(),
            page: yup.number().integer().default(1),
            limit: yup.number().integer().default(10),
        });
        req.query = await validationSchema.validate(req.query);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateServiceDeleteRequestBody = async (req, res, next) => {
    try{
        const serviceUpdateSchema = yup.object().shape({
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
        const validatedBody = await serviceUpdateSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateServiceUpdateRequestBody = async (req, res, next) => {
    try{
        const serviceUpdateSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform((value) => {
                    if (isValidObjectId(value)){
                        return value;
                    }
                    return '';
                }),
            nom: yup.string().required(),
            prix: yup.number().required().min(0),
            duree: yup.number().required().min(0),
            commission: yup.number().required().min(0).max(100)
        });
        const validatedBody = await serviceUpdateSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateServiceCreateRequestBody = async (req, res, next) => {
    try{
        const serviceCreateSchema = yup.object().shape({
            nom: yup.string().required(),
            prix: yup.number().required().min(0),
            duree: yup.number().required().min(0),
            commission: yup.number().required().min(0).max(100)
        });
        const validatedBody = await serviceCreateSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};