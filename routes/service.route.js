
//const controller = require("../controllers/services.controller");
/*var express = require('express');
var router = express.Router();

router.post('/create', controller.createService);
router.get('/getAll',controller.findAllService);
router.get('/getAllPaginate',controller.finAllPaginateService);*/

const { authJwt, serviceMiddleware } = require("../middlewares");
const controller = require("../controllers/service.controller");
var express = require('express');
var router = express.Router();

router.delete('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceDeleteRequestBody], controller.delete);
router.put('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceUpdateRequestBody], controller.update);
//router.post('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceCreateRequestBody], controller.create);
router.post('/create', controller.createService);
router.get('/getAll',controller.findAllService);
router.get('/manager/allService',controller.findAllPaginateService);
module.exports = router;
