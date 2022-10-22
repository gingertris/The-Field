import { Player } from "../entity/player"
import AppDataSource from "./AppDataSource";

const PlayerRepository = AppDataSource.getRepository(Player)

export const getPlayer = async (id) => {
    const player = await PlayerRepository.findOneBy({
        id: id,
    })
    if(player) return player;
    return null
}