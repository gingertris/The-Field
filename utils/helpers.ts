import { Player } from "../entity/player"
import { Region } from "./enums";
import { Team } from "../entity/team";
import AppDataSource from "./AppDataSource";
import {Client} from "discord.js"



const PlayerRepository = AppDataSource.getRepository(Player);
const TeamRepository = AppDataSource.getRepository(Team);

export const getPlayer = async (id: string) => {
    const player = await PlayerRepository.findOneBy({
        id: id,
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

const addPlayerToTeam = async (player: Player, team: Team) => {
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

export const getUsername = async (client: Client, user_id:string) => {
    return (await (await client.guilds.fetch("1031537914422767697")).members.fetch(user_id)).user.username;
}