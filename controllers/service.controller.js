const serviceService = require('../services/service.service')
const mongooseError = require('mongoose').Error;

exports.update = async(req, res) => {
    try {
        let service = await serviceService.update(req.body);
        return res.status(200).send({ service: service, message: "Service mise à jour." })
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};

exports.create = async (req, res) => {
    try{
        let service = await serviceService.save(req.body);
        return res.status(201).send({ service: service, message: "Service créé" });
    } catch(error) {
        if (error instanceof mongooseError.ValidationError){
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};