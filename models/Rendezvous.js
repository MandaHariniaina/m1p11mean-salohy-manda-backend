const mongoose = require('mongoose');
const require = require('mongoose')

const rendezvousSchema = mongoose.Schema({
    client: Object,
    services: [{
        service: Object,
        gestionnaire: Object,
    }],
    date: Date,
    dateFin: Date,
});

const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);

module.exports = Rendezvous