const { log } = require("winston");
const { user, mongoose } = require("../models");
const userModel=require("../models/user.model")
exports.getAllUser=async()=>{
    return await userModel.find();

};

exports.getEmploye=async()=>{
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId('65c9c6be9ad63b9340a7e66a')
        }
    });
}

exports.createUser=async(user)=>{
    return await userModel.create(user);
}

exports.getUserById=async(id)=>{
    return await userModel.findById(id);
}