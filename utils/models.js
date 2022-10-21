import Player from '../models/player.js';
import Team from '../models/team.js';

export default () => {
    Team.hasMany(Player)
    Team.hasOne(Player, {as: 'Captain', foreignKey: 'captainId'})
    Player.belongsTo(Team)
    return
}