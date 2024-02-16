const { depenseService } = require('../services');
const mongooseError = require('mongoose').Error;

exports.findAll = async(req, res) => {
    try {
        let dateDebut = req.query.dateDebut;
        let dateFin = req.query.dateFin;
        let depenses = await depenseService.findAll(req.query.page, req.query.limit, dateDebut, dateFin);
        return res.status(200).send(depenses);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Erreur du serveur." });
    }
}

exports.delete = async (req, res) => {
    try {
        await depenseService.delete(req.body.id);
        return res.status(200).send({ message: "Dépense supprimé." })
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Cette dépense n'existe pas ou a déja été supprimé." });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
}

exports.update = async (req, res) => {
    try {
        let depense = await depenseService.update(req.body);
        return res.status(200).send({ depense });
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Cette dépense n'existe pas ou a déja été supprimé." });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};

exports.create = async (req, res) => {
    try{
        let depense = await depenseService.save(req.body);
        return res.status(201).send({ depense });
    } catch(error) {
        if (error instanceof mongooseError.ValidationError){
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};