
//const controller = require("../controllers/services.controller");
/*var express = require('express');
var router = express.Router();

router.post('/create', controller.createService);
router.get('/getAll',controller.findAllService);
router.get('/getAllPaginate',controller.finAllPaginateService);*/

const { authJwt, serviceMiddleware, imageMiddleware } = require("../middlewares");
const controller = require("../controllers/service.controller");
var express = require('express');
var router = express.Router();
const multer = require('multer');
const { projectConfig } = require('../config');

router.get('/', controller.find);
router.post('/promotion', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validatePromotionRequestBody], controller.createPromotion);
router.get('/manager/find', [authJwt.verifyToken, serviceMiddleware.validateGetRequestQuery], controller.find);
router.delete('/manager/deleteService', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceDeleteRequestBody], controller.delete);
router.put('/manager/updateService', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceUpdateRequestBody], controller.update);
//router.post('/', [authJwt.verifyToken, authJwt.estAdmin, serviceMiddleware.validateServiceCreateRequestBody], controller.create);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("tongaaaaaaaaaaaaaaaaaaaaa");
        console.log(projectConfig.projectDirectory);
        cb(null, projectConfig.projectDirectory + '/public/images/services');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var memStorage = multer.memoryStorage();

// var upload = multer({ storage: storage });
var upload = multer({ storage: memStorage});

router.post('/manager/create', [  upload.single('image'), imageMiddleware.uploadImage], controller.create);
router.get('/manager/getAll', [authJwt.verifyToken],controller.findAllService);
router.get('/manager/allService',controller.findAllPaginateService);
module.exports = router;
