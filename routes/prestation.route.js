const { authJwt, prestationMiddleware } = require("../middlewares");
const controller = require("../controllers/prestation.controller");
var express = require('express');
var router = express.Router();

router.post('/paiement', [authJwt.verifyToken, prestationMiddleware.validatePaiementRequestBody], controller.paiement);

module.exports = router;
