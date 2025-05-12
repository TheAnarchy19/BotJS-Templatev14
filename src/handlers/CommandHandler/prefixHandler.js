const { PermissionFlags } = require('../../utils/permissions');
const config = require('../../config/config');
const cooldowns = new Map();

module.exports = (client, prefixCommands, commandAliases, logger) => {
    client.on('messageCreate', async (message) => {
        // Verificar si es un servidor permitido
        if (message.guild && !config.allowedGuilds.includes(message.guild.id)) {
            return; // Ignorar mensajes de servidores no permitidos
        }

        if (message.author.bot) return;

        // Usar prefijo fijo para servidores privados
        const prefix = config.bot.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        let commandName = args.shift().toLowerCase();

        if (commandAliases.has(commandName)) {
            commandName = commandAliases.get(commandName);
        }

        const command = prefixCommands.get(commandName);
        if (!command) return;

        // Verificar permisos (simplificado para servidores privados)
        if (command.permissions && message.guild) {
            const missingPermissions = command.permissions.filter(permission => {
                const permissionFlag = PermissionFlags[permission];
                if (!permissionFlag) return false;
                const memberPermissions = BigInt(message.member.permissions.bitfield);
                return (memberPermissions & permissionFlag) !== permissionFlag;
            });

            if (missingPermissions.length > 0) {
                return message.reply(`Faltan permisos: ${missingPermissions.join(', ')}`);
            }
        }

        // Cooldown
        if (command.cooldown) {
            const currentTime = Date.now();
            const timeStamps = cooldowns.get(commandName) || new Map();
            const userTime = timeStamps.get(message.author.id);

            if (userTime && currentTime - userTime < command.cooldown * 1000) {
                const remainingTime = Math.ceil((command.cooldown * 1000 - (currentTime - userTime)) / 1000);
                const timestamp = Math.floor((currentTime + remainingTime * 1000) / 1000);
                return message.reply(`Espera <t:${timestamp}:R> para usar \`${commandName}\` de nuevo.`);
            }

            timeStamps.set(message.author.id, currentTime);
            cooldowns.set(commandName, timeStamps);
        }

        // Solo para propietario
        if (command.ownerOnly && message.author.id !== config.ownerInfo.ownerID) {
            return message.reply({ content: 'Solo el dueño puede usar este comando.', ephemeral: true });
        }

        // Loggear comando
        if (command.logcommand) {
            logger.logCommand(message, commandName);
        }

        // Ejecutar comando
        try {
            await command.execute(client, message, args, require('../../utils/emojis'));
        } catch (error) {
            const errorData = await logger.logCommand(message, commandName, error);
            await message.reply({ 
                embeds: [errorData.userEmbed],
                allowedMentions: { repliedUser: false }
            });
        }
    });
};