const { log } = require("winston");
const { user, mongoose } = require("../models");
const userModel=require("../models/user.model");
const Groupe = require("../models/groupe.model");
exports.getAllUser=async()=>{
    return await userModel.find();

};

exports.getPaginateEmploye=async(page,limit)=>{
    let groupe_id= await Groupe.findOne({nom:'client'});
    return await userModel.find({
        'groupes': { $nin: new mongoose.Types.ObjectId(groupe_id)
        }
    }).limit(limit*1).skip((page-1)*limit).select({"password":0,"vers":0,"preferences":0});
}

exports.updateStatusEmploye=async(user_id,status)=>{
    return await userModel.findByIdAndUpdate(user_id,{'estActif':status},{
        new:true
    }).select({"password":0});
}//modification status utilisateur

exports.updateUser=async(body)=>{
    return await userModel.findByIdAndUpdate(body._id,body,{
        new:true
    }).select({"password":0});
}//modification utilisateur

exports.getEmploye=async()=>{
    let groupe_id= await Groupe.findOne({nom:'client'});
    console.log(groupe_id._id);
    return await userModel.find({
        'groupes': { $nin: new mongoose.Types.ObjectId(groupe_id._id)
        }
    });
}

exports.createUser=async(user)=>{
    return await userModel.create(user);
};

exports.getUserById=async(id)=>{
    return await userModel.findById(id);
};

