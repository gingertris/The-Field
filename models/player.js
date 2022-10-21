import { DataTypes } from 'sequelize'
import sequelize from '../utils/sequelize.js'

const regions = DataTypes.ENUM('EU', 'NA')

const Player = sequelize.define(
    'player', {
        id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true
        },
        region: regions
    }
)

export default Player