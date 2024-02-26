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
            console.log(prestation.service.prixPromotion);
            detailsPrestation.push({
                service: prestation.service.nom,
                gestionnaire: prestation.gestionnaire,
                // montant: prestation.service.prix,
                montant: prestation.service.prixPromotion,
                // commission: prestation.service.commission,
                montantCommission: prestation.service.prix * prestation.service.commission / 100,
                duree: prestation.service.duree
            });
        }
        let prestation = await Prestation.create(
            [
                {
                    client: rendezVous.client,
                    gestionnaire: rendezVous.gestionnaire,
                    details: detailsPrestation
                }
            ], 
            { 
                session: session 
            }
        );
        rendezVous.estRealise = true;
        rendezVous = await rendezVous.save({ session: session });
        await session.commitTransaction();
        await session.endSession();
        return prestation;
    } catch (error) {
        console.log(error);
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
    const dateInfFilter = new Date();
    const dateSupFilter = new Date();
    dateSupFilter.setDate(dateSupFilter.getDate() + 3);
    var listeRendezVous = await RendezVous.find({ date: { $lte: dateSupFilter, $gte: dateInfFilter } }).populate("client gestionnaire prestations.service");
    return listeRendezVous;
};

exports.findByClient = async (userId, q = "", page, limit) => {
    const regex = new RegExp(`.*${q}.*`, 'i');
    let filter = {
        client: userId
    }
    if (q !== "" & q != null) {
        filter["$or"] = [{ 'gestionnaire.nom': regex }];
    }
    console.log(filter);
    return await RendezVous.paginate(
        // filter, 
        {
            client: userId,
            // $or: [{ 'gestionnaire.nom': regex }]
        },
        { 
            page, 
            limit, 
            sort: { createdAt: 'desc'} , 
            customLabels: config.mongoosePaginate.customLabels, 
            populate: [
                { path:'gestionnaire', select: 'service' },
                { path:'prestations.service', select: 'nom' },
            ]
            // populate: 'gestionnaire prestations.service prestations.service.nom' 
        }
    );
};

exports.findByGestionnaire = async (userId, q, page, limit) => {
    const regex = new RegExp(`.*${q}.*`, 'i');
    return await RendezVous.paginate(
        { 
            gestionnaire: userId,
            $or: [
                { 'client.nom': regex }
            ]
        }, 
        { 
            page, 
            limit, 
            sort: {createdAt: 'desc'}, 
            customLabels: config.mongoosePaginate.customLabels, 
            populate: 'client prestations.service' 
        }
    );
};

exports.update = async (id, data) => {
    let rendezVous = await RendezVous.findByIdAndUpdate(id, data);
    return rendezVous;
};

exports.create = async (data) => {
    return await RendezVous.create(data);
};