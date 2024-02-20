const { log } = require("winston");
const { user, mongoose } = require("../models");
const userModel=require("../models/user.model");
const { CompteMontantError } = require("../exceptions");

exports.compte = async (userId, data) => {
    let user = await userModel.findById(userId);
    let compteLabel = data.compte;
    if (user.compte == undefined) {
        user.compte = new Map([[compteLabel, data.montant]]);
    } else {
        if ((user.compte.get(compteLabel) + data.montant) < 0){
            throw new CompteMontantError("Montant du compte négatif");
        }
        if (user.compte.get(compteLabel)){
            user.compte.set(compteLabel, user.compte.get(compteLabel) + data.montant);
        } else {
            user.compte.set(compteLabel, data.montant);
        }
    }
    user = await user.save();
    return user;
};

exports.updatePreference = async (userId, data) => {
    let user = userModel.findByIdAndUpdate(userId, { 'preferences': data });
    return user;
};

exports.getAllUser=async()=>{
    return await userModel.find();

};

exports.getPaginateEmploye=async(page,limit)=>{
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId('65c9c6bd9ad63b9340a7e667')
        }
    }).limit(limit*1).skip((page-1)*limit).select({"password":0,"vers":0,"preferences":0});
}

exports.updateStatusEmploye=async(user_id,status)=>{
    return await userModel.findByIdAndUpdate(user_id,{'est_verifie':status},{
        new:true
    }).select({"password":0});
}//modification status utilisateur

exports.updateUser=async(body)=>{
    return await userModel.findByIdAndUpdate(body._id,body,{
        new:true
    }).select({"password":0});
}//modification utilisateur

exports.getEmploye=async()=>{
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId('65c9c6bd9ad63b9340a7e667')
        }
    });
}

exports.createUser=async(user)=>{
    return await userModel.create(user);
};

exports.getUserById=async(id)=>{
    return await userModel.findById(id);
};

