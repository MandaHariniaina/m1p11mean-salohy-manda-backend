const mongoose = require('mongoose');
const require = require('mongoose')

const depenseSchema = mongoose.Schema({
    motif: String,
    montant: String,
},
{
    timestamps: true,
});

const Depense = mongoose.model('Depense', depenseSchema);

module.exports = Depense