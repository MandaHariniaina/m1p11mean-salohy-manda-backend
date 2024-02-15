const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;

const prestationSchema = mongoose.Schema({
    montantTotal: Number,
    client: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    },
    details: [
        {
            service: String,
            gestionnaire: {
                type: SchemaTypes.ObjectId,
                ref: 'user',
            },
            montant: Number,
        }
    ],
    paiement: {
        type: Map,
        of: Number,
    },
    vers: {
        type: Number,
        default: 1.0,
        min: 1.0,
    },
},
{
    timestamps: true,
});

prestationSchema.pre('save', function (next) {
    if (this.isModified('details')) {
        montantTotal = 0;
        this.details.forEach(function (detailPrestation) {
            montantTotal += detailPrestation.montant;
        })
        this.montantTotal = this.montantTotal;
    }
    next();
});

const Prestation = mongoose.model('Prestation', prestationSchema);

module.exports = Prestation