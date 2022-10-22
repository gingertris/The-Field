import { Player, Region } from "../entity/player"
import AppDataSource from "./AppDataSource";

const PlayerRepository = AppDataSource.getRepository(Player)

export const getPlayer = async (id: string) => {
    const player = await PlayerRepository.findOneBy({
        id: id,
    })
    if(player) return player;
    return null
}

export const registerPlayer = async (id: string, region: string) => {
    let player = new Player()
    player.id = id
    player.region = region as Region
    console.log(player.region)
    await PlayerRepository.save(player);
}