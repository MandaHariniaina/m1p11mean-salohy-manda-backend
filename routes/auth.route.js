const { verifySignUp, verifySignIn, authJwt, imageMiddleware } = require("../middlewares");
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

var memStorage = multer.memoryStorage();


// var upload = multer({ storage: storage});
var upload = multer({ storage: memStorage});

/* api */
router.post('/signup', [upload.single('image'),verifySignUp.validateRequestBody, verifySignUp.checkDuplicateEmail, imageMiddleware.uploadImage], controller.signup);
router.post('/signup/employe', 
    [authJwt.verifyToken, authJwt.estAdmin, upload.single('image'), verifySignUp.validateRequestBody, verifySignUp.checkDuplicateEmail, imageMiddleware.uploadImage], 
    controller.signupEmploye);
router.post('/signin', [verifySignIn.validateRequestBody], controller.signin);
// router.post('/signout', controller.signout);
router.post('/refreshtoken', controller.refreshToken);
/* --- */

module.exports = router;
