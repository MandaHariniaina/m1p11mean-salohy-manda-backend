const { prestation: Prestation } = require("../models");
const mongoose = require('mongoose');
const config = require('../config');
const { CompteInexistantError, CompteMontantError } = require("../exceptions");

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