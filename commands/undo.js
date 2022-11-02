import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getPlayer } from "../utils/helpers";
import { getMatch, undoMatch } from "../utils/match";
import { messageCaptains, reportMatch } from "../utils/report";

export default {
    data: new SlashCommandBuilder()
        .setName("undo")
        .setDescription("Undo match")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Match ID to undo")
                .setRequired(true)
        ),
    async execute(interaction){
        const matchId = interaction.options.getInteger('id')

        let player;
        try{
            player = await getPlayer(interaction.user.id);
 
        } catch(err){
            interaction.reply({content:`${err.message}`, ephemeral:true});
            return
        }

        let match = await getMatch(matchId);

        if(match.winner_id == null) {
            interaction.reply({content:`This match hasn't been played yet. To cancel the match, use \`/cancel.\``, ephemeral:true});
            return
        }

        await undoMatch(match);

        interaction.reply({content:`Match undone. You can now report correctly.`, ephemeral:true});
        return

    }
}