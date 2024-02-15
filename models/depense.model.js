const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const depenseSchema = new mongoose.Schema({
    motif: { 
        type: String, 
        required: [true, "Le motif du dépense est obligatoire"] 
    },
    montant: { 
        type: Number, 
        required: [true, "Le montant du dépense est obligatoire"], 
        min: [0, "Le montant de la dépense ne peut être négative"] 
    },
},
{
    timestamps: true,
});

depenseSchema.plugin(mongoosePaginate);

const Depense = mongoose.model('Depense', depenseSchema);

module.exports = Depense