const { ActivityType } = require('discord.js');
const colors = require('colors');
const botConfig = require('../../config/config');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        try {
            const statusArray = [
                { name: `en Mantenimiento`, type: ActivityType.Custom },
            ];

            // Función para cambiar el estado
            const updateStatus = () => {
                try {
                    const randomStatus = statusArray[Math.floor(Math.random() * statusArray.length)];
                    client.user.setPresence({
                        activities: [randomStatus],
                        status: "dnd",
                    });
                } catch (error) {
                    console.error(`${botConfig.bot.name}`.green.bold + " " + "➭".cyan.bold + " " + `Error al cambiar estado:`.red, error);
                }
            };

            updateStatus();
            
            setInterval(updateStatus, 15000);
            
            console.log(`${botConfig.bot.name}`.green.bold + " " + "➭".cyan.bold + " " + `Bot listo como ${client.user.tag}`.blue);
            
        } catch (error) {
            console.error(`${botConfig.bot.name}`.green.bold + " " + "➭".cyan.bold + " " + `Error crítico:`.red, error);
        }
    }
}