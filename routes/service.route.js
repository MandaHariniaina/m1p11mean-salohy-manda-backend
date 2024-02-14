const { authJwt, serviceMiddleware } = require("../middlewares");
const controller = require("../controllers/service.controller");
var express = require('express');
var router = express.Router();

router.put('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceUpdateRequestBody], controller.update);
router.post('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceCreateRequestBody], controller.create);

module.exports = router;
