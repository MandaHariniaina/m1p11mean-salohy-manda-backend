const { authJwt } = require("../middlewares");
const controller = require("../controllers/service.controller");
var express = require('express');
var router = express.Router();

router.post('/', [authJwt.verifyToken, authJwt.estAdmin], controller.create);
module.exports = router;
