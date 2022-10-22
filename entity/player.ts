import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm"
import { Team } from "./team"

import { Region } from "../utils/enums"

@Entity()
export class Player{
    @PrimaryColumn()
    id: string

    @Column({
        type:"enum",
        enum: Region
    })
    region:Region

    @ManyToOne(() => Team, (team) => team.players, {eager:true})
    team: Team
}