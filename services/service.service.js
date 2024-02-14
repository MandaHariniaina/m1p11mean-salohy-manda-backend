const Service = require('../models/service.model');

exports.save = async (service) => {
    return await Service.create(service);
}