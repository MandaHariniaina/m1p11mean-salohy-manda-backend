const { transporter } = require('../config')

exports.sendConfirmationCompteMail = async (to) => {
    // Send confirmation mail
    var mailOptions = {
        from: process.env.MAIL_SENDER,
        to: to,
        subject: 'Confirmation par email',
        text: 'Cliquer boutton bla bla bla',
    };
    return transporter.sendMail(mailOptions);
} 