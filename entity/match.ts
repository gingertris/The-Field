import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Team } from "./team";
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

    @Column({nullable:true})
    winner_id: number

    @Column()
    powerHour: boolean
    
    @CreateDateColumn()
    date: Date

    @Column()
    team1difference: number

    @Column()
    team2difference: number

}