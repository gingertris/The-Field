import { SlashCommandBuilder } from "discord.js";
import { getPlayer, leaveTeam } from "../utils/helpers";

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

        await leaveTeam(player);

        interaction.reply({content:`You have left your team.`, ephemeral:true});

    }
}