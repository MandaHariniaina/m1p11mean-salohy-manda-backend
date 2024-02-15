const auth = require("./auth.config");
const logger = require("./logger.config");
const transporter = require("./nodemailer.config");
const mongoosePaginate = require("./mongoosePaginate.config");

module.exports = {
    auth,
    logger,
    transporter,
    mongoosePaginate
};