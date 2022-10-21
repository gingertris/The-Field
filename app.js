import { Client, GatewayIntentBits, Events, Collection } from "discord.js"
import * as dotenv from 'dotenv'
import sequelize from './utils/sequelize.js'
import models from './utils/models.js'
import commands from './utils/commands.js'
dotenv.config()

const client = new Client({intents:[GatewayIntentBits.Guilds]})
client.commands = new Collection();

//connect and sync database
try {
    await sequelize.authenticate();
    sequelize.sync();
    console.log('Connection has been established successfully.');

} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//on discord ready
client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//load commands (shamelessly stolen from discord.js tutorial)
for (const command of commands) {
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//handle interaction (shamelessly stolen from discord.js tutorial)
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.BOT_TOKEN);