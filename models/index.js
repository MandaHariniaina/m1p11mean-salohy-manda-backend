const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.groupe = require("./groupe.model");
db.refreshToken = require("./refreshToken.model");
db.service=require("./service.model");
db.depense=require("./depense.model");
db.prestation=require("./prestation.model");
db.rendezvous=require("./rendezvous.model")

db.GROUPES = ["client", "employe", "administrateur"];

module.exports = db;
