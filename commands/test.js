import { SlashCommandBuilder } from "discord.js";
import { archive, getArchive } from "../utils/archive";
import { Region } from "../utils/enums";
import { createMatches } from "../utils/match";
import { openQueue } from "../utils/queue";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

        await openQueue(interaction.client, Region.EU)
        await interaction.reply('Tested!');
    }
}