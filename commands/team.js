import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getPlayer, getTeam, getUsername } from "../utils/helpers";

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
            

            console.log(team.players);

            let usernames = [];

            for(let p in team.players){
                console.log(p);

                const member = await interaction.guild.members.fetch(p.id);
                usernames = [...usernames, member.user.username];    

                //let username = await getUsername(interaction.client, p.id);
                //usernames.push(username);
            }
      
            
            console.log(usernames)

            const embed = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle(`Info for ${team.name}`)
            .addFields(
                {name: "Captain", value: `${await getUsername(interaction, team.captain_id)}`},
                {name: "Members", value: `${usernames.join("\n")}`},
                {name: "Region", value: `${team.region}`},
                {name: "Division", value: `${team.division}`},
                {name: "Rating", value:`${team.rating}`}
            )

            interaction.reply({embeds:[embed], ephemeral:true})


        }catch(err){
            interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true});
            console.log(err)
            return
        }



    }
}