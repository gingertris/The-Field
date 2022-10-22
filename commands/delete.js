import { SlashCommandBuilder,  ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from "discord.js";
import { captainCheck, deleteTeam, getPlayer, getTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete team"),
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

        const deleteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Delete Team")
            .setCustomId('delete')

        const dontDeleteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("Keep Team")
            .setCustomId('keep')

        const row = new ActionRowBuilder()
            .addComponents(dontDeleteButton)
            .addComponents(deleteButton)

        const message = await interaction.reply({content:"Are you sure you want to delete your team? This cannot be undone.", components: [row], ephemeral:true, fetchReply:true})

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        try{
            const response = await message.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, max:1});
        
            const answer = response.customId;

            if(answer=="delete"){
                await deleteTeam(captain.team)
                interaction.followUp({content:`Team has been deleted.`,ephemeral:true});
            } else{
                interaction.followUp({content:`Team has not been deleted.`,ephemeral:true});
            }

        }catch(err){
            interaction.followUp({content:`Command timed out.`,ephemeral:true});
        }

    }
}