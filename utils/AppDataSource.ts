import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { Player } from "../entity/player"
import { Team } from "../entity/team"
import { Invite } from "../entity/invite"
dotenv.config()

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities:[Player, Team, Invite],
    synchronize: true
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource;