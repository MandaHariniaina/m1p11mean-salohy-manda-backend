const db = require("../models");
const Service = db.service;
const serviceService = require('../services/service.service')
const mongooseError = require('mongoose').Error;
const mongoose = require("mongoose");

exports.createPromotion = async (req, res) => {
    try {
        let service = await serviceService.createPromotion(req.body.id, req.body);
        return res.status(200).send(service);
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};

exports.find = async (req, res) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        delete req.query.page; // remove page from request query
        delete req.query.limit; // remove limit from request query
        let services = await serviceService.find(req.query, page, limit);
        return res.status(200).send(services);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Erreur du serveur." });
    }
};

exports.delete = async (req, res) => {
    try {
        await serviceService.delete(req.body.id);
        return res.status(200).send({ message: "Service supprimé." })
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Ce service n'existe pas ou a déja été supprimé." });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
}

exports.update = async (req, res) => {
    try {
        let service = await serviceService.update(req.body);
        return res.status(200).send(service);
    } catch (error) {
        if (error instanceof mongooseError.ValidationError) {
            return res.status(400).send({ message: error.message });
        } else if (error instanceof mongooseError.DocumentNotFoundError) {
            return res.status(404).send({ message: "Ce service n'existe pas ou a déja été supprimé." });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};

exports.create = async (req, res) => {
    try{
        let service = await serviceService.save(req.body);
        return res.status(201).send(service);
    } catch(error) {
        if (error instanceof mongooseError.ValidationError){
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Erreur du serveur." });
        }
    }
};

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
        //console.log(err.message);
        await session.abortTransaction();
        await session.endSession();
        if(err instanceof mongooseError.ValidationError){
            return res.status(400).send({message:err.message});
        }
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

exports.findAllPaginateService=async(req,res)=>{
    try{
        const{page=1,limit=10}=req.query;
        const data_services=await serviceService.getPaginateService(page,limit);
        const count=(await serviceService.getAllService()).length;
        console.log(count);
        res.status(200).send({data:data_services,totalPages: Math.ceil(count / limit),
        currentPage: page,totalItems:count});
    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}