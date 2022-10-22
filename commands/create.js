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

        
        let player;
        try{
            player = await getPlayer(interaction.user.id);
        } catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true})
            return
        }

        if(player.team) {
            interaction.reply({content:"You are already in a team. Please leave your current team if you want to make a new team.", ephemeral:true})
            return
        }

        const teamname = interaction.options.getString("name");

        try{
            await createTeam(teamname, player);
        } catch (err){
            interaction.reply({content:err.message, ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team "${teamname}" has been created.`, ephemeral:true});

    }
}