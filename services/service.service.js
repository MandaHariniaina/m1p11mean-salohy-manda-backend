const Service = require('../models/service.model');
const mongoose = require('mongoose');
const config = require('../config');
const fs = require('fs');
const { projectConfig }  = require("../config");
const path = require('path');

exports.getPromotions = async(id, data) => {
    let currentDate = new Date();
    let servicesPromotions = await Service.aggregate([
        { $unwind: "$promotions" },
        { $match: {
            "promotions.dateDebut": { $lte: currentDate },
            "promotions.dateFin": { $gte: currentDate }
        }}
    ])
    return servicesPromotions;
}

exports.createPromotion = async (id, data) => {
    let service = await Service.findById(id);
    service.promotions.push(data);
    service = await service.save();
    return service;
};

exports.find = async (filter, page, limit) => {
    /* Create regex that ignores case and accents */
    function diacriticSensitiveRegex(string = '') {
        return string
            .replace(/a/g, '[a,á,à,ä,â]')
            .replace(/e/g, '[e,é,ë,è]')
            .replace(/i/g, '[i,í,ï,ì]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]');
        }
    const nomRegex = new RegExp(diacriticSensitiveRegex(filter.nom), 'i');
    /* ----------------------------------------- */
    return await Service.paginate(
        { 
            nom: { $regex: nomRegex } 
        }, 
        { 
            page, 
            limit, 
            sort: { nom: 'asc' }, 
            customLabels: config.mongoosePaginate.customLabels,
        }
    );
};

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

exports.save = async (service, filename) => {
    service.image = filename;
    // service.image = {
    //     data: fs.readFileSync( file ),
    //     contentType: 'image/png'
    // }
    return await Service.create(service);
}

exports.getPaginateService=async(page,limit)=>{
    return await Service.find({}).limit(limit*1).skip((page-1)*limit).exec();
}

exports.getAllService=async()=>{
    return await Service.find({});
}