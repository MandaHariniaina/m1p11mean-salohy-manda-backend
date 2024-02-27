const { log } = require("winston");
const Groupe = require("../models/groupe.model");

const { user, prestation: Prestation } = require("../models");
const mongoose = require("mongoose");
const userModel=require("../models/user.model");
const { CompteMontantError } = require("../exceptions");

// TODO optimization of employe find request
exports.getTempsTravailMoyen = async () => {
    let retour = [];
    let employes = await userModel.find({ }).populate('groupes').select('groupes nom prenom estVerifie estActif email');
    employes = employes.filter(employe => employe.groupes.some(groupe => groupe.nom === 'employe'));
    for(let i = 0; i < employes.length; i++){
        let employe = employes[i];
        let jourDeTravail = await this.getJourTravail(employe._id);
        let heuresDeTravail = await this.getHeureTravail(employe._id);
        if (jourDeTravail != 0){
            var tempsTravailMoyen = heuresDeTravail / jourDeTravail;
        } else {
            var tempsTravailMoyen = 0;
        }
        retour.push({
            employe: employe,
            tempsTravailMoyen,
        });
    }
    return retour;
};

exports.getHeureTravail = async (id) => {
    let heureTravail = await Prestation.aggregate([
        {
            $match: {
                gestionnaire: id
            }
        },
        {
            $group: {
                _id: "$user",
                sum: {
                    $sum: "$duree"
                }
            }
        }
    ]);
    if (heureTravail.length > 0) return heureTravail[0].sum / 60;
    return 0;
}

exports.getJourTravail = async (id) => {
    let jourTravail = await Prestation.aggregate([
        {
            $match: {
                gestionnaire: id
            }
        },
        {
            $project: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            }
        },
        {
          $group: {
            _id: "$date",
            count: {
              $sum: 1
            }
          }
        }
    ]);
    if (jourTravail.length > 0) return jourTravail[0].count;
    return 0;
};

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

exports.getPaginateEmploye=async(q = "", page, limit)=>{
    let groupe_id= await Groupe.findOne({nom:'employe'});
    const regex = new RegExp(`.*${q}.*`, 'i');
    return await userModel.find({
        'groupes': { $in: new mongoose.Types.ObjectId(groupe_id)},
        $or: [
            { nom: regex},
            { prenom: regex}
        ]
    }).limit(limit*1).skip((page-1)*limit).select({"password":0,"vers":0,"preferences":0});
}

exports.updateStatusEmploye=async(user_id,status)=>{
    return await userModel.findByIdAndUpdate(user_id,{'estActif':status},{
        new:true
    }).select({"password":0});
}//modification status utilisateur

exports.updateHoraireTravail = async (id, heureDebut, minuteDebut, heureFin, minuteFin) => {
    return await userModel.findByIdAndUpdate(id, {
        horaireTravail: {
            heureDebut: heureDebut,
            minuteDebut: minuteDebut,
            heureFin: heureFin,
            minuteFin: minuteFin,
        }
    }).select({"password":0});
}

exports.updateUser=async(body)=>{
    return await userModel.findByIdAndUpdate(body._id,body,{
        new:true
    }).select({"password":0});
}//modification utilisateur
 
exports.getEmploye=async()=>{
    let groupe_id= await Groupe.findOne({nom:'client'});
    return await userModel.find({
        'groupes': { $nin: new mongoose.Types.ObjectId(groupe_id._id)
        }
    });
}

exports.findByGroupName=async(name,page,limit)=>{
    let groupe_id= await Groupe.findOne({nom:name});
    if(page==0 && limit==0){     
        return await userModel.find({
            'groupes': { $in: new mongoose.Types.ObjectId(groupe_id)
            }
        }).select({"password":0,"vers":0,"preferences":0})
    }
    else{
        return await userModel.find({
            'groupes': { $in: new mongoose.Types.ObjectId(groupe_id)
            }
        }).limit(limit*1).skip((page-1)*limit).select({"password":0,"vers":0,"preferences":0})
    }
}


exports.filtreMulticritereUser=async(user)=>{
    console.log(user.createdAt);
    if(user.createdAt!=""){
        console.log("greatThan OR lessThan");
    }
    console.log(user);
    return await userModel.find(user);
}

exports.createUser=async(user)=>{
    
    return await userModel.create(user);
};

exports.getUserById=async(id)=>{
    return await userModel.findById(id).select({"password":0,"estVerifie":0,"estActif":0,"vers":0});
};

