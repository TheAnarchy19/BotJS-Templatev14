const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../../config/config');

const slashCommands = [];
const prefixCommands = new Map();
const commandAliases = new Map();

module.exports = async (client) => {
    client.commands = new Map();
    client.aliases = new Map();
    
    const logger = require('../../utils/log')(client);

    // Load command files
    const loadCommands = (commandsPath, isSlash) => {
        const commandFiles = [];
        
        // Scan root files
        commandFiles.push(
            ...fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        );

        // Scan subfolders
        const commandCategories = fs.readdirSync(commandsPath).filter(file =>
            fs.statSync(path.join(commandsPath, file)).isDirectory()
        );

        commandCategories.forEach((category) => {
            const categoryPath = path.join(commandsPath, category);
            commandFiles.push(
                ...fs.readdirSync(categoryPath).filter(file => file.endsWith('.js')).map(file => path.join(category, file))
            );
        });

        // Process files
        commandFiles.forEach((file) => {
            const commandPath = path.join(commandsPath, file);
            const command = require(commandPath);

            if (isSlash) {
                if (command.data && typeof command.execute === 'function') {
                    client.commands.set(command.data.name, command);
                    slashCommands.push(command.data.toJSON());
                }
            } else {
                if (command.name && typeof command.execute === 'function') {
                    prefixCommands.set(command.name, command);
                    if (command.alias && Array.isArray(command.alias)) {
                        command.alias.forEach(alias => commandAliases.set(alias, command.name));
                    }
                }
            }
        });
    };

    // Load commands
    loadCommands(path.join(__dirname, '../../../comandos/prefix'), false);
    loadCommands(path.join(__dirname, '../../../comandos/slash'), true);

    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    client.on('ready', async () => {
        try {
            console.log('Registering slash commands...'.green);
            await rest.put(Routes.applicationCommands(config.bot.clientId), { body: slashCommands });
            console.log('Slash commands registered successfully!'.yellow);
        } catch (error) {
            logger.logCommand(null, 'COMMAND_REGISTER', error, true);
        }
    });

    // Initialize handlers
    require('./prefixHandlerr')(client, prefixCommands, commandAliases, logger);
    require('./slashHandler')(client, logger);
};