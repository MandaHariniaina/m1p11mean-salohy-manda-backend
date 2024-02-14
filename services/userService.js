const { log } = require("winston");
const { user, mongoose } = require("../models");
const userModel=require("../models/user.model")
exports.getAllUser=async()=>{
    return await userModel.find();

};

exports.getPaginateEmploye=async(page,limit)=>{
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId('65c9c6bd9ad63b9340a7e667')
        }
    }).limit(limit*1).skip((page-1)*limit).exec();
}

exports.getEmploye=async()=>{
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId('65c9c6bd9ad63b9340a7e667')
        }
    });
}

exports.createUser=async(user)=>{
    return await userModel.create(user);
}

exports.getUserById=async(id)=>{
    return await userModel.findById(id);
}