const { rendezVousService } = require("../services");

exports.createPrestation = async (req, res) => {
    try {
        let prestation = await rendezVousService.createPrestation(req.body.id);
        return res.status(201).send({ prestation });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await rendezVousService.delete(req.body.id);
        return res.status(200).send({ message: "Rendez vous supprimé." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try{
        let rendezVous;
        let estEmploye = false;
        req.user.groupes.forEach(groupe => {
            if (groupe.nom === 'employe'){
                estEmploye = true;
            }
        });
        if (estEmploye){
            rendezVous = await rendezVousService.findByGestionnaire(req.user._id, req.query.page, req.query.limit);
        } else {
            rendezVous = await rendezVousService.findByClient(req.user._id, req.query.page, req.query.limit);
        }
        return res.status(200).send(rendezVous);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try{
        const rendezVous = await rendezVousService.update(req.body.id, req.body);
        return res.status(200).send({ rendezVous: rendezVous, message: "Rendez-vous mise à jour" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.create = async (req, res) => {
    try{
        req.body.client = req.user._id
        const rendezVous = await rendezVousService.create(req.body);
        return res.status(201).send({ rendezVous: rendezVous, message: "Rendez-vous enregistré" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}