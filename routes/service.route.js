
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

router.post('/promotion', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validatePromotionRequestBody], controller.createPromotion);
router.get('/manager/find', [authJwt.verifyToken, serviceMiddleware.validateGetRequestQuery], controller.find);
router.delete('/manager/deleteService', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceDeleteRequestBody], controller.delete);
router.put('/manager/updateService', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceUpdateRequestBody], controller.update);
//router.post('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceCreateRequestBody], controller.create);
router.post('/manager/create', [authJwt.verifyToken, authJwt.estAdmin], controller.createService);
router.get('/manager/getAll', [authJwt.verifyToken, authJwt.estAdmin],controller.findAllService);
router.get('/manager/allService', [authJwt.verifyToken, authJwt.estAdmin],controller.findAllPaginateService);
module.exports = router;
