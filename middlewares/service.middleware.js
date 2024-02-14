const yup = require('yup');

exports.validateServiceDeleteRequestBody = async (req, res, next) => {
    try{
        const serviceUpdateSchema = yup.object().shape({
            id: yup.string().length(24)
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
            id: yup.string().length(24),
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