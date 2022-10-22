import { SlashCommandBuilder } from "discord.js";
import { captainCheck, createInvite, getPlayer, getTeam, leaveTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a player from your team")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Player to kick from your team.")
                .setRequired(true)
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
        const playerUser = interaction.options.getUser("target");

        try{
            const player = await getPlayer(playerUser.id);

            if(player.team != captain.team) {
                interaction.reply({content:"The player you're kicking needs to be on your team to begin with.", ephemeral:true});
                return;
            }

            await leaveTeam(player);
            interaction.reply({content:`${playerUser.username} has been kicked from the team.`, ephemeral:true});
            return
        } catch (err) {
            interaction.reply({content:`${err.message} Are they registered?`, ephemeral:true});
            return
        }


        
    }
}