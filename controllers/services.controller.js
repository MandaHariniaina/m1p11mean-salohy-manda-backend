const db = require("../models");
const Service = db.sevice;
const serviceService=require("../services/service.services");
const mongoose = require("mongoose");
const serviceModel=require("../models/service.model")

exports.createService=async(req,res)=>{
    const session =await mongoose.startSession();
    session.startTransaction();
    let service= new Service(req.body);
    try{
        await service.save({session:session});
        await session.commitTransaction();
        await session.endSession();
        return res.status(200).send({message:"success"});
    }
    catch(err){
        console.log(err.message);
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).send({message:"erreur d'ajout de service"});
    }  
}

exports.updateService=async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    let service=new Service(req.body);
    try{
        await service.save({session:session});
        await session.commitTransaction();
        await session.endSession();
        return res.status(200).send({message:"success"});
    }
    catch(err){
        console.log(err.message);
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).send({message:"erreur d'ajout de service"});
    }  
}

exports.findAllService=async(req,res)=>{
    try{
        const data_services=await serviceService.getAllService();
        return res.status(200).send({data:data_services})
    }
    catch(err){
        return res.status(500).send({error:err.message})
    }

}

exports.finAllPaginateService=async(req,res)=>{
    try{
        const{page=1,limit=10}=req.query;
        const data_services=await serviceService.getPaginateService(page,limit);
        const count=(await serviceService.getAllService()).length;
        console.log(count);
        res.status(200).send({data:data_services,totalPages: Math.ceil(count / limit),
        currentPage: page});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}