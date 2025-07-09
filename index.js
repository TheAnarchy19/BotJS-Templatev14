const path = require('path');
const colors = require('colors');
const https = require('https')
const fs = require('fs')

require('dotenv').config({ path: './.env'}) // -= Definimos la ruta del .env =-
require('events').EventEmitter.defaultMaxListeners = 50;

const botconfig = require('./src/config/config')
const packageJson = require('./package.json');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { type } = require('os');
const { dir } = require('console');

console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold)
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
client.config = {...botconfig};

const loadFilesRecursively = async (dir, type) => {
    const files = fs.readdirSync(dir);

    for(const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            await loadFilesRecursively(fullPath, type);
            continue;
        }
        if (file.endsWith(".js")) {
            try {
                const module = require(fullPath);
                console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Cargando ${type}: ${path.relative(__dirname, fullPath)}`.blue)

                if (typeof module == "object" && module.execute && !module.name) {
                    await module.execute(client);
                    console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Handler cargado: ${path.basename(fullPath, '.js')}`.green)
                    continue;
                }
                    if (Object.values(Events).includes(module.name)) {
                        if (module.name === Events.InteractionCreate) {
                            client.on(module.name, (interaction) => module.execute (interaction, client));

                        } else {
                            client.on(module.name, (...args) => module.execute(client, ...args));
                        }
                        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Evento Discord.js "${module.name}" registrado`.green);
                    }
                    else if (typeof module === 'object' && module.execute && module.name) {
                        await module.execute(client);
                        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Handler ${module.name} cargado.`.green);
                    }
                    else if (typeof module === "function") {
                        await module(client);
                        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Funcion anonima ejecutada`.yellow);
                        
                    }
                    else {
                        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Módulo no reconocido: ${path.basename(fullPath, '.js')}`.red);
                    }
                    if (module.description) {
                        console.error(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Descripción: ${module.description}` );
                    }
                
            } catch (error) {
                console.error(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Error al cargar el archivo ${fullPath}`.yellow, error);
                console.log(`━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━━━━━━━━━ • ━━━━━━━━`.gray);
            }
        }
    }
}

const startbot = async () => {
    try {
        await loadFilesRecursively(path.join(__dirname, "./src/handlers"), "Handlers");
        
        await loadFilesRecursively(path.join(__dirname, "./src/events"), "Events");
        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Los eventos y handlers fueron cargados`.yellow);
    
        await client.login(process.env.BOT_TOKEN);
        console.log(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Token del bot fue vlidado`.green);

    } catch (error) {
        console.error(`${botconfig.bot.name}`.green.bold+" "+ "➭".cyan.bold+" "+`Error crítico:`.red, error);
    }
}
startbot();