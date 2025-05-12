const { PermissionFlags } = require('../../utils/permissions'); 
const config = require('../../botconfig/config');
const cooldowns = new Map();

module.exports = (client, logger) => {
    let isProcessing = false;
    
    client.on('interactionCreate', async (interaction) => {
        if (isProcessing) return;
        isProcessing = true;

        try {
            if (!interaction.isCommand()) return;
            
            // Verificar servidor permitido
            if (interaction.guild && !config.allowedGuilds.includes(interaction.guild.id)) {
                return interaction.reply({
                    content: '❌ Este bot no está disponible en este servidor',
                    ephemeral: true
                });
            }

            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply('Comando no disponible.');

            // Verificar permisos
            if (command.permissions && interaction.guild) {
                const missingPermissions = command.permissions.filter(permission => {
                    const permissionFlag = PermissionFlags[permission];
                    if (!permissionFlag) return false;
                    const memberPermissions = BigInt(interaction.member.permissions.bitfield);
                    return (memberPermissions & permissionFlag) !== permissionFlag;
                });

                if (missingPermissions.length > 0) {
                    return interaction.reply({
                        content: `Faltan permisos: ${missingPermissions.join(', ')}`,
                        ephemeral: true,
                    });
                }
            }

            // Solo para propietario
            if (command.ownerOnly && interaction.user.id !== config.ownerInfo.ownerID) {
                return interaction.reply({
                    content: 'Solo el dueño puede usar este comando.',
                    ephemeral: true,
                });
            }

            // Cooldown
            if (command.cooldown) {
                const currentTime = Date.now();
                const timeStamps = cooldowns.get(interaction.commandName) || new Map();
                const userTime = timeStamps.get(interaction.user.id);

                if (userTime && currentTime - userTime < command.cooldown * 1000) {
                    const remainingTime = Math.ceil((command.cooldown * 1000 - (currentTime - userTime)) / 1000);
                    const timestamp = Math.floor((currentTime + remainingTime * 1000) / 1000);
                    return interaction.reply({
                        content: `Espera <t:${timestamp}:R> para usar \`/${interaction.commandName}\` de nuevo.`,
                        ephemeral: true,
                    });
                }

                timeStamps.set(interaction.user.id, currentTime);
                cooldowns.set(interaction.commandName, timeStamps);
            }

            // Premium
            if (command.premium) {
                const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
                const hasPremiumRole = member?.roles.cache.has(config.server.premiumRoleID);

                if (!hasPremiumRole) {
                    return interaction.reply({ 
                        content: '🔐 Este comando es solo para usuarios con el rol **Premium**.\n' +
                                `Contacta a un administrador para obtenerlo.`,
                        ephemeral: true 
                    });
                }
            }

            // Loggear comando
            if (command.logcommand) {
                logger.logCommand(interaction, interaction.commandName, null, true);
            }

            await command.execute(interaction);
        } catch (error) {
            const errorData = await logger.logCommand(interaction, interaction.commandName, error, true);
            
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ 
                        embeds: [errorData.userEmbed],
                        ephemeral: true 
                    });
                } else {
                    await interaction.reply({ 
                        embeds: [errorData.userEmbed],
                        ephemeral: true 
                    });
                }
            } catch (replyError) {
                console.error('Error al responder:', replyError);
                const channel = interaction.channel || await interaction.user.createDM();
                await channel.send({
                    content: `❌ Error en \`/${interaction.commandName}\`. Código: \`${errorData.errorCode}\``
                });
            }
        } finally {
            isProcessing = false;
        }
    });
};