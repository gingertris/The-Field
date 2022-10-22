import { SlashCommandBuilder } from "discord.js";
import { captainCheck, deleteTeam, getPlayer, getTeamByID, leaveTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave team"),
    async execute(interaction){
        
        let player;
        try{
            player = await getPlayer(interaction.user.id);
        } catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true})
            return
        }

        if(!player.team){
            interaction.reply({content:`You already aren't in a team.`, ephemeral:true});
            return
        }
        

        const team = await getTeamByID(player.team.id);
        const members = team.players.length;

        if(captainCheck(player) && team.players.length > 1){
            interaction.reply({content:`You cannot leave a team you are the captain of, unless you are the only team member.\nPlease \`/transfer\` ownership of the team to someone else before leaving.`, ephemeral:true});
            return
        }

        await leaveTeam(player);
        let message = `You have left your team.`;

        if(members==1){
            await deleteTeam(team);
            message += `\nYou were the last member of your team, therefore the team has been deleted.`;
            
        }

        interaction.reply({content:message, ephemeral:true});


    }
}