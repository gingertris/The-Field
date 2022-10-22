import { SlashCommandBuilder } from "discord.js";
import { Team } from "../entity/team";
import { createTeam, getPlayer } from "../utils/helpers";

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

        const teamname = interaction.options.getString("name");

        try{
            await createTeam(teamname, interaction.user.id);
        } catch (err){
            interaction.reply({content:err.message, ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team "${teamname}" has been created.`, ephemeral:true});

    }
}