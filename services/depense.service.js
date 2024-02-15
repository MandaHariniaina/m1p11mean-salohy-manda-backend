const Depense = require('../models/depense.model');
const mongoose = require('mongoose');

exports.findAll = async(page, limit, dateDebut, dateFin) => {
    let dateFilter;
    if (dateDebut & dateFin) {
        dateFilter = {
            $gte: dateDebut,
            $lte: dateFin,
        };
    } else if (dateDebut) {
        dateFilter = {
            $gte: dateDebut
        };
    } else if (dateFin) {
        dateFilter = {
            $lte: dateFin
        };
    } else {
        dateFilter = null;
    }
    let depenses;
    if (dateFilter){
        depenses = await Depense.paginate({ createdAt: dateFilter }, {page, limit, sort: { createdAt: 'desc'}});
    } else {
        depenses = await Depense.paginate({}, {page, limit, sort: { createdAt: 'desc'}});
    }
    return depenses;
}

exports.delete = async (id) => {
    let depenseExists = await Depense.exists({ _id: id });
    if (depenseExists == null){
        throw new mongoose.Error.DocumentNotFoundError();
    }
    let result = await Depense.deleteOne({ _id: id });
    return;
}

exports.update = async (depense) => {
    const { id, ...data } = depense
    let depenseExists = await Depense.exists({ _id: id });
    if (depenseExists == null){
        throw new mongoose.Error.DocumentNotFoundError();
    }
    await Depense.replaceOne({ _id: id }, data);
    return await Depense.findById(id);
}

exports.save = async (depense) => {
    return await Depense.create(depense);
}