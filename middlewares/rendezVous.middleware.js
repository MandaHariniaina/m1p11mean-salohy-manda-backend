const yup = require('yup');
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const { rendezvous: RendezVous } = require("../models");

exports.validateCreatePrestationRequestBody = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform( value => {
                    if(isValidObjectId(value)){
                        return value;
                    }
                    return '';
                })
        });
        req.body = await validationSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validateGetRequestParams = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            page: yup.number().integer().default(1),
            limit: yup.number().integer().default(10),
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
                }),
        });
        const validatedBody = await validationSchema.validate(req.body);
        req.body = validatedBody;
        // Validation rendezVous.client === req.user
        const rendezVous = await RendezVous.findById(req.body.id);
        if (rendezVous.client !== req.user._id) {
            res.status(401).send({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validatePutRequestBody = async (req, res, next) => {
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
                }),
            gestionnaire: yup
                .string()
                .required()
                .transform((value) => {
                    if (isValidObjectId(value)){
                        return value;
                    }
                    return '';
                }),
            prestations: yup
                .array()
                .of(
                    yup.object({
                        service: yup.string().required("Spécifiez le service dans la prestation"),
                        gestionnaire: yup.string().notRequired(),
                    })
                )
                .min(1, "Veuillez selectionner au moins un service.")
                .required("Veuillez specifier le(s) service(s)"),
            date: yup.date().required()
        });
        const validatedBody = await validationSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};

exports.validatePostRequestBody = async (req, res, next) => {
    try{
        const validationSchema = yup.object().shape({
            gestionnaire: yup
                .string()
                .required()
                .transform((value) => {
                    if (isValidObjectId(value)){
                        return value;
                    }
                    return '';
                }),
            prestations: yup
                .array()
                .of(
                    yup.object({
                        service: yup.string().required("Spécifiez le service dans la prestation"),
                        gestionnaire: yup.string().notRequired(),
                    })
                )
                .min(1, "Veuillez selectionner au moins un service.")
                .required("Veuillez specifier le(s) service(s)"),
            date: yup.date().required()
        });
        const validatedBody = await validationSchema.validate(req.body);
        req.body = validatedBody;
        next();
    } catch (error) {
        res.status(400).send({ message: error.errors });
        return;
    }
};