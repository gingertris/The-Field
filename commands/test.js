import { SlashCommandBuilder } from "discord.js";
import { Region } from "../utils/enums";
import { createMatches } from "../utils/matchmaking";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

        await createMatches(interaction.client, false, Region.EU);
        await interaction.reply('Tested!');
    }
}