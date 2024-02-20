const { log } = require("winston");
const userService=require("../services/userService");
const userModel=require("../models/user.model")
const { CompteMontantError } = require("../exceptions");

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
        let user = await userService.updatePreference(req.user._id, req.body);
        return res.status(200).send({ user: user, message: "Compte utilisateur désactivé" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

exports.deactivate = async (req, res) => {
    try{
        await userService.updateUser({ '_id': req.body.id, 'estActif': false });
        let user = await userService.getUserById(req.body.id);
        return res.status(200).send({ user: user, message: "Compte utilisateur désactivé" })
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

exports.allUser= async (req,res)=>{
    const {page=1,limit=10}=req.query;
    try{
        const dataUser=await userService.getPaginateEmploye(page,limit);
        const count=(await userService.getEmploye()).length;
        console.log(count);
        res.status(200).send({data:dataUser,totalPages: Math.ceil(count / limit),
        currentPage: page});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

exports.update_status=async(req,res)=>{
    try{
        console.log(req.body);
        const user_update_status=await userService.updateStatusEmploye(req.body._id,req.query.status)
        res.status(200).send({user:user_update_status});
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