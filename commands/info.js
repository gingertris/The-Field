import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getPlayer, getUsername } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Show player information.")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Show information of a certain player.")
        ),
    async execute(interaction){
        const user = interaction.options.getUser('target') ?? interaction.user;
        
        try{
            const player = await getPlayer(user.id);
            
            console.log(player)

            const embed = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle(`Info for ${user.username}`)
            .addFields(
                {name: "Region", value: `${player.region}`},
                {name: "Team", value:`${player.team.name}`},
                {name: "Division", value:`${player.team.division}`},
                {name: "Rating", value:`${player.team.rating}`},
            )

            interaction.reply({embeds:[embed], ephemeral:true})


        }catch(err){
            interaction.reply({content:"Player not found. Are you registered? Use the `/register` command to register before you can do anything else.", ephemeral:true});
            console.log(err)
            return
        }



    }
}