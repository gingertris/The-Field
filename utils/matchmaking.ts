import { randomBytes } from 'crypto';
import { Client, EmbedBuilder } from 'discord.js';
import {scheduleJob, RecurrenceRule, Range} from'node-schedule';
import { Match } from '../entity/match';
import { Queue } from '../entity/queue';
import { Team } from '../entity/team';
import AppDataSource from './AppDataSource';
import { Division, Region } from './enums';
import { getFullQueue } from './queue';

const MatchRepository = AppDataSource.getRepository(Match);

//set times
const weekdayRule = new RecurrenceRule();
weekdayRule.dayOfWeek = [new Range(1,5)];
weekdayRule.hour = [new Range(18,22)];


const weekendRule = new RecurrenceRule();
weekendRule.dayOfWeek = [0,6];
weekendRule.hour = [new Range(16,18), 22];

const powerHourRule = new RecurrenceRule();
powerHourRule.dayOfWeek = [0,6];
powerHourRule.hour = [new Range(19,21)];

//set timezones
const euWeekdayRule = structuredClone(weekdayRule);
euWeekdayRule.tz = 'cet';

const euWeekendRule = structuredClone(weekendRule);
euWeekendRule.tz = 'cet';

const euPowerHourRule = structuredClone(powerHourRule);
euPowerHourRule.tz = 'cet';

const naWeekdayRule = structuredClone(weekdayRule);
naWeekdayRule.tz = 'est';

const naWeekendRule = structuredClone(weekendRule);
naWeekendRule.tz = 'est';

const naPowerHourRule = structuredClone(powerHourRule);
naPowerHourRule.tz = 'est';

//methods

const euWeekdayJob = (client: Client) => scheduleJob(euWeekdayRule, ()=>{
    createMatches(client, false, Region.EU)
})

const euWeekendJob = (client: Client) => scheduleJob(euWeekendRule, ()=>{
    createMatches(client, false, Region.EU)
})

const euPowerHourJob = (client: Client) => scheduleJob(euPowerHourRule, ()=>{
    createMatches(client, true, Region.EU)
})

const naWeekdayJob = (client: Client) => scheduleJob(naWeekdayRule, ()=>{
    createMatches(client, false, Region.NA)
})

const naWeekendJob = (client: Client) => scheduleJob(naWeekendRule, ()=>{
    createMatches(client, false, Region.NA)
})

const naPowerHourJob = (client: Client) => scheduleJob(naPowerHourRule, ()=>{
    createMatches(client, true, Region.NA)
})

export const Jobs = [euWeekdayJob, euWeekendJob, euPowerHourJob, naWeekdayJob, naWeekendJob, naPowerHourJob]

const createMatches = async (client: Client, powerHour: boolean, region:Region) => {
    const allQueue = await getFullQueue();
    const queues:[Queue[]] = [[]];

    //divide queues

    for(const division in [Division.CLOSED, Division.OPEN]) {
        queues.push(allQueue.filter(q => q.region == region && q.division == division))
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
                    .setTitle("Match Details")
                    .setDescription(`Match ID: ${match.id}`);
                [match.team1, match.team2].forEach(team => {
                    embed.addFields({
                        name:`${team.name}`,
                        value:`${team.players.map(p => {
                            if(p.id == team1.captain_id){
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
                embed.addFields({name:"Score Reporting", value:`To report the score, use the \`/report\` command, then select Match #${match.id}, then fill in the score.`});
                (await client.users.fetch(team1.captain_id)).send({embeds:[embed]});
                (await client.users.fetch(team2.captain_id)).send({embeds:[embed]});
            }

        }


    })
}

const createMatch = async (team1: Team, team2: Team, powerHour:boolean) => {
    const match = new Match();
    match.team1 = team1;
    match.team2 = team2;
    match.powerHour = powerHour;
    return (await MatchRepository.save(match).catch(err => {throw err}))
    
}

const generatePassword = () => {
    return randomBytes(2).toString('hex');
}