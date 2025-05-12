/**
 * ================================
 * Llamando a módulos
 * ================================
 */
const {Client, GatewayIntentBits, Events} = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
require('dotenv').config();


/**
 * ================================
 * Importación de Archivos Complementarios
 * ================================
 */
const config = require('./src/config/config');
const packageJson = require('./package.json');


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
    const files = fs.readdirSync(dir).filter(file => file !== 'premiumHandler.js');  // Asegurarse de que no se cargue premiumHandler.js

    for (const file of files) {
        const fullPath = path.join(dir, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            await loadFilesRecursively(fullPath, type);
            continue;
        }

        if (file.endsWith(".js")) {
            try {
                const module = require(fullPath);
                console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.blue(`Cargando ${type}: ${path.relative(__dirname, fullPath)}`));

                if (typeof module === 'object' && module.execute && !module.name) {
                    await module.execute(client);
                    console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.green(`✅ Handler cargado: ${path.basename(fullPath, '.js')}`));
                    continue;
                }

                if (module.name === Events.InteractionCreate) {
                    client.on(module.name, (...args) => module.execute(...args));
                } else if (module.name && module.execute) {
                    client.on(module.name, (...args) => module.execute(client, ...args));
                } else if (typeof module === "function") {
                    await module(client);
                }

                console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.green(`✅ Evento "${module.name || 'anonimo'}" registrado.`));
                
                if (module.description) {
                    console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.yellow(`📖 Descripción: ${module.description}`));
                    console.log(`━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━`.gray);
                }

            } catch (error) {
                console.error(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + colors.red(`❌ Error al cargar el archivo: ${fullPath}`), error);
            }
        }
    }
};


/**
 * ================================
 * Inicialización con Orden Garantizado
 * ================================
 */
const startBot = async () => {
    try {
        // 1. Cargar todos los handlers normales primero
        await loadFilesRecursively(path.join(__dirname, "./src/handlers"), "⚙️ Handler");
        
        // 2. Cargar todos los eventos después
        await loadFilesRecursively(path.join(__dirname, "./src/events"), "📣 Event");
        console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + "✅ Todos los eventos han sido cargados".yellow);

        // 3. Eliminar la carga del premium handler, ya no es necesario

        // Configurar evento ready
        client.on('ready', () => {
            console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + `✅ Bot iniciado como ${client.user.tag}`.yellow);

            require('./utils/server');
            console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + "🌐 Servidor web iniciado".blue);
        });

        // Iniciar sesión
        await client.login(process.env.BOT_TOKEN);
        console.log(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + "✅ BOT_TOKEN ha sido validado".green);

    } catch (error) {
        console.error(colors.bold.red(`${config.bot.name} ⌯ `) + "»".cyan + " " + '❌ Error crítico:'.red, error);
        process.exit(1);
    }
};

// Iniciar todo
startBot();
