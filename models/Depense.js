const mongoose = require('mongoose');
const require = require('mongoose')

const depenseSchema = mongoose.Schema({
    motif: String,
    montant: String,
});

const Depense = mongoose.model('Depense', depenseSchema);

module.exports = Depense