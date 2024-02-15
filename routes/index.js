const auth = require("./auth.route");
const index = require("./index.route");
const service = require("./service.route");
const user = require("./user.route");

module.exports = {
    auth,
    index,
    service,
    user,
};