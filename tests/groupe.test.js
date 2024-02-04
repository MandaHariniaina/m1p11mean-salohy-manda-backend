const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const Groupe = require('../models/Groupe');

// Set up Mongoose connection before tests
before((done) => {
  mongoose.connect(`${process.env.MONGO_URI_TEST}`);
  mongoose.connection.once('open', () => {
    console.log('DB connection opened');
    done();
  }).on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
});

// Clean up and close Mongoose connection after tests
after((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('Groupe Modele', () => {
  it('Test save groupe', async () => {
    const groupe = new Groupe({
      nom: 'client',
    });

    const savedGroupe = await groupe.save();
    expect(savedGroupe._id).to.exist;
    expect(savedGroupe.nom).to.equal('client');
  });

  it('should not save a user without required fields', async () => {
    const groupe = new Groupe({});

    try {
      await groupe.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors).to.have.property('nom');
    }
  });
});
