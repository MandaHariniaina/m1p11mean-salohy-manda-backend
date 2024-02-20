const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;

const prestationSchema = new mongoose.Schema({
    montantTotal: Number,
    client: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    details: [
        {
            service: String,
            gestionnaire: {
                type: SchemaTypes.ObjectId,
                ref: 'User',
            },
            montant: Number,
        }
    ],
    paiement: {
        type: Map,
        of: Number,
    },
    montantPaye: Number,
    estPaye: Boolean,
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
    if (this.isModified(['paiement', 'montantTotal'])){
        (async () => {
            montantPaye = 0;
            for (let [compte, montant] of this.paiement) {
                montantPaye += montant;
            }
            this.montantPaye = montantPaye;
            if (this.montantTotal <= montantPaye){
                this.estPaye = true;
            } else {
                this.estPaye = false;
            }
            next();
        })();
    }
    if (this.isModified('details')) {
        (async () => {
            montantTotal = 0;
            for(let i = 0; i < this.details.length; i++){
                montantTotal += this.details[i].montant;
            }
            this.montantTotal = montantTotal;
            next();
        })();
    } else {
        next();
    }
});

const Prestation = mongoose.model('Prestation', prestationSchema);

module.exports = Prestation