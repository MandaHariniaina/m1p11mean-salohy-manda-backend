const { log } = require("winston");
const userService=require("../services/userService");


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
    try{
        const dataUser=await userService.getEmploye();
        res.status(200).send({data:dataUser});
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