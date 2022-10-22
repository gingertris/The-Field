import { SlashCommandBuilder } from "discord.js";
import { captainCheck, createInvite, getPlayer, getTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite a player to your team")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Player to invite to your team.")
                .setRequired(true)
        ),
    async execute(interaction){
        let captain;
        try{
            captain = await getPlayer(interaction.user.id);
        } catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the `/register` command to register before you can do anything else.`, ephemeral:true})
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
            await createInvite(player, team);
            interaction.reply({content:`Invite sent. ${playerUser.username} can join ${team.name} by using the \`/join\` command.`, ephemeral:true});
            return
        } catch (err) {
            interaction.reply({content:`${err.message} Are they registered?`, ephemeral:true});
            return
        }


        
    }
}