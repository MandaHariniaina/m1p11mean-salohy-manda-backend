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

exports.sendRappelRendezVous = async(client, date, gestionnaire, prestations) => {
    readHTMLFile(projectConfig.projectDirectory + '/views/rappelRendezVous.html', function(err, html) {
        var template = handlebars.compile(html);
        const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let servicesData = "";
        for(let i = 0; i < prestations.length; i++){
            servicesData += prestations[i].service.nom;
            if (i != prestations.length - 1){
                servicesData += ", ";
            } else {
                servicesData += ".";
            }
        }
        var replacements = {
            client: `${client.nom} ${client.prenom}`,
            date: date.toLocaleDateString('fr-FR', dateFormatOptions),
            gestionnaire: `${gestionnaire.nom} ${gestionnaire.prenom}`,
            services: servicesData,
        };
        var htmlToSend = template(replacements);
        // Send confirmation mail
        var mailOptions = {
            from: process.env.MAIL_SENDER,
            to: "andriamitantsoamanda@gmail.com",
            // to: client.email,
            subject: 'Rappel de rendez-vous',
            html : htmlToSend
        };
        return transporter.sendMail(mailOptions);
    });
}

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