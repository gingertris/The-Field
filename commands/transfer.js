import { SlashCommandBuilder } from "discord.js";
import { getPlayer, transferOwnership , captainCheck, getTeam} from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer ownership of team.")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Transfer ownership to this player.")
                .setRequired(true)
        ),
    async execute(interaction){
        const user = interaction.options.getUser('target');
        
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
        const newOwner = await getPlayer(user.id);

        try{
            await transferOwnership(team, newOwner)
        } catch (err){
            interaction.reply({content:err.message, ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team ownership has been transferred to ${user.username}.`, ephemeral:true});



    }
}