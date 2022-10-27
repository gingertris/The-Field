import EloRank from 'elo-rank';
import { setTeamGamesPlayed, setTeamRating } from './helpers';
import { getMatch } from './match';

type winnerType = 1 | 2

const reportMatch = async (matchId:number, winnerVal:winnerType) => {

    const match = await getMatch(matchId);

    const winnerTeam = winnerVal == 1 ? match.team1 : match.team2;
    const loserTeam = winnerVal == 2 ? match.team1 : match.team2;

    const {winner, loser} = calcuateRating(winnerTeam.rating, loserTeam.rating)

    await setTeamRating(winnerTeam, winner)
    await setTeamRating(loserTeam, loser)

    await setTeamGamesPlayed(winnerTeam, winnerTeam.gamesPlayed + 1);
    await setTeamGamesPlayed(loserTeam, loserTeam.gamesPlayed + 1);
    
}

const calcuateRating = (winner:number, loser:number) => {
    const elo = new EloRank(32);
    const expectedScoreWinner = elo.getExpected(winner, loser);
    const expectedScoreLoser = elo.getExpected(loser, winner);

    return {winner:elo.updateRating(expectedScoreWinner, 1, winner), loser: elo.updateRating(expectedScoreLoser, 0, winner)}

}