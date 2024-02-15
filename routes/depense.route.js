const { authJwt, depenseMiddleware } = require("../middlewares");
const controller = require("../controllers/depense.controller");
var express = require('express');
var router = express.Router();

router.delete('/', [authJwt.verifyToken, authJwt.estAdmin, depenseMiddleware.validateDeleteRequestBody], controller.delete);
router.put('/', [authJwt.verifyToken, authJwt.estAdmin, depenseMiddleware.validateUpdateRequestBody], controller.update);
router.post('/', [authJwt.verifyToken, authJwt.estAdmin, depenseMiddleware.validateCreateRequestBody], controller.create);
router.get('/', [authJwt.verifyToken, authJwt.estAdmin, depenseMiddleware.validateGetRequestParams], controller.findAll);

module.exports = router;
