const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;
const crypo = require('crypto');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Nom obligatoire"],
        trim: true,
    },
    prenom: {
        type: String,
        required: [true, "Prénom(s) obligatoire(s)"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email obligatoire"],
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} n'est pas une adresse email valide!`,
        },
    },
    password: {
        type: String,
        required: [true, "Mot de passe obligatoire"],
        trim: true,
    },
    salt: {
        type: String,
        required: true,
    },
    groupes: [{
        type: SchemaTypes.ObjectId,
        ref: "Groupe"
    }],
    contacts: {
        type: Map,
        of: String,
    },
    compte: {
        type: Map,
        of: Number,
    },
    preferences: [{
        employes: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',
        }],
        services: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',
        }],
    }],
    vers: {
        type: Number,
        default: 1.0,
        min: 1.0,
    }
},
{
    timestamps: true,
}
);

const User = mongoose.model('User', userSchema);

module.exports = User