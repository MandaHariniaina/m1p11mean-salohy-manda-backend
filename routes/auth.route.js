const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
var express = require('express');
var router = express.Router();

router.post('/signup', [verifySignUp.checkDuplicateEmail, verifySignUp.checkGroupesExist], controller.signup);
router.post('/signin', controller.signin);
router.post('/signout', controller.signout);

module.exports = router;
