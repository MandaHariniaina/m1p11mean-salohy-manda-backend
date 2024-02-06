const auth = require("./auth.config");
const logger = require("./logger.config");
const transporter = require("./nodemailer.config");

module.exports = {
    auth,
    logger,
    transporter
};