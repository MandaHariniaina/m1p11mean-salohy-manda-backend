const authJwt = require("./authJwt.middleware");
const verifySignUp = require("./verifySignUp.middleware");
const serviceMiddleware = require("./service.middleware");

module.exports = {
    authJwt,
    verifySignUp,
    serviceMiddleware
};