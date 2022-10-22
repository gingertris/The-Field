import { SlashCommandBuilder } from "discord.js";
import { answerInvite, getPlayer } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear all  your invites."),
    async execute(interaction){
        let player;
        try{
            player = await getPlayer(interaction.user.id);
        } catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the `/register` command to register before you can do anything else.`, ephemeral:true})
            return
        }
        player.invites.forEach(async invite => {
            await answerInvite(invite);
        })
        interaction.reply({content:`Invites cleared.`, ephemeral:true})
    }
}