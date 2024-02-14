const Service = require('../models/service.model');

exports.update = async(service) => {
    const { id, ...data } = service
    await Service.replaceOne({ _id: id }, data);
    return await Service.findById(id);
}

exports.save = async (service) => {
    return await Service.create(service);
}