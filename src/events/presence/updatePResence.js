const { ActivityType } = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const config = require('../../config/config')

// Función para contar comandos (solo premium en 'comandos/')
async function getCommandStats() {
    const comandosPath = path.join(__dirname, "../../comandos/prefix");
    const ignoredFolders = ["Secretos"];

    let totalComandos = 0;
    let totalPremium = 0;

    // Leer categorías de comandos (excepto las ignoradas)
    const categoriasComandos = fs.readdirSync(comandosPath).filter(
        folder => !ignoredFolders.includes(folder) && fs.statSync(path.join(comandosPath, folder)).isDirectory()
    );

    // Contar comandos normales y premium
    for (const categoria of categoriasComandos) {
        const commandFiles = fs.readdirSync(path.join(comandosPath, categoria)).filter(file => file.endsWith(".js"));
        commandFiles.forEach(file => {
            const command = require(path.join(comandosPath, categoria, file));
            if (command.premium) totalPremium++;
            totalComandos++;
        });
    }

    return { totalComandos, totalPremium };
}

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.bold.yellow(`Conectando la presencia en `+`${client.user.tag}`.cyan));

        async function getTotals() {
            const totalGuilds = client.guilds.cache.size;
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const totalComandos = await getCommandStats(); // Solo premium en 'comandos/'

            return { 
                totalGuilds, 
                totalMembers, 
                totalComandos: totalComandos.totalComandos,
                totalPremium: totalComandos.totalPremium
            };
        }

        async function updatePresence() {
            try {
                const { 
                    totalGuilds, 
                    totalMembers, 
                    totalComandos,
                    totalPremium
                } = await getTotals();

                // Estados personalizados (incluye solo comandos premium de 'comandos/')
                const statusArray = [
                    { name: `📄 ${totalComandos} comandos | /help`, type: ActivityType.Custom },
                    { name: `💎 ${totalPremium} comandos premium`, type: ActivityType.Custom },
                    { name: `👥 ${totalMembers} usuarios`, type: ActivityType.Custom },
                    { name: `🌎 ${totalGuilds} servidores`, type: ActivityType.Custom },
                    { name: `🔧 Soporte: discord.gg/Ycc5jgj4h6`, type: ActivityType.Custom },
                ];

                const randomStatus = statusArray[Math.floor(Math.random() * statusArray.length)];
                await client.user.setPresence({
                    activities: [randomStatus],
                    status: "online",
                });

            } catch (error) {
                console.error(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.red("❌ Error al actualizar estado:"), error);
            }
        }

        // Eventos que actualizan el estado
        const events = ["guildCreate", "guildDelete", "guildMemberAdd", "guildMemberRemove"];
        events.forEach(event => client.on(event, updatePresence));

        await updatePresence();
        setInterval(updatePresence, 15000);
    },
};
