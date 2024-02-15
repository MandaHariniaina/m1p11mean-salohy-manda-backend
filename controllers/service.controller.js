const serviceService = require('../services/service.service')
const mongooseError = require('mongoose').Error;

exports.delete = async (req, res) => {
    try {
        await serviceService.delete(req.body.id);
        return res.status(200).send({ message: "Service supprimé." })
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Ce service n'existe pas ou a déja été supprimé." });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
}

exports.update = async (req, res) => {
    try {
        let service = await serviceService.update(req.body);
        return res.status(200).send({ service: service, message: "Service mise à jour." });
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Ce service n'existe pas ou a déja été supprimé." });
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