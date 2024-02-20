const db = require("../models");
const RendezVous = db.rendezvous;
const Prestation = db.prestation;
const config = require("../config");
const User = db.user;

exports.createPrestation = async (id) => {
    let rendezVous = await RendezVous.findById(id).populate("prestations.service");
    let detailsPrestation = [];
    for(let i = 0; i < rendezVous.prestations.length; i++){
        let prestation = rendezVous.prestations[i];
        detailsPrestation.push({
            service: prestation.service.nom,
            gestionnaire: prestation.gestionnaire,
            montant: prestation.service.prix
        });
    }
    console.log(detailsPrestation);
    let prestation = await Prestation.create({
        client: rendezVous.client,
        details: detailsPrestation,
    });
    return prestation;
};

exports.delete = async (id) => {
    return await RendezVous.findByIdAndDelete(id);
};

exports.findRappel = async () => {
    // TODO implementation
};

exports.findByClient = async (userId, page, limit) => {
    return await RendezVous.paginate({ client: userId }, {page, limit, sort: { createdAt: 'desc'} , customLabels: config.mongoosePaginate.customLabels });
};

exports.findByGestionnaire = async (userId, page, limit) => {
    return await RendezVous.paginate({ gestionnaire: userId }, { page, limit, sort: {createdAt: 'desc'}, customLabels: config.mongoosePaginate.customLabels });
};

exports.update = async (id, data) => {
    let rendezVous = await RendezVous.findByIdAndUpdate(id, data);
    return rendezVous;
};

exports.create = async (data) => {
    return await RendezVous.create(data);
};