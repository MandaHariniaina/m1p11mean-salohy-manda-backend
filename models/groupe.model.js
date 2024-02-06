const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;

const groupeSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    users: [{
        type: SchemaTypes.ObjectId,
        ref: 'User',
    }],
},
{
    timestamps: true,
});

groupeSchema.pre('save', function (next) {
    if (this.isModified('users')) {
        // TODO add group to user document for each users
    }
    next();
});

const Groupe = mongoose.model('Groupe', groupeSchema);

module.exports = Groupe;