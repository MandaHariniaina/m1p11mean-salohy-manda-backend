const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const db = require('../../models')
const Service = db.service;

// Set up Mongoose connection before tests
before((done) => {
	mongoose.connect(`${process.env.MONGO_URI_TEST}`);
	mongoose.connection.once('open',async () => {
		await Service.deleteMany({});
		done();
	}).on('error', (error) => {
		console.error('MongoDB connection error:', error);
	});
});

// Clean up and close Mongoose connection after tests
after(async () => {
	await Service.deleteMany({})
	await mongoose.connection.close();
});

it('Test save service', async() => {
    let service = new Service({
        nom: 'Pédicure',
        prix: 10000,
        duree: 45,
        commission: 8.5
    });

    let savedService = await service.save();
    expect(savedService._id).to.exist;
    expect(savedService.nom).to.equal('pédicure');
    expect(savedService.prix).to.equal(10000);
    expect(savedService.duree).to.equal(45);
    expect(savedService.commission).to.equal(8.5);
    expect(savedService.slug).to.equal('pedicure');
});

describe('Service model validation', async () => {
    it('Should not validate a service with negative price', async () =>{
        let service = new Service({
            nom: 'Pédicure',
            prix: -1000,
            duree: 20,
            commission: 7
        });
        try {
            await service.validate();
            throw new Error('Validation should have failed'); 
        } catch (error) {
            expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
            expect(error.errors['prix']).to.exists;
        }
    });
    it('Should not validate a service with negative duree', async () =>{
        let service = new Service({
            nom: 'Pédicure',
            prix: 1000,
            duree: -20,
            commission: 7
        });
        try {
            await service.validate();
            throw new Error('Validation should have failed'); 
        } catch (error) {
            expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
            expect(error.errors['duree']).to.exists;
        }
    });
    it('Should not validate a service with negative commission or commission > 100', async () =>{
        let service = new Service({
            nom: 'Pédicure',
            prix: 1000,
            duree: 20,
            commission: -7
        });
        try {
            await service.validate();
            throw new Error('Validation should have failed'); 
        } catch (error) {
            expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
            expect(error.errors['commission']).to.exists;
        }
        service = new Service({
            nom: 'Pédicure',
            prix: 1000,
            duree: 20,
            commission: 101
        });
        try {
            await service.validate();
            throw new Error('Validation should have failed'); 
        } catch (error) {
            expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
            expect(error.errors['commission']).to.exists;
        }
    });
});


// describe('', () => {
// 	it('Test save groupe', async () => {
// 		const groupe = new Groupe({
// 			nom: 'test groupe',
// 		});

// 		const savedGroupe = await groupe.save();
// 		expect(savedGroupe._id).to.exist;
// 		expect(savedGroupe.nom).to.equal('test groupe');
// 	});
// });
