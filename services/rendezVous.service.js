const db = require("../models");
const RendezVous = db.rendezvous;
const Prestation = db.prestation;
const config = require("../config");
const User = db.user;
const mongoose = require("mongoose");

exports.createPrestation = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let rendezVous = await RendezVous.findById(id).populate("prestations.service");
        let detailsPrestation = [];
        for(let i = 0; i < rendezVous.prestations.length; i++){
            let prestation = rendezVous.prestations[i];
            detailsPrestation.push({
                service: prestation.service.nom,
                gestionnaire: prestation.gestionnaire,
                montant: prestation.service.prix,
                commission: prestation.service.commission,
                montantCommission: prestation.service.prix * prestation.service.commission / 100
            });
        }
        let prestation = await Prestation.create({
            client: rendezVous.client,
            gestionnaire: rendezVous.gestionnaire,
            details: detailsPrestation,
            session: session
        });
        rendezVous.estRealise = true;
        rendezVous = await rendezVous.save({ session: session });
        await session.commitTransaction();
        await session.endSession();
        return prestation;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error("Erreur survenue pendant l'enregistrement de la prestation");
    }
};
    

exports.delete = async (id) => {
    return await RendezVous.findByIdAndDelete(id);
};

exports.estRealise = async (id) => {
    let rendezVous = await RendezVous.findById(id);
    return rendezVous.estRealise;
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