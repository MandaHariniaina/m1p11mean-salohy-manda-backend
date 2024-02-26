const yup = require('yup');
const { isValidObjectId } = require('mongoose');
const db = require('../models');
const { user: User, service: Service } = db;

validateUpdateHoraireTravailRequestBody = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            id: yup
                .string()
                .required()
                .transform( value => {
                    if (isValidObjectId(value)) return value;
                    return '';
                }),
            heureDebut: yup.number().required(),
            minuteDebut: yup.number().default(0),
            heureFin: yup.number().required(),
            minuteFin: yup.number().default(0),
        });
        req.body = await validationSchema.validate(req.body);
        if ((req.body.heureDebut * 60 + req.body.minuteDebut) >= (req.body.heureFin * 60 + req.body.minuteFin)){
            throw new Error("L'heure de début de travail doit être antérieure à l'heure de fin de travail.")
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
        return;
    }
};

validateCompteRequestBody = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            compte: yup.string().required(),
            montant: yup.number().default(0)
        });
        req.body = await validationSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
        return;
    }
};

// TODO preference validation schema: array of prefered employe and prefered service
validatePreferenceRequestBody = async (req, res, next) => {
    try {
        let validationSchema = yup.object().shape({
            employes: yup
                .array()
                .of(yup.string())
                .notRequired(),
            services: yup
                .array()
                .of(yup.string())
                .notRequired(),
        });
        const validatedParams = await validationSchema.validate(req.body);
        req.body = validatedParams;
        // TODO verify if id exists
        if (req.body.employes){
            for(let i = 0; i < req.body.employes.length; i++){
                const employe = req.body.employes[i];
                if(!isValidObjectId(employe)) throw new Error("Identifiant de l'employé non valide");
                let employeSearch = await User.findById(employe).populate({ path: "groupes" })
                // let employeExists = await User.exists({ _id: employe, "groupes.nom": "employe" });
                let estEmploye = false;
                employeSearch.groupes.forEach(groupe => {
                    if (groupe.nom === "employe") {
                        estEmploye = true;
                        return;
                    }
                });
                if(!estEmploye) throw new Error("Employé non existant");
            }
        }
        if (req.body.services) {
            for(let i = 0; i < req.body.services.length; i++){
                const service = req.body.services[i];
                if(!isValidObjectId(service)) throw new Error("Identifiant du service non valide");
                if(!Service.exists({ _id: service })) throw new Error("Service non existant");
            }
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
        return;
    }
};

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
        res.status(400).send({ message: error.message });
        return;
    }
};

const userMiddleware = {
    validateCompteRequestBody,
    validateDeactivateRequestParams,
    validatePreferenceRequestBody,
    validateUpdateHoraireTravailRequestBody
};

module.exports = userMiddleware;