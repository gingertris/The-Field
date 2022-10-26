//(shamelessly stolen from discord.js tutorial), with slight modifications

import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
const guildId = process.env.GUILD_ID;
const clientId = "428307375124905994";
const token = process.env.BOT_TOKEN;

import commands from './utils/commands.js'

let commandsJSON = [];
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (let command of commands) {
	commandsJSON.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commandsJSON },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();