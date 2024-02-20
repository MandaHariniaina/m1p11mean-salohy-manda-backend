const yup = require('yup');
const { isValidObjectId } = require('mongoose');

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