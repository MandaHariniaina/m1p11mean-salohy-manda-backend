const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        nom: {
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

const User = mongoose.model('User', userSchema);

module.exports = User