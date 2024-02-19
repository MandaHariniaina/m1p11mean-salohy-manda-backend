const db = require("../models");
const RendezVous = db.rendezvous;
const config = require("../config");
const User = db.user;

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