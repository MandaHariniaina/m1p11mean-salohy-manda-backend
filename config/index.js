const auth = require("./auth.config");
const logger = require("./logger.config");
const transporter = require("./nodemailer.config");
const mongoosePaginate = require("./mongoosePaginate.config");
const projectConfig = require("./project.config");

module.exports = {
    auth,
    logger,
    transporter,
    mongoosePaginate,
    projectConfig
};