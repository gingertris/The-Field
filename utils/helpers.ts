import { Player } from "../entity/player"
import { Region } from "./enums";
import { Team } from "../entity/team";
import AppDataSource from "./AppDataSource";
import {Client} from "discord.js"
import { Invite } from "../entity/invite";

const PlayerRepository = AppDataSource.getRepository(Player);
const TeamRepository = AppDataSource.getRepository(Team);
const InviteRepository = AppDataSource.getRepository(Invite);

export const getPlayer = async (id: string) => {
    const player = await PlayerRepository.findOne({
        where: {
           id: id 
        },
        relations:{
            team:true,
            invites:true
        }
    })
    if(player) return player;
    throw new Error("Player not found.")
}

export const registerPlayer = async (id: string, region: string) => {
    let player = new Player()
    player.id = id
    player.region = region as Region
    console.log(player.region)
    await PlayerRepository.save(player).catch(err => {
        throw err;
    });
}

export const addPlayerToTeam = async (player: Player, team: Team) => {
    player.team = team;
    PlayerRepository.save(player);
}

export const createTeam = async (name: string, captain_id: string) => {
    let team = new Team();
    let captain = await getPlayer(captain_id);
    if(!captain) return null;
    team.name = name;
    team.region = captain.region;
    team.captain = captain;
    await TeamRepository.save(team).catch(err => {
        if(err.code == "23505"){
            throw new Error(`Team name "${name}" is already taken. Please try a different team name.`);
        } else{
            throw err;
        }
        
    });
    await addPlayerToTeam(captain, team);
}

export const getTeam = async (name: string) => {
    const team = await TeamRepository.findOne({
        where:{
            name:name
        },
        relations: {
            players:true,
            captain:true
        }
    })
    if(team) return team;
    throw new Error("Team not found.")
}

export const getTeamByID = async (id:number) => {
    const team = await TeamRepository.findOne({
        where:{
            id:id
        },
        relations: {
            players:true,
            captain:true
        }
    })
    if(team) return team;
    throw new Error("Team not found.")
}

export const getUsername = async (client: Client, user_id:string) => {
    const guild = await client.guilds.fetch("1031537914422767697");
    const member = await guild.members.fetch(user_id);
    return member.user.username;
}

export const captainCheck = async (player: Player) => {
    const team = await getTeam(player.team.name);
    return player.id == team.captain.id
}

export const createInvite = async (player: Player, team: Team) => {
    let invite = new Invite();
    invite.player = player;
    invite.team = team;
    InviteRepository.save(invite);
}

export const getInvite = async (id: number) => {
    const invite = await InviteRepository.findOne({
        where:{
            id:id
        },
        relations: {
            player:true,
            team:true
        }
    })
    if(invite) return invite;
    throw new Error(`Invite with id ${id} not found.`);
}

export const answerInvite = async (invite: Invite) => {
    invite.answered = true;
    InviteRepository.save(invite);
}