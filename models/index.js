const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.groupe = require("./Groupe");

db.GROUPES = ["client", "employe", "administrateur"];

module.exports = db;
