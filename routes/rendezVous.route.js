const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const { rendezVousController: controller } = require("../controllers");
const { rendezVousMiddleware } = require("../middlewares");

router.delete('/', [authJwt.verifyToken, rendezVousMiddleware.validateDeleteRequestBody], controller.delete);
router.get('/', [authJwt.verifyToken, rendezVousMiddleware.validateGetRequestParams], controller.findAll);
router.put('/', [authJwt.verifyToken, rendezVousMiddleware.validatePutRequestBody], controller.update);
router.post('/', [authJwt.verifyToken, rendezVousMiddleware.validatePostRequestBody], controller.create);

module.exports = router;