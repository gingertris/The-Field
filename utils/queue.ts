import {ButtonInteraction} from 'discord.js'
import { Queue } from '../entity/queue';
import { Team } from '../entity/team';
import AppDataSource from './AppDataSource';
import { getPlayer, getTeamByID} from './helpers';

const QueueRepository = AppDataSource.getRepository(Queue);

export const handleJoinQueue = async (interaction: ButtonInteraction) => {

    let player;
    try{
        player = await getPlayer(interaction.user.id);
        
        if(!player.team){
            interaction.reply({content:"You aren't in a team.", ephemeral:true});
            return
        }
        const team = await getTeamByID(player.team.id);
        if(team.players.length < 3){
            interaction.reply({content:"Your team needs to have at least 3 members to be able to queue.", ephemeral:true});
            return
        }
        
    } catch(err:any){
        interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true})
        return
    }

    if(await isTeamQueued(player.team.id)){
        interaction.reply({content:`You are already in the queue!`, ephemeral:true})
        return
    }

    try{

        await joinQueue(player.team);

    } catch(err:any){
        interaction.reply({content:`${err.message}.`, ephemeral:true})
        return
    }
    
    interaction.reply({content:"You have joined the queue.", ephemeral:true})
}

export const handleLeaveQueue =  async (interaction: ButtonInteraction) => {
    
    let player;
    try{
        player = await getPlayer(interaction.user.id)
        if(!player.team){
            interaction.reply({content:"You aren't in a team.", ephemeral:true});
            return
        }
        
    } catch(err:any){
            interaction.reply({content:`${err.message} Are you registered? Use the \`/register\` command to register before you can do anything else.`, ephemeral:true})
            return
    }

    if(!(await isTeamQueued(player.team.id))){
            interaction.reply({content:`You already aren't in the queue!`, ephemeral:true})
            return
    }

    try{
        await leaveQueue(player.team.id);
    } catch(err:any){
            interaction.reply({content:`${err.message}.`, ephemeral:true})
            return
    }
    
    interaction.reply({content:"You have left the queue.", ephemeral:true})
}

export const getFullQueue = async () => {
    const queue = await QueueRepository.find()

    if(!queue) throw new Error("No queue found.");
    return queue;
}

export const emptyQueue = async () => {
    const queue = await getFullQueue();
    if(!queue) return;
    QueueRepository.remove(queue);
}

const getQueue = async (id:number) => {
    const queue = await QueueRepository.findOne({
        where:{
            id:id
        }
    })
    if(!queue) throw new Error("No queued team found.");
    return queue;
}

const isTeamQueued = async (id:number) => {
    try{
        if(await getQueue(id)){
            return true
        } else{
            return false
        }
    } catch{
        return false
    }
}

const joinQueue = async (team:Team) => {

    const queue = new Queue()
    queue.division = team.division;
    queue.region = team.region;
    queue.team = team;
    queue.id = team.id;

    QueueRepository.save(queue);

}

const leaveQueue = async (id:number) => {
    const queue = await getQueue(id);
    if(!queue){throw new Error("Not in queue.")}
    await QueueRepository.remove(queue);


}