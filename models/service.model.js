const mongoose = require('mongoose');
const slugify = require('slugify');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    promotions: {
        type: [{
            description: {
                type: String,
                require: true,
            },
            pourcentageReduction: {
                type: Number,
                require: true,
                min: 0,
                max: 100
            },
            dateDebut: {
                type: Date,
                required: true,
            },
            dateFin: {
                type: Date,
                required: true,
            }
        }],
        validate: {
            validator: function (promotions) {
                console.log(promotions);
                if(promotions) {
                    promotions.sort((a, b) => a.dateDebut - b.dateDebut);
                    for(let i = 0; i < promotions.length - 1; i++){
                        if (promotions[i].dateFin >= promotions[i + 1].dateDebut){
                            return false;
                        }
                    }
                }
                return true;
            },
            message: "L'intervalle de date d'une promotion chevauche avec l'intervalle d'une autre."
        }
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

serviceSchema.plugin(mongoosePaginate);

serviceSchema.virtual('estEnPromotion').get(function () {
    const currentDate = new Date();
    for (let i = 0; i < this.promotions.length; i++) {
        let promotion = this.promotions[i];
        if (promotion.dateDebut <= currentDate && promotion.dateFin >= currentDate){
            return true;
        }
    }
    return false;
});

serviceSchema.virtual('promotionActuelle').get(function () {
    const currentDate = new Date();
    for (let i = 0; i < this.promotions.length; i++) {
        let promotion = this.promotions[i];
        if (promotion.dateDebut <= currentDate && promotion.dateFin >= currentDate){
            return promotion;
        }
    }
    return null;
});

serviceSchema.virtual('prixPromotion').get(function() {
    if (this.estEnPromotion){
        return this.prix * (1 - (this.promotionActuelle.pourcentageReduction / 100))
    }
    return this.prix;
});


serviceSchema.pre('save', function (next) {
    if (this.isModified('nom')) {
        this.slug = slugify(this.nom, { lower: true });
    }
    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service