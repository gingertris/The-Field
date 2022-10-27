import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getPlayer, getTeam } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("Show team information.")
        .addStringOption(option => 
            option
                .setName('team')
                .setDescription("Show information of a certain team.")
        ),
    async execute(interaction){
        
        
        try{
            let team;
            if(interaction.options.getString("team")){
                team = await getTeam(interaction.options.getString("team"))
            } else{
                const player = await getPlayer(interaction.user.id)

                if(!player.team){
                    interaction.reply({content:"You aren't currently in a team.", ephemeral:true});
                    return;
                }
                team = await getTeam(player.team.name)
            }
            
            let usernames = team.players.map(p => p.username);
            let captain = await getPlayer(team.captain_id);

            const embed = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle(`Info for ${team.name}`)
            .addFields(
                {name: "Captain", value: `${captain.username}`},
                {name: "Members", value: `${usernames.join("\n")}`},
                {name: "Region", value: `${team.region}`},
                {name: "Division", value: `${team.division}`},
                {name: "Rating", value:`${team.rating}`}
            )

            interaction.reply({embeds:[embed], ephemeral:true})


        }catch(err){
            interaction.reply({content:`${err.message}`, ephemeral:true});
            console.log(err)
            return
        }



    }
}