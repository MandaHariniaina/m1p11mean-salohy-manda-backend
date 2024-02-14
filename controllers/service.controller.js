const serviceService = require('../services/service.service')
const mongooseError = require('mongoose').Error;

exports.create = async (req, res) => {
    try{
        let service = await serviceService.save(req.body);
        return res.status(201).send({ service: service, message: "Service créé" });
    } catch(error) {
        if (error instanceof mongooseError.ValidationError){
            return res.status(400).send({ mmessage: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
    return;
}