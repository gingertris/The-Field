import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Player } from "./player"
import { Team } from "./team"

@Entity()
export class Invite{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Team, (team) => team.invites, {eager:true, onDelete:"SET NULL"})
    team: Team

    @ManyToOne(() => Player, (player) => player.invites)
    player: Player

    @Column({
        default:false
    })
    answered: boolean

}