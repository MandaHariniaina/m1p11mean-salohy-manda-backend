const cron = require('node-cron');
const { rendezVousService, mailService } = require("../services");

const rappel = () => {
    // cron.schedule('1 * * * * *', async () => { // every minute
    cron.schedule('0 0 * * *', async () => { // every day
        let listeRendezVous = await rendezVousService.findRappel();
        listeRendezVous.forEach( (rendezVous) => {
            mailService.sendRappelRendezVous(rendezVous.client, rendezVous.date, rendezVous.gestionnaire, rendezVous.prestations);
        });
    });
};

module.exports = {
    rappel
}