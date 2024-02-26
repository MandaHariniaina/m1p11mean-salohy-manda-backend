const { log } = require("winston");
const userService=require("../services/userService");
const { MongooseError } = require("mongoose");

const userModel=require("../models/user.model")
const { CompteMontantError } = require("../exceptions");

exports.getTempsTravailMoyen = async (req, res) => {
    try {
        let tempsTravailMoyen = await userService.getTempsTravailMoyen();
        return res.status(200).send(tempsTravailMoyen);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        let user = req.user;
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.compte = async (req, res) => {
    try{
        let user = await userService.compte(req.user._id, req.body);
        return res.status(200).send({ user: user, message: "Compte utilisateur mise à jour" })
    } catch (error) {
        if (error instanceof CompteMontantError){
            return res.status(406).send({ message: error.message });
        }
        return res.status(500).send({ message: error.message });
    }
};

exports.updatePreference = async (req, res) => {
    try{
        console.log(req.body._id)
        console.log(req.body.preferences[0])
        //let user = await userService.updatePreference(req.user._id, req.body);
        let user = await userService.updatePreference(req.body._id, req.body.preferences[0]);
        return res.status(200).send({ user: user, message: "Préference ajouter" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

exports.getPreference=async(req,res)=>{

}
exports.activate = async (req, res) => {
    try{
        await userService.updateUser({ '_id': req.body.id, 'estActif': true });
        let user = await userService.getUserById(req.body.id);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.deactivate = async (req, res) => {
    try{
        await userService.updateUser({ '_id': req.body.id, 'estActif': false });
        let user = await userService.getUserById(req.body.id);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}


exports.allAccess = (req, res) => {
    res.status(200).send("Contenu public.");
};

exports.clientAccess = (req, res) => {
    res.status(200).send("Contenu client.");
};

exports.employeAccess = (req, res) => {
    res.status(200).send("Contenu employe.");
};

exports.adminAccess = (req, res) => {
    res.status(200).send("Contenu admin.");
};

exports.allPersonnel= async (req,res)=>{
    const {page=1,limit=10}=req.query;
    try{
        const dataUser=await userService.getPaginateEmploye(page,limit);
        const count=(await userService.getEmploye()).length;
        console.log(count);
        res.status(200).send({data:dataUser,totalPages: Math.ceil(count / limit),
        currentPage: page,totalItems:count});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.allPersonnelEmploye= async (req,res)=>{
    const {name="employe",page=0,limit=0}=req.query;
    try{
        const dataUser=await userService.findByGroupName(name,page,limit);
        const count=(await userService.findByGroupName(name,0,0)).length;
        res.status(200).send({data:dataUser,totalPages: Math.ceil(count / limit),
        currentPage: page,totalItems:count});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.allPersonnelEmployePaginate= async (req,res)=>{
    const {name="employe"}=req.query;
    try{
        const dataUser=await userService.findByGroupName(name);
        res.status(200).send({data:dataUser});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.filterUser=async(req,res)=>{
    try{
        console.log(req.body);
        const dataUser=await userService.filtreMulticritereUser(req.body);
        res.status(200).send({data:dataUser});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}
exports.update_status=async(req,res)=>{
    try{
        console.log(req.body);
        const user_update_status=await userService.updateStatusEmploye(req.body._id,req.query.status)
        res.status(200).send({data:user_update_status});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.update_user=async(req,res)=>{
    try{
        const user_update=await userService.updateUser(req.body);
        res.status(200).send({user:user_update});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.addUser=async(req,res)=>{
    try{
        const user=await userService.createUser(req.body);
        res.status(200).send({data:user});
    }
    catch(err){
       
        res.status(500).send({error:err.message});
    }
}

exports.findUserById=async(req,res)=>{
    try{
        let data_users=await userService.getUserById(req.body._id);
        res.status(200).send({data:data_users});
    }
    catch(err){
        if(err instanceof MongooseError.ValidationError){
            res.status(401).send({message:err.message});
        }
        else{
            res.status(500).send({message:"erreur du serveur"});
        }
    }
}