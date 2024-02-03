const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema({
        user: {
            type: String,
            required: [true, "Veuillez remplir le nom"],
        },
        prenom: {
            type: String,
            required: [true, "Veuillez remplir le(s) nom(s)"],
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', compteSchema);

module.exports = User