import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report Score")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Set your username")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(1)

        )
        .addStringOption(option => 
            option
                .setName("result")
                .setDescription("Match Result")
                .setRequired(true)
                .addChoices(
                    {name:"Win", value:"win"},
                    {name:"Loss", value:"loss"}
                )
        ),
    async execute(interaction){
      
    }
}