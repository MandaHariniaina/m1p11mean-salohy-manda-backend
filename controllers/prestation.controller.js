const { prestationService } = require('../services');
const mongooseError = require('mongoose').Error;
const { CompteMontantError, CompteInexistantError } = require("../exceptions");

exports.find = async (req, res) => {
    try {
        let user = req.user;
        let userGroupes = [];
        user.groupes.forEach(groupe => {
            userGroupes.push(groupe.nom);
        });
        // If user is an administrateur
        if(userGroupes.includes("administrateur")){
            var prestations = await prestationService.find('administrateur', null, req.query.dateDebut, req.query.dateFin, req.query.page, req.query.limit);
        } 
        // If user is an employe
        else if (userGroupes.includes("employe")) { 
            var prestations = await prestationService.find('employe', req.user._id, req.query.dateDebut, req.query.dateFin, req.query.page, req.query.limit);
        }
        // If user is a client
        else if (userGroupes.includes("client")) { 
            var prestations = await prestationService.find('client', req.user._id, req.query.dateDebut, req.query.dateFin, req.query.page, req.query.limit);
        }
        // If user is an admin
        return res.status(200).send(prestations);
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
};

exports.getEmployePourcentageCommissionByDate = async (req, res) => {
    try {
        let pourcentageCommission = await prestationService.getPourcentageCommissionByDate(req.user._id, req.params.date);
        return res.status(200).send({ pourcentageCommission });
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
};

exports.getEmployeMontantCommissionByDate = async (req, res) => {
    try {
        let montantCommission = await prestationService.getMontantCommissionByDate(req.user._id, req.params.date);
        return res.status(200).send({ montantCommission });
    } catch (error) {
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}

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