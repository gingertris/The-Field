import { SlashCommandBuilder } from "discord.js";
import { Team } from "../entity/team";
import { getPlayer } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a new team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        ),
    async execute(interaction){

        const player = await getPlayer(interaction.user.id);
        if(!player){
            interaction.reply({content:"Player not found. Are you registered? Use the `/register` command to register before you can do anything else.", ephemeral:true})
            return
        }

        //await interaction.reply('Creating team...');
        //const team = new Team()
        //team.name = interaction.options.getString("name")

    }
}