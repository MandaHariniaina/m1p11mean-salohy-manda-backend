const { prestation: Prestation, depense: Depense } = require("../models");
const mongoose = require('mongoose');
const config = require('../config');
const { CompteInexistantError, CompteMontantError } = require("../exceptions");

exports.beneficeMois = async (mois, annee) => {
    let chiffreAffaireMois = await this.chiffreAffaireMois(mois, annee);
    let depenseMois = await this.depenseMois(mois, annee);
    return chiffreAffaireMois - depenseMois;
};

exports.depenseMois = async (mois, annee) => {
    let dateDebut = new Date(`${annee}-${mois}-01`);
    let dateFin = new Date(`${annee}-${mois}-01`);
    dateFin.setMonth(dateFin.getMonth() + 1);
    let depense = await Depense.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: dateDebut, // Date de début du mois
                    $lt: dateFin // Date de fin du mois
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$montant" }
            }
        }
    ]);
    if (depense.length > 0) return depense[0].total;
    else return 0;
};

exports.chiffreAffaireMois = async (mois, annee) => {
    let dateDebut = new Date(`${annee}-${mois}-01`);
    let dateFin = new Date(`${annee}-${mois}-01`);
    dateFin.setMonth(dateFin.getMonth() + 1);
    let chiffreAffaire = await Prestation.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: dateDebut, // Date de début du mois
                    $lt: dateFin // Date de fin du mois
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$montantPaye" }
            }
        }
    ]);
    if (chiffreAffaire.length > 0) return chiffreAffaire[0].total;
    else return 0;
};

exports.chiffreAffaireJour = async (date) => {
    let dateDebut = new Date(date);
    let dateFin = new Date(date);
    dateFin.setDate(dateFin.getDate() + 1);
    let chiffreAffaire = await Prestation.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: dateDebut, // Date de début du jour
                    $lt: dateFin // Date de debut du jour suivant
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$montantPaye" }
            }
        }
    ]);
    if (chiffreAffaire.length > 0) return chiffreAffaire[0].total;
    else return 0;
};

exports.paiement = async (id, user, compte) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let prestation = await Prestation.findById(id);
        if (!user._id.equals(prestation.client)) { // Check if connected user is the client associated with the prestation
            throw new CompteInexistantError("Le client ne peut payer qu'une prestation qui lui est associée");
        }
        if (!user.compte.has(compte)){ // Check if user has compte
            throw new CompteInexistantError("Compte de paiement non existant");
        }
        if (user.compte.get(compte) < prestation.montantTotal){ // Check if user compte is enough
            throw new CompteMontantError("Montant insuffisant");
        }
        prestation.paiement = new Map([[ compte, prestation.montantTotal ]]);
        prestation = await prestation.save({ session: session });
        user.compte.set(compte, user.compte.get(compte) - prestation.montantTotal);
        await user.save({ session: session });
        await session.commitTransaction();
        await session.endSession();
        return prestation;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}