import { Player } from "../entity/player"
import { Division, Region } from "./enums";
import { Team } from "../entity/team";
import AppDataSource from "./AppDataSource";
import {BaseInteraction, Client, CommandInteraction, GuildMember, User} from "discord.js"
import { Invite } from "../entity/invite";

import * as dotenv from 'dotenv'
dotenv.config()

const guildId = process.env.GUILD_ID;

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
    const player = new Player();
    player.id = id;
    player.region = region as Region;
    console.log(player.region)
    await PlayerRepository.save(player).catch(err => {
        throw err;
    });
}

export const addPlayerToTeam = async (player: Player, team: Team) => {
    player.team = team;
    PlayerRepository.save(player);
}

export const leaveTeam = async (player: Player) => {
    player.team = null;
    PlayerRepository.save(player);
}

export const createTeam = async (name: string, player: Player) => {
    const team = new Team();
    team.name = name;
    team.region = player.region;
    team.captain_id = player.id;
    await TeamRepository.save(team).catch(err => {
        if(err.code == "23505"){
            throw new Error(`Team name "${name}" is already taken. Please try a different team name.`);
        } else{
            throw err;
        }
        
    });
    await addPlayerToTeam(player, team);
}

export const getTeam = async (name: string) => {
    const team = await TeamRepository.findOne({
        where:{
            name:name
        },
        relations: {
            players:true
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
            players:true
        }
    })
    if(team) return team;
    throw new Error("Team not found.")
}

export const getUsername = async (interaction: BaseInteraction, user_id:string) => {
    if(!interaction.guild){throw new Error("No guild in interaction")}

    const member = await interaction.guild.members.fetch(user_id);
    return member.user.username;
}

export const captainCheck = async (player: Player) => {
    if(!player.team) throw new Error(`Player is not on a team.`)
    const team = await getTeamByID(player.team.id);

    return player.id == team.captain_id;
}

export const createInvite = async (player: Player, team: Team) => {
    const invite = new Invite();
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

export const deleteTeam = async (team: Team) => {
    TeamRepository.remove(team);
}

export const renameTeam = async (team: Team, name:string) => {
    team.name = name;
    TeamRepository.save(team);
}

export const transferOwnership = async (team:Team, player:Player) => {
    team.captain_id = player.id;
    TeamRepository.save(team);
}

export const syncRoles = async (member:GuildMember) => {
    const player = await getPlayer(member.user.id);
    if(!(process.env.ROLE_EU_ID && process.env.ROLE_NA_ID && process.env.ROLE_OPEN_ID && process.env.ROLE_CLOSED_ID)) throw new Error("Role IDs not in environment") //check all roles loaded in
    
    const roles = {
        EU:process.env.ROLE_EU_ID,
        NA:process.env.ROLE_NA_ID,
        open:process.env.ROLE_OPEN_ID,
        closed:process.env.ROLE_CLOSED_ID
    }

    switch (player.region){
        case Region.EU:
            member.roles.add(roles.EU);
            member.roles.remove(roles.NA);
            break;
        case Region.NA:
            member.roles.add(roles.NA);
            member.roles.remove(roles.EU);
            break
    }

    if(player.team){
        switch(player.team.division){
            case Division.CLOSED:
                member.roles.add(roles.closed)
                member.roles.remove(roles.open);
                break;
            case Division.OPEN:
                member.roles.add(roles.open);
                member.roles.remove(roles.closed);
                break;
        }
    }
} 