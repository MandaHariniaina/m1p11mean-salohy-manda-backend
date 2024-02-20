const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const rendezvousSchema = new mongoose.Schema({
    client:{
        type:SchemaTypes.ObjectId,
        ref:'User'
    },
    montant: Number,
    duree: Number,
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
    vers: {
        type: Number,
        default: 1.0,
        min: 1.0,
    },
},
{
    timestamps: true,
});

rendezvousSchema.pre('save', function (next) {
    if (this.isModified('prestations')) {
        (async () => {
            let montant = 0;
            let duree = 0;
            const Service = require("./service.model");
            for(let i = 0; i < this.prestations.length; i++){
                const service = await Service.findById(this.prestations[i].service);
                console.log(service);
                montant += service.prix;
                duree += service.duree;
            }
            this.montant = montant;
            this.duree = duree;
            next();
        })();
        // TODO Set dateFin value
    } else {
        next();
    }
});

rendezvousSchema.plugin(mongoosePaginate);

const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);

module.exports = Rendezvous