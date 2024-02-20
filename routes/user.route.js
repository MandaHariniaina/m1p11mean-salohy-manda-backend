const { authJwt, userMiddleware, verifyToken } = require("../middlewares");
const controller = require("../controllers/user.controller");
var express = require('express');
var router = express.Router();

router.get('/profile', [authJwt.verifyToken], controller.getProfile);
router.put('/compte', [authJwt.verifyToken, userMiddleware.validateCompteRequestBody], controller.compte);
router.patch('/preference', [authJwt.verifyToken, userMiddleware.validatePreferenceRequestBody], controller.updatePreference);
router.patch('/deactivate', [authJwt.verifyToken, authJwt.estAdmin, userMiddleware.validateDeactivateRequestParams], controller.deactivate);
router.get('/test/all', controller.allAccess);
router.get('/test/client', [authJwt.verifyToken], controller.clientAccess);
router.get('/test/employe', [authJwt.verifyToken, authJwt.estEmploye], controller.employeAccess);
router.get('/test/admin', [authJwt.verifyToken, authJwt.estAdmin], controller.adminAccess);
router.post('/test/addUser',controller.addUser);
router.get('/test/allUser',controller.allUser);
router.put('/employe/update_status',controller.update_status);
router.put('/employe/update_user',controller.update_user);
module.exports = router;
