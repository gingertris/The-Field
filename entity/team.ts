import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Player } from "./player"

export enum Division {
    OPEN = "Open",
    CLOSED = "Closed",
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique:true })
    name: string

    @Column({
        type:"enum",
        enum: Division
    })
    division:Division

    @Column()
    rating: number

    @OneToMany(() => Player, (player) => player.team)
    players: Player[]

    @OneToOne(() => Player, (player) => player.team)
    captain: Player

}