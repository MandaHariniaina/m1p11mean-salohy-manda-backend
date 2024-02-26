const { verifySignUp, verifySignIn, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
var express = require('express');
var router = express.Router();
const multer = require('multer');
const { projectConfig } = require('../config');

router.get('/verification', controller.verify);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(projectConfig.projectDirectory);
        cb(null, projectConfig.projectDirectory + '/public/images/employe');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
    
});



var upload = multer({ storage: storage});

/* api */
router.post('/signup', [upload.single('image'),verifySignUp.checkDuplicateEmail,verifySignUp.validateRequestBody], controller.signup);
router.post('/signup/employe', 
    [authJwt.verifyToken, authJwt.estAdmin, verifySignUp.validateRequestBody, verifySignUp.checkDuplicateEmail, verifySignUp.checkGroupesExist], 
    controller.signupEmploye);
router.post('/signin', [verifySignIn.validateRequestBody], controller.signin);
// router.post('/signout', controller.signout);
router.post('/refreshtoken', controller.refreshToken);
/* --- */

module.exports = router;
