import { Client, EmbedBuilder } from 'discord.js';
import EloRank from 'elo-rank';
import { Match } from '../entity/match';
import { setTeamGamesPlayed, setTeamRating } from './helpers';
import { updateMatch } from './match';

type winnerType = 1 | 2

export const reportMatch = async (match:Match, winnerVal:winnerType) => {

    const winner = winnerVal == 1 ? match.team1 : match.team2;
    const loser = winnerVal == 2 ? match.team1 : match.team2;

    const oldWinnerRating = winner.rating;
    const oldLoserRating = loser.rating;

    // eslint-disable-next-line prefer-const
    let {winner: newWinnerRating, loser: newLoserRating} = calcuateRating(oldWinnerRating, oldLoserRating)

    if(match.powerHour) {
        //1.5x multiplier
        let difference = newWinnerRating - oldWinnerRating;
        difference = difference * 1.5
        newWinnerRating = oldWinnerRating + difference;
    }

    const team1Difference = winnerVal == 1 ? newWinnerRating - oldWinnerRating : newLoserRating - oldLoserRating;
    const team2Difference = winnerVal == 2 ? newWinnerRating - oldWinnerRating : newLoserRating - oldLoserRating;

    await setTeamRating(winner, newWinnerRating)
    await setTeamRating(loser, newLoserRating)

    await setTeamGamesPlayed(winner, winner.gamesPlayed + 1);
    await setTeamGamesPlayed(loser, loser.gamesPlayed + 1);

    match.winner_id = winner.id;
    match.team1difference = team1Difference;
    match.team2difference = team2Difference;
    
    return await updateMatch(match);

}

const calcuateRating = (winner:number, loser:number) => {
    const elo = new EloRank(32);
    const expectedScoreWinner = elo.getExpected(winner, loser);
    const expectedScoreLoser = elo.getExpected(loser, winner);

    return {winner:elo.updateRating(expectedScoreWinner, 1, winner), loser: elo.updateRating(expectedScoreLoser, 0, loser)}

}

export const messageCaptains = async (client:Client, match:Match) => {

    const winners = match.team1.id == match.winner_id ? match.team1 : match.team2;
    const losers = match.team1.id == match.winner_id ? match.team2 : match.team1;

    const winnersDiff = match.team1.id == match.winner_id ? match.team1difference : match.team2difference;
    const losersDiff = match.team1.id == match.winner_id ? match.team2difference : match.team1difference;

    const embed = new EmbedBuilder()
        .setTitle("Score Reported")
        .setColor("Fuchsia")
        .setDescription(`Match #${match.id} was reported.`)
        .setTimestamp()
        .setFooter({text:`Match ID: ${match.id}`});
  
    embed.addFields({name:"Winner", "value":`${winners.name} (${winners.rating} +${winnersDiff})`, inline:true});
    embed.addFields({name:"Loser", "value":`${losers.name} (${losers.rating} ${losersDiff})`, inline:true});

    embed.addFields({name:"Is this wrong?", value:"If you believe this score was reported incorrectly, please contact a moderator."});


    (await client.users.fetch(match.team1.captain_id)).send({embeds:[embed]});
    (await client.users.fetch(match.team2.captain_id)).send({embeds:[embed]});
}