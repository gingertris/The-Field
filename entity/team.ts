import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Player } from "./player"

import { Division, Region } from "../utils/enums"
import { Invite } from "./invite"

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique:true})
    name: string

    @Column({
        type:"enum",
        enum: Division,
        default:Division.OPEN
    })
    division:Division

    @Column({
        type:"enum",
        enum: Region
    })
    region: Region

    @Column({default:1000})
    rating: number

    @OneToMany(() => Player, (player) => player.team)
    players: Player[]

    @OneToOne(() => Player, (player) => player.team, {eager:true})
    captain: Player

    @OneToMany(() => Invite, (invite) => invite.team)
    invites: Invite[]

}