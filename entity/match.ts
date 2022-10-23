import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Team } from "./team";
import { Teams }  from "../utils/enums";
@Entity()
export class Match{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Team, {eager:true})
    @JoinColumn()
    team1: Team

    @ManyToOne(() => Team, {eager:true})
    @JoinColumn()
    team2: Team

    @Column(
        {
            type: "enum",
            enum: Teams
        }
    )
    winner: Teams

    @Column()
    powerHour:boolean
    
    @CreateDateColumn()
    date: Date

}