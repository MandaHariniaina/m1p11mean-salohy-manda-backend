const cron = require('node-cron');
const { serviceService, userService, mailService } = require("../services");

const notifierPromotion = cron.schedule('0 0 * * * *', async () => { // every minute
    let servicePromotions = await serviceService.getPromotions();
    let clients = await userService.findByGroupName('client', 0, 0);
    clients.forEach(client => {
        mailService.sendNotificationOffreSpecial(client, servicePromotions);
    });
}, {
    scheduled: false
});

module.exports = {
    notifierPromotion
}