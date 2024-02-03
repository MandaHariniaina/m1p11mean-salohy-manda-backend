const mongoose = require('mongoose');
const require = require('mongoose')

const prestationSchema = mongoose.Schema({
    montant_total: Number,
    client: Object,
    details: [
        {
            service: String,
            montant: Number,
        }
    ],
});

const Prestation = mongoose.model('Prestation', prestationSchema);

module.exports = Prestation