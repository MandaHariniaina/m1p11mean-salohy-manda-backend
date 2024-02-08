const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;


const rendezvousSchema = mongoose.Schema({
    client:{
        type:SchemaTypes.ObjectId,
        ref:'user'
    },
    montant:{type:Number},
    gestionnaire: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    },
    prestations: [{
        service: {
            type: SchemaTypes.ObjectId,
            ref: 'service',
        },
        gestionnaire: {
            type: SchemaTypes.ObjectId,
            ref: 'user',
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