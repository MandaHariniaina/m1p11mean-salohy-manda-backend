const { prestationService } = require('../services');
const mongooseError = require('mongoose').Error;
const { CompteMontantError, CompteInexistantError } = require("../exceptions");

exports.paiement = async(req, res) => {
    try {
        let depenses = await prestationService.paiement(req.body.id, req.user, req.body.compte);
        return res.status(200).send({ message: "Paiement effectuée" });
    } catch (error) {
        console.log(error);
        if (error instanceof CompteMontantError){
            return res.status(406).send({ message: error.message });
        } else if (error instanceof CompteInexistantError) {
            return res.status(406).send({ message: error.message });
        }
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}