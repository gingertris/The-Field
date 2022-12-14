import { Client, GatewayIntentBits, Events, Collection } from "discord.js"
import * as dotenv from 'dotenv'
import commands from './utils/commands.js'
import { loadJobs } from "./utils/jobs"
import { handleJoinQueue, handleLeaveQueue, syncQueue } from "./utils/queue"
import router from './utils/router'
import express from 'express'
dotenv.config()


const client = new Client({intents:[GatewayIntentBits.Guilds]});

client.commands = new Collection();

//on discord ready
client.once(Events.ClientReady, async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	//load jobs
	loadJobs(client);

	//sync queue role perms
	await syncQueue(client);

	//start web server

	const port = 80;
	const app = express()
	app.set('view engine', 'ejs')
	app.set('views', './views')
	app.use('/', router);
	app.listen(port, ()=>console.log(`Express listening on port ${port}`))
});

//load commands (shamelessly stolen from discord.js tutorial)
for (const command of commands) {
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] A command is missing a required "data" or "execute" property.`);
	}
}


//handle command interaction (shamelessly stolen from discord.js tutorial)
client.on(Events.InteractionCreate, async interaction => {

	//handle queue buttons
	if (interaction.isButton()) {
		try{
			if (interaction.customId == 'joinqueue') return await handleJoinQueue(interaction);
			if (interaction.customId == 'leavequeue') return await handleLeaveQueue(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			return
		}
	}


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