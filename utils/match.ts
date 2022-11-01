import { randomBytes } from 'crypto';
import { Client, EmbedBuilder } from 'discord.js';
import { Match } from '../entity/match';
import { Queue } from '../entity/queue';
import { Team } from '../entity/team';
import AppDataSource from './AppDataSource';
import { archive } from './archive';
import { Division, Region } from './enums';
import { editTeamDivision, getTeamByID, getTeams, resetTeam, syncRoles } from './helpers';
import { emptyQueue, getFullQueue } from './queue';

const MatchRepository = AppDataSource.getRepository(Match);

export const promoteAndRelegate = async (client: Client) => {

    //TODO: Make copy of leaderboard before promos and relegations?

    await archive();

    //Also this doesn't check for game quota yet.

    for(const region in Region){
        const allTeams = await getTeams();

        let openTeams = allTeams.filter(t => t.region == region as Region && t.division == Division.OPEN);

        let closedTeams = allTeams.filter(t => t.region == region as Region && t.division == Division.CLOSED);

        //sort teams
        openTeams = openTeams.sort((a,b)=>{
            //highest first
            return b.rating - a.rating
        })

        closedTeams = closedTeams.sort((a,b)=>{
            //lowest first
            return a.rating - b.rating
        })

        //promote open teams
        let teamsToSwap = 4;
        if(closedTeams.length < 16) teamsToSwap = 16 - closedTeams.length; //if closed is empty then fill up closed div
        for(let i=0; i<(openTeams.length < teamsToSwap ? openTeams.length : teamsToSwap); i++){ //prevent index out of range if not many teams, lol

            const team = openTeams[i];
    
            await editTeamDivision(team, Division.CLOSED);
            await resetTeam(team);
            team.players.forEach(async player => {
                try{
                    const guildId = process.env.GUILD_ID;
                    if(!guildId) throw new Error("GUILD_ID not found in env")
                    await syncRoles(await (await client.guilds.fetch(guildId)).members.fetch(player.id));
                    (await client.users.fetch(player.id)).send("Congratulations, your team has been promoted to Closed Division!")
                } catch(err){
                    console.log(err)
                }
            });
        }


        //if closed full, demote. this may change
        if(closedTeams.length >= 16){
            for(let i=0; i<teamsToSwap; i++){
                const team = await getTeamByID(closedTeams[i].id);
                await editTeamDivision(team, Division.OPEN);
                await resetTeam(team);
                team.players.forEach(async player => {
                    try{
                        (await client.users.fetch(player.id)).send("You have been demoted to Open Division.")
                    }catch(err:unknown){
                        console.log(err)                    
                    }
                    
                });
            }
        }
    }

    



}

export const createMatches = async (client: Client, powerHour: boolean, region:Region) => {

    const allQueue = await getFullQueue();
    const queues:[Queue[]] = [[]];

    //divide queues
    for(const division in Division) {
        queues.push(allQueue.filter(q => {
            return (q.region as Region) == (region as Region) && (q.division as Division) == (division as Division)
        }))
    }

    queues.forEach(async queue => {

        //create matches
        if(queue.length % 2 === 1){
            queue = queue.sort((a,b) => {
                //least recent first 
                return a.joined.getTime() - b.joined.getTime()
            })
            const popped = queue.pop() // remove most recent queuer
            if(popped){
                const user = await client.users.fetch(popped.team.captain_id);
                user.send("There was an odd number of people in the queue, meaning not everyone could get a matchup. Unfortunately, your team was the last to queue, so you haven't got a matchup.");
            }
        }

        queue = queue.sort((a, b) => {
            return a.team.rating - b.team.rating;
        });

        for(let i = 0; i < queue.length; i+=2){
            const team1_q = queue.pop();
            const team2_q = queue.pop();

            if(team1_q && team2_q){
                const team1 = team1_q.team;
                const team2 = team2_q.team;

                const match = await createMatch(team1, team2, powerHour);

                const embed = new EmbedBuilder()
                    .setTitle(`Match ${match.id}`)
                    .setColor("Fuchsia")
                    .setTimestamp()
                    .setFooter({text:`Match ID: ${match.id}`});
                [match.team1, match.team2].forEach(async team => {
                    const fullTeam = await getTeamByID(team.id);
                    embed.addFields({
                        name:`${fullTeam.name} (${fullTeam.rating})`,
                        value:`${fullTeam.players.map(p => {
                            if(p.id == fullTeam.captain_id){
                                return `${p.username} (C)`
                            } else {
                                return p.username;
                            }
                        }).join('\n')}`,
                        inline:true
                    })
                });
                const matchName = match.team1.region.toString().toUpperCase() + match.team1.division.toString().toUpperCase().charAt(0) + match.id.toString()
                const matchPass = generatePassword();

                embed.addFields({name:"Lobby Details", value:`Name: ${matchName}\nPassword: ${matchPass}\n${team1.name} creates the lobby.`});
                embed.addFields({name:"Score Reporting", value:`To report the score, use the \`/report\` command.`});
                embed.addFields({name:"Example Usage", value:`\`/report ${match.id} Win\``});
                (await client.users.fetch(team1.captain_id)).send({embeds:[embed]});
                (await client.users.fetch(team2.captain_id)).send({embeds:[embed]});
            }

        }


    })

    await emptyQueue();
}

const createMatch = async (team1: Team, team2: Team, powerHour:boolean) => {
    const match = new Match();
    match.team1 = team1;
    match.team2 = team2;
    match.powerHour = powerHour;
    return (await MatchRepository.save(match).catch(err => {throw err}))
    
}

export const getMatch = async (id:number) => {
    const match = await MatchRepository.findOne({
        where:{
            id:id
        }
    });
    if(!match) throw new Error(`No match found with id ${id}`);
    return match;
}

const generatePassword = () => {
    return randomBytes(2).toString('hex');
}

export const updateMatch = async (match:Match) => {
    return await MatchRepository.save(match);
}