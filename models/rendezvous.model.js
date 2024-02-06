const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;
const require = require('mongoose')

const rendezvousSchema = mongoose.Schema({
    client: SchemaTypes.ObjectId,
    montant: Number,
    ref: 'User',
    gestionnaire: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    prestations: [{
        service: {
            type: SchemaTypes.ObjectId,
            ref: 'Service',
        },
        gestionnaire: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    }],
    date: Date,
    dateFin: Date,
},
{
    timestamps: true,
});

rendezvousSchema.pre('save', function (next) {
    if (this.isModified('prestations')) {
        montant = 0;
        this.prestations.forEach(function (prestation) {
            montant += prestation.service.montant;
        })
        this.montant = this.montant;
    }
    next();
});

const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);

module.exports = Rendezvous