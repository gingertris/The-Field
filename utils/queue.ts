import {ButtonInteraction, ChannelType, Client} from 'discord.js'
import { Queue } from '../entity/queue';
import { Team } from '../entity/team';
import AppDataSource from './AppDataSource';
import { Region } from './enums';
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

export const openQueue = async (client:Client, region:Region) => {
    const queueChannelId = process.env.CHANNEL_QUEUE;
    if(!queueChannelId) throw new Error("CHANNEL_QUEUE not in env");

    const euId = process.env.ROLE_EU;
    if(!euId) throw new Error("ROLE_EU not in env");

    const naId = process.env.ROLE_NA;
    if(!naId) throw new Error("ROLE_NA not in env");

    const queueChannel = await client.channels.fetch(queueChannelId);
    if(!queueChannel) throw new Error(`Channel with ID ${queueChannelId} not found`);

    if(queueChannel.type != ChannelType.GuildText) throw new Error(`Channel with ID ${queueChannelId} is not of type GuildText`);

    let roleId;
    if(region == Region.EU) roleId = euId;
    if(region == Region.NA) roleId = naId;
    if(!roleId) throw new Error("region scuffed LOL (this shouldnt happen but if it does something went bad)")
    
    await queueChannel.permissionOverwrites.edit(roleId, {ViewChannel:true})
    
}

export const closeQueue = async (client:Client, region:Region) => {
    const queueChannelId = process.env.CHANNEL_QUEUE;
    if(!queueChannelId) throw new Error("CHANNEL_QUEUE not in env");

    const euId = process.env.ROLE_EU;
    if(!euId) throw new Error("ROLE_EU not in env");

    const naId = process.env.ROLE_NA;
    if(!naId) throw new Error("ROLE_NA not in env");

    const queueChannel = await client.channels.fetch(queueChannelId);
    if(!queueChannel) throw new Error(`Channel with ID ${queueChannelId} not found`);

    if(queueChannel.type != ChannelType.GuildText) throw new Error(`Channel with ID ${queueChannelId} is not of type GuildText`);

    let roleId;
    if(region == Region.EU) roleId = euId;
    if(region == Region.NA) roleId = naId;
    if(!roleId) throw new Error("region scuffed LOL (this shouldnt happen but if it does something went bad)")
    
    await queueChannel.permissionOverwrites.edit(roleId, {ViewChannel:false})
    
}

export const syncQueue = async (client:Client) => { //only do this on load.
    const now = new Date();

    //eu
    const euTime = structuredClone(now);
    euTime.setHours(euTime.getHours() + 1)
    if(euTime.getDay() < 6){ //weekday
        if(euTime.getUTCHours() < 18 || euTime.getUTCHours() > 22){
            await closeQueue(client, Region.EU);
        } else{
            await openQueue(client, Region.EU);
        }
    } else{ //weekend
        if(euTime.getUTCHours() < 16 || euTime.getUTCHours() > 22){
            await closeQueue(client, Region.EU);
        } else{
            await openQueue(client, Region.EU);
        }
    }

    //na
    const naTime = structuredClone(now);
    naTime.setHours(euTime.getHours() - 5)
    if(naTime.getDay() < 6){ //weekday
        if(naTime.getUTCHours() < 18 || naTime.getUTCHours() > 22){
            await closeQueue(client, Region.NA);
        } else{
            await openQueue(client, Region.NA);
        }
    } else{ //weekend
        if(naTime.getUTCHours() < 16 || naTime.getUTCHours() > 22){
            await closeQueue(client, Region.NA);
        } else{
            await openQueue(client, Region.NA);
        }
    }

}