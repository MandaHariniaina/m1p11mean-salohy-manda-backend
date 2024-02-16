const { log } = require("winston");
const { service, mongoose } = require("../models");
const serviceModel=require("../models/service.model")

exports.getPaginateService=async(page,limit)=>{
    return await serviceModel.find({}).limit(limit*1).skip((page-1)*limit).exec();
}

exports.getAllService=async()=>{
    return await serviceModel.find({});
}