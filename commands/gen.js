import { SlashCommandBuilder , ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
//Generator command.
export default {
    data: new SlashCommandBuilder()
        .setName("gen")
        .setDescription("Generate queue button."),
    async execute(interaction){

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Join")
                .setCustomId('joinqueue')
        )
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Leave")
                .setCustomId("leavequeue")
            )

        interaction.channel.send({ components: [row]});

        interaction.reply({content:"Buttons generated.", ephemeral:true})

    }
}