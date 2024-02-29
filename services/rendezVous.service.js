const db = require("../models");
const Groupe = db.groupe;
const RendezVous = db.rendezvous;
const Prestation = db.prestation;
const Service = db.service;
const config = require("../config");
const User = db.user;
const mongoose = require("mongoose");
const { log } = require("handlebars");

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
    const groupeEmploye = await Groupe.findOne({ nom: 'employe' });
    const regex = new RegExp(`.*${q}.*`, 'i');
    // Gestionnaire filtre
    const gestionnaires = await User.find({ nom: regex, groupes: { $in: groupeEmploye } }).select("id");
    var gestionnaireIds = [];
    gestionnaires.forEach( gestionnaire => {
        gestionnaireIds.push(gestionnaire._id);
    });
    // Service Filtre
    const services = await Service.find({ nom: regex });
    let serviceIds = []
    services.forEach( service => {
        serviceIds.push(service._id);
    });

    return await RendezVous.paginate(
        // filter, 
        {
            client: userId,
            $or: [
                { gestionnaire: { $in: gestionnaireIds } },
                { 'prestations.service': {$in: serviceIds} }
            ]
        },
        { 
            page, 
            limit, 
            sort: { createdAt: 'desc'} , 
            customLabels: config.mongoosePaginate.customLabels, 
            populate: [
                { path:'gestionnaire', select: 'nom prenom' },
                { path:'prestations.service', select: 'nom' },
            ]
            // populate: 'gestionnaire prestations.service prestations.service.nom' 
        }
    );
};

exports.findByGestionnaire = async (userId, q = "", page, limit) => {
    const groupeClient = await Groupe.findOne({ nom: 'client' });
    const regex = new RegExp(`.*${q}.*`, 'i');
    console.log(q);
    // Client filtre
    const clients = await User.find({ nom: regex, groupes: { $in: groupeClient } }).select("id");
    var clientIds = [];
    clients.forEach( client => {
        clientIds.push(client._id);
    });
    // Service Filtre
    const services = await Service.find({ nom: regex });
    let serviceIds = []
    services.forEach( service => {
        serviceIds.push(service._id);
    });
    let objFilter={}
    if(q=="en cours" && q!="traite" && q!="tout"){
        console.log("tonga1");
        objFilter={
            gestionnaire: userId,
            $or: [
              
                { 'estRealise': false },
               
              
            ]
        }
    }
    if(q=="traite"&& q!="en cours" && q!="tout"){
        console.log("tonga2");
        objFilter={
            gestionnaire: userId,
            $or: [
              
                { 'estRealise': true },
               
              
            ]
        }
    }
    if(q!="traite" && q!="en cours" && q!="tout"){
        console.log("tonga3");
        objFilter= { 
            gestionnaire: userId,
            $or: [
                { client: { $in: clientIds } },
                { 'prestations.service': {$in: serviceIds} },
               
              
            ]
        }
    }
    if(q=="tout"){
        console.log("tonga4");
        objFilter= { 
            gestionnaire: userId,
        }
    }
    //console.log(objFilter);
    return await RendezVous.paginate(
       objFilter, 
        { 
            page, 
            limit, 
            sort: {createdAt: 'desc'}, 
            customLabels: config.mongoosePaginate.customLabels, 
            populate: [
                { path:'client', select: 'nom prenom' },
                { path:'prestations.service', select: 'nom' },
            ]
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