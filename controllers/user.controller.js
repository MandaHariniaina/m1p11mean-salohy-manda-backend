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

exports.addUser=async(req,res)=>{
    try{
        const user=await userService.createUser(req.body);
        res.status(200).send({data:user});
    }
    catch(err){
       
        res.status(500).send({error:err.message});
    }
}