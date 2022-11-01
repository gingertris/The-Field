import { SlashCommandBuilder } from "discord.js";
import { archive, getArchive } from "../utils/archive";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

       
        await interaction.reply('Tested!');
    }
}