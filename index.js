/**
 * ================================
 * Creación del Cliente de Discord
 * ================================
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,                    // Acceso a eventos generales del servidor (nombre, región, etc.)
        GatewayIntentBits.GuildMessages,             // Leer mensajes enviados en canales del servidor
        GatewayIntentBits.GuildInvites,              // Detectar creación o eliminación de invitaciones
        GatewayIntentBits.MessageContent,            // Leer el contenido de los mensajes (requerido desde intents v2)
        GatewayIntentBits.GuildMembers,              // Acceder a miembros del servidor (requerido para ver usuarios)
        GatewayIntentBits.GuildPresences,            // Ver el estado de presencia (en línea, ausente, etc.)
        GatewayIntentBits.DirectMessages,            // Escuchar mensajes directos enviados al bot
        GatewayIntentBits.GuildVoiceStates,          // Detectar cambios en canales de voz (entradas/salidas, muteos, etc.)
        GatewayIntentBits.GuildEmojisAndStickers,    // Acceder a eventos relacionados con emojis y stickers
        GatewayIntentBits.GuildMessageReactions,     // Detectar reacciones agregadas o eliminadas a mensajes
        GatewayIntentBits.GuildModeration,           // Detectar acciones moderativas como bans, timeouts, etc.
        GatewayIntentBits.GuildWebhooks,             // Detectar cambios o actividades en webhooks del servidor
        GatewayIntentBits.GuildScheduledEvents       // Escuchar eventos programados del servidor
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