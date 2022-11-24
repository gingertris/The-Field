import { Player } from "../entity/player"
import { Division, Region } from "./enums";
import { Team } from "../entity/team";
import AppDataSource from "./AppDataSource";
import { GuildMember } from "discord.js"
import { Invite } from "../entity/invite";

import * as dotenv from 'dotenv'
import e from "express";
dotenv.config()

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

export const registerPlayer = async (id: string,username:string, region: string) => {
    const player = new Player();
    player.id = id;
    player.region = region as Region;
    player.username = username;
    console.log(player.region)
    await PlayerRepository.save(player).catch(err => {
        if(err.code == "23505"){
            throw new Error(`Username "${username}" is already taken. Please try a different username.`);
        } else{
            throw err;
        }
    });
}

export const addPlayerToTeam = async (player: Player, team: Team) => {
    if(team.changes < 5){
        player.team = team;
        await PlayerRepository.save(player).catch(err => {
            throw err;
        });
        const updatedTeam = await getTeamByID(team.id);
        updatedTeam.changes += 1;
        await TeamRepository.save(updatedTeam);
    } else{
        throw new Error("This team has already had 2 additions to its roster this month. You can not join this team.")
    }


}

export const leaveTeam = async (player: Player) => {
    player.team = null;
    await PlayerRepository.save(player).catch(err => {
        throw err;
    });
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
    }).catch(err => {
        throw err;
    });
    if(team) return team;
    throw new Error("Team not found.")
}

export const editTeamDivision = async (team: Team, division:Division) => {
    team.division = division;
    await TeamRepository.save(team);
}

export const resetTeam = async (team:Team) => {
    team.gamesPlayed = 0;
    team.changes = 0;
    team.rating = 1000;
    await TeamRepository.save(team);
}

export const setTeamRating = async (team:Team, rating:number) => {
    team.rating = rating;
    TeamRepository.save(team);
}

export const setTeamGamesPlayed = async (team:Team, games:number) => {
    team.gamesPlayed = games;
    TeamRepository.save(team);
}

export const getTeams = async () => {
    const teams = await TeamRepository.find({relations:['players']})
    if(!teams) throw new Error("No teams found.");
    return teams;
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

export const captainCheck = async (player: Player) => {
    if(!player.team) throw new Error(`Player is not on a team.`)
    const team = await getTeamByID(player.team.id);

    

    return player.id == team.captain_id;
}

export const createInvite = async (player: Player, team: Team) => {
    const invite = new Invite();
    invite.player = player;
    invite.team = team;
    await InviteRepository.save(invite).catch(err => {
        throw err;
    });;
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
    await InviteRepository.save(invite).catch(err => {
        throw err;
    });
}

export const deleteTeam = async (team: Team) => {
    await TeamRepository.remove(team).catch(err => {
        throw err;
    });
}

export const renameTeam = async (team: Team, name:string) => {
    team.name = name;
    await TeamRepository.save(team).catch(err => {
        throw err;
    });
}

export const transferOwnership = async (team:Team, player:Player) => {
    team.captain_id = player.id;
    await TeamRepository.save(team).catch(err => {
        throw err;
    });
}

export const syncRoles = async (member:GuildMember) => {
    let player;
    try {
        player = await getPlayer(member.user.id)
    } catch{
        console.log(`Player with Id ${member.user.id} not found`)
        return;
    }

    if(!(process.env.ROLE_EU && process.env.ROLE_NA && process.env.ROLE_EU_OPEN && process.env.ROLE_NA_OPEN && process.env.ROLE_NA_CLOSED && process.env.ROLE_EU_CLOSED && process.env.ROLE_REGISTERED)) throw new Error("Role IDs not in environment") //check all roles loaded in
    
    const roles = {
        EU:{
            general:process.env.ROLE_EU,
            open:process.env.ROLE_EU_OPEN,
            closed:process.env.ROLE_EU_CLOSED
        },
        NA:{
            general:process.env.ROLE_NA,
            open:process.env.ROLE_NA_OPEN,
            closed:process.env.ROLE_NA_CLOSED
        },
        registered:process.env.ROLE_REGISTERED
    }

    member.roles.add(roles.registered)

    //general player roles
    switch (player.region){
        case Region.EU:
            member.roles.add(roles.EU.general);
            member.roles.remove(roles.NA.general);
            break;
        case Region.NA:
            member.roles.remove(roles.EU.general);
            member.roles.add(roles.NA.general);
            break
    }

    //team specific roles
    if(player.team){
        switch(player.team.division){
            case Division.CLOSED:
                switch (player.region){
                    case Region.EU:
                        member.roles.add(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break;
                    case Region.NA:
                        member.roles.remove(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.add(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break
                }
                break;
            case Division.OPEN:
                switch (player.region){
                    case Region.EU:
                        member.roles.remove(roles.EU.closed);
                        member.roles.add(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break;
                    case Region.NA:
                        member.roles.remove(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.add(roles.NA.open);
                        break
                }
        }
    }
} 