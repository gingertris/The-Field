import { SlashCommandBuilder } from "discord.js";
import { captainCheck, getPlayer, getTeam, renameTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Rename a team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        ),
    async execute(interaction){
        
        let captain;
        try{
            captain = await getPlayer(interaction.user.id);
        } catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true})
            return
        }

        if(!(await captainCheck(captain))){
            interaction.reply({content:"You need to be a team captain to run this command.", ephemeral:true});
            return;
        }

        const team = await getTeam(captain.team.name);

        const teamname = interaction.options.getString("name");

        try{
            await renameTeam(team, teamname);
        } catch (err){
            interaction.reply({content:err.message, ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team has been renamed to "${teamname}".`, ephemeral:true});

    }
}