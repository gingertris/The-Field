import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Team } from "./team"

import { Region } from "../utils/enums"
import { Invite } from "./invite"

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

    @OneToMany(() => Invite, (invite) => invite.player)
    invites: Invite[]
}