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

groupeSchema.static('setDefaultData', function(){
    const GROUPES = ["client", "employe", "administrateur"];
    GROUPES.forEach(async (groupe) => {
        const groupeId = await this.exists({nom: groupe});
        if(groupeId == null){
            await this.create({nom: groupe});
        }
    });
});

const Groupe = mongoose.model('Groupe', groupeSchema);

module.exports = Groupe;