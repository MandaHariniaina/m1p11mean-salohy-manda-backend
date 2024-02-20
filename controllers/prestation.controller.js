const { prestationService } = require('../services');
const mongooseError = require('mongoose').Error;
const { CompteMontantError, CompteInexistantError } = require("../exceptions");

exports.beneficeMois = async (req, res) => {
    try {
        let benefice = await prestationService.beneficeMois(req.params.mois, req.params.annee);
        return res.status(200).send({ benefice });
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}

exports.chiffreAffaireMois = async (req, res) => {
    try {
        let chiffreAffaire = await prestationService.chiffreAffaireMois(req.params.mois, req.params.annee);
        return res.status(200).send({ chiffreAffaire });
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}

exports.chiffreAffaireJour = async (req, res) => {
    try {
        let chiffreAffaire = await prestationService.chiffreAffaireJour(req.params.date);
        return res.status(200).send({ chiffreAffaire });
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}

exports.paiement = async (req, res) => {
    try {
        await prestationService.paiement(req.body.id, req.user, req.body.compte);
        return res.status(200).send({ message: "Paiement effectuée" });
    } catch (error) {
        if (error instanceof CompteMontantError){
            return res.status(406).send({ message: error.message });
        } else if (error instanceof CompteInexistantError) {
            return res.status(406).send({ message: error.message });
        }
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}