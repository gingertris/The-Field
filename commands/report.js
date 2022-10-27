import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getPlayer } from "../utils/helpers";
import { getMatch } from "../utils/match";
import { messageCaptains, reportMatch } from "../utils/report";

export default {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report Score")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Match ID to report")
                .setRequired(true)
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
        const matchId = interaction.options.getInteger('id')
        const result = interaction.options.getString('result');

        let player;
        try{
            player = await getPlayer(interaction.user.id);
 
        } catch(err){
            interaction.reply({content:`${err.message}`, ephemeral:true});
            return
        }

        if(!player.team){
            interaction.reply({content:`You aren't in a team, so you can't report scores.`, ephemeral:true});
            return
        }

        let match = await getMatch(matchId);

        if(match.winner_id != null) {
            interaction.reply({content:`This match has already been reported. If you think this match was reported incorrectly, please contact a moderator.`, ephemeral:true});
            return
        }

        let winner = 0;

        if(match.team1.id == player.team.id){
            if(result == "win"){
                winner = 1;
            } else if(result == "loss"){
                winner = 2;
            } else{
                interaction.reply({content:`Result needs to be either 'Win' or Loss.`, ephemeral:true});
                return
            }
        } else if(match.team2.id == player.team.id){
            if(result == "win"){
                winner = 2;
            } else if(result == "loss"){
                winner = 1;
            } else{
                interaction.reply({content:`Result needs to be either 'Win' or Loss.`, ephemeral:true});
                return
            }
        } else{
            interaction.reply({content:`Your team wasn't in this lobby, so you can't report the score.`, ephemeral:true});
            return
        }

        if(winner !=1 && winner != 2){
            interaction.reply({content:`Something went wrong, score wasn't reported.`, ephemeral:true});
            return
        }

        match = await reportMatch(match, winner);

        await messageCaptains(interaction.client, match)

        interaction.reply({content:`Scores have been reported, and Team Captains have been messaged details.`, ephemeral:true});
        return

    }
}