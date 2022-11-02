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

    @Column({type: 'int',nullable:true})
    winner_id: number | null

    @Column()
    powerHour: boolean
    
    @CreateDateColumn()
    date: Date

    @Column({default:0})
    team1difference: number

    @Column({default:0})
    team2difference: number

}