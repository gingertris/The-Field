import { SlashCommandBuilder } from "discord.js";
import { archive, getArchive } from "../utils/archive";
import { Region } from "../utils/enums";
import { createMatches, promoteAndRelegate } from "../utils/match";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction){

        await archive(Region.EU);

        const archived = await getArchive("EU_20228");
        console.log(archived);
        console.log(archived.teams.map(t => t.players))
        await interaction.reply('Tested!');
    }
}