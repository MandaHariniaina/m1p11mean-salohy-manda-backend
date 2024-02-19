const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var express = require('express');
var router = express.Router();

router.get('/test/all', controller.allAccess);
router.get('/test/client', [authJwt.verifyToken], controller.clientAccess);
router.get('/test/employe', [authJwt.verifyToken, authJwt.estEmploye], controller.employeAccess);
router.get('/test/admin', [authJwt.verifyToken, authJwt.estAdmin], controller.adminAccess);
router.post('/test/addUser',controller.addUser);
router.get('/manager/allPersonnel',[authJwt.verifyToken],controller.allPersonnel);
router.get('/client/allPersonnelEmploye',controller.allPersonnelEmploye);
router.put('/manager/update_status',controller.update_status);
router.post('/getUserById',controller.findUserById);
router.put('/employe/update_user',controller.update_user);
module.exports = router;
