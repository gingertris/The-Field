import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle , ComponentType } from "discord.js";
import { addPlayerToTeam, answerInvite, getInvite, getPlayer, getTeam, getTeamByID } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a team by accepting an invite."),
    async execute(interaction){
        let player;
        try{
            player = await getPlayer(interaction.user.id);
            if(player.team){
                throw new Error("You are already in a team. Please `/leave` your current team to join a new one.")
            }
        } catch(err){
            interaction.reply({content:err.message, ephemeral:true})
            return;
        }

        const invites = player.invites.filter(i => !i.answered);
        //const teams = invites.map(async invite => await getTeamByID(invite.team.id))
        if(invites.length == 0){
            interaction.reply({content:"You have no invites.", ephemeral:true})
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle("Join team")
            .setDescription("Accept an invite to join a team.");

        const selectMenu = new SelectMenuBuilder()
            .setCustomId('join')
            .setPlaceholder("Select a team");

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
            .setCustomId("cancel")

        invites.forEach(invite => {
            selectMenu.addOptions(
                {
                    label: invite.team.name,
                    value: `${invite.id}`
                }
            )
        });

        const row1 = new ActionRowBuilder()
            .addComponents(
                selectMenu
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                button
            )


        
        const message = await interaction.reply({embeds:[embed], components: [row1, row2], ephemeral:true, fetchReply:true})

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        const response = await message.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu && ComponentType.Button, time: 60000, max:1});

        if(response.customId=="cancel"){
            await interaction.followUp({content:`Join cancelled.`,ephemeral:true})
            
            return
        }

        console.log(response);
        
        const invite = await getInvite(parseInt(response.values[0]));
        const team = await getTeamByID(invite.team.id);
        
        await addPlayerToTeam(player, team);
        await answerInvite(invite);
        

        interaction.followUp({content:`You have joined "${team.name}"!`,ephemeral:true});

    }
}