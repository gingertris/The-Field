import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne , DeleteDateColumn} from "typeorm"
import { Player } from "./player"

import { Division, Region } from "../utils/enums"
import { Invite } from "./invite"

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique:true})
    name: string

    @Column({nullable:false})
    captain_id: string

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

    @OneToMany(() => Player, (player) => player.team, {onDelete:"SET NULL"})
    players: Player[]

    @OneToMany(() => Invite, (invite) => invite.team)
    invites: Invite[]

}