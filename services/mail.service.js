const { transporter, projectConfig } = require('../config');
const handlebars = require("handlebars");
const fs = require("fs");

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

exports.sendConfirmationCompteMail = async (user, verificationToken) => {
    readHTMLFile(projectConfig.projectDirectory + '/views/userVerification.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
             username: `${user.nom} ${user.prenom}`,
             link: `${projectConfig.projectUrl}/auth/verification?token=${verificationToken}`
        };
        var htmlToSend = template(replacements);
        // Send confirmation mail
        var mailOptions = {
            from: process.env.MAIL_SENDER,
            to: user.email,
            subject: 'Confirmation de compte',
            html : htmlToSend
        };
        return transporter.sendMail(mailOptions);
    });
}