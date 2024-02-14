const Service = require('../models/service.model');
const mongoose = require('mongoose');

exports.delete = async (id) => {
    let serviceExists = await Service.exists({ _id: id });
    if (serviceExists == null){
        throw new mongoose.Error.DocumentNotFoundError();
    }
    let result = await Service.deleteOne({ _id: id });
    return;
}

exports.update = async (service) => {
    const { id, ...data } = service
    let serviceExists = await Service.exists({ _id: id });
    if (serviceExists == null){
        throw new mongoose.Error.DocumentNotFoundError();
    }
    await Service.replaceOne({ _id: id }, data);
    return await Service.findById(id);
}

exports.save = async (service) => {
    return await Service.create(service);
}