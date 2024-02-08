const { user } = require("../models");
const userModel=require("../models/user.model")
exports.getAllUser=async()=>{
    return await userModel.find();

};

exports.createUser=async(user)=>{
    return await userModel.create(user);
}

exports.getUserById=async(id)=>{
    return await userModel.findById(id);
}