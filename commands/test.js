import { SlashCommandBuilder } from "discord.js";
import { archive, getArchive } from "../utils/archive";
import { Region } from "../utils/enums";
import { createMatches } from "../utils/match";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

        await createMatches(interaction.client, false, Region.EU);
        await interaction.reply('Tested!');
    }
}