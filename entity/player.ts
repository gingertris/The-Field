import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm"
import { Team } from "./team"

export enum Region {
    EU = "Europe",
    NA = "North America",
}

@Entity()
export class Player{
    @PrimaryColumn()
    id: string

    @Column({
        type:"enum",
        enum: Region
    })
    region:Region

    @ManyToOne(() => Team, (team) => team.players)
    team: Team
}