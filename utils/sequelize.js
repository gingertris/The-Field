import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv'
dotenv.config()

export default new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
}); 