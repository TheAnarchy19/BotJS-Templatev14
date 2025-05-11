/**
 * ================================
 * Creación del Cliente de Discord
 * ================================
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration, // Para eventos de bans/timeouts
        GatewayIntentBits.GuildWebhooks,   // Para eventos de webhooks
        GatewayIntentBits.GuildScheduledEvents // Para eventos programados
    ]
});    


/**
 * ================================
 * Sistema de Carga Mejorado (Manteniendo tu estilo)
 * ================================
 */

const loadFilesRecursively = async (dir, type) => {
    const files = fs.readdirSync(dir).filter(file => file !== 'premiumHandler.js');

    for (const file of files) {
        const fullPath = path.join(dir, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            await loadFilesRecursively(fullPath, type);
            continue;
        }

        if (file.endsWith(".js")) {
            try {
                const module = require(fullPath);
                console.log(colors.bold.red("Hizuki ⌯ ") + "»".cyan + " " + colors.blue(`Cargando ${type}: ${path.relative(__dirname, fullPath)}`));

                if (typeof module === 'object' && module.execute && !module.name) {
                    await module.execute(client);
                    console.log(colors.bold.red("Hizuki ⌯ ") + "»".cyan + " " + colors.green(`✅ Handler cargado: ${path.basename(fullPath, '.js')}`));
                    continue;
                }

                if (module.name === Events.InteractionCreate) {
                    client.on(module.name, (...args) => module.execute(...args));
                } else if (module.name && module.execute) {
                    client.on(module.name, (...args) => module.execute(client, ...args));
                } else if (typeof module === "function") {
                    await module(client);
                }

                console.log(colors.bold.red("Hizuki ⌯ ") + "»".cyan + " " + colors.green(`✅ Evento "${module.name || 'anonimo'}" registrado.`));
                
                if (module.description) {
                    console.log(colors.bold.red("Hizuki ⌯ ") + "»".cyan + " " + colors.yellow(`📖 Descripción: ${module.description}`));
                    console.log(`━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━`.gray);
                }

            } catch (error) {
                console.error(colors.bold.red("Hizuki ⌯ ") + "»".cyan + " " + colors.red(`❌ Error al cargar el archivo: ${fullPath}`), error);
            }
        }
    }
};