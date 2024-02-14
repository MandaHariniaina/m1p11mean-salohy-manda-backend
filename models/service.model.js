const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom du service est requis'],
        trim: true,
        lowercase: true,
        unique: true,
        collation: { locale: 'fr', strength: 2 }
    },
    prix: {
        type: Number,
        required: [true, 'Le prix du service est requis'],
        min: 0,
    },
    duree: {
        type: Number,
        required: [true, 'La durée du service doit être spécifiée'],
        min: 0,
    },
    commission: {
        type: Number,
        required: [true, 'La commission doit être spécifiée'],
        min: 0,
        max: 100,
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
    },
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

serviceSchema.pre('save', function (next) {
    if (this.isModified('nom')) {
        this.slug = slugify(this.nom, { lower: true });
    }
    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service