import { DataTypes } from 'sequelize'
import sequelize from '../utils/sequelize.js'

const divisions = DataTypes.ENUM('OPEN', 'CLOSED')

const Team = sequelize.define(
    'team', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        rating: DataTypes.INTEGER,
        division: divisions
    }
)

export default Team