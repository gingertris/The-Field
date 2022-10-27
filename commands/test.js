import { SlashCommandBuilder } from "discord.js";
import { Region } from "../utils/enums";
import { promoteAndRelegate } from "../utils/match";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

        await promoteAndRelegate(interaction.client, Region.EU)
        await interaction.reply('Tested!');
    }
}