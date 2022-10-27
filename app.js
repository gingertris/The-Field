import { Client, GatewayIntentBits, Events, Collection } from "discord.js"
import * as dotenv from 'dotenv'
import commands from './utils/commands.js'
import { Jobs } from "./utils/matchmaking"
import { handleJoinQueue, handleLeaveQueue } from "./utils/queue"
dotenv.config()


const client = new Client({intents:[GatewayIntentBits.Guilds]});

client.commands = new Collection();

//on discord ready
client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
	//load jobs
	Jobs.forEach(job=>{
		job(client);
		console.log(`Loaded job ${job.name}`)
	})
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