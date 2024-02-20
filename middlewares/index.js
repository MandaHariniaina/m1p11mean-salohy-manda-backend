const authJwt = require("./authJwt.middleware");
const verifySignUp = require("./verifySignUp.middleware");
const serviceMiddleware = require("./service.middleware");
const depenseMiddleware = require("./depense.middleware");
const verifySignIn = require("./signIn.middleware");
const userMiddleware = require('./user.middleware');
const rendezVousMiddleware = require("./rendezVous.middleware");
const prestationMiddleware = require("./prestation.middleware");

module.exports = {
    authJwt,
    verifySignUp,
    serviceMiddleware,
    depenseMiddleware,
    verifySignIn,
    userMiddleware,
    rendezVousMiddleware,
    prestationMiddleware
};