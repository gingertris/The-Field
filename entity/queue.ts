
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Division, Region } from "../utils/enums";
import { Team } from "./team";

@Entity()
export class Queue{

    @Column({
        type:"enum",
        enum: Region
    })
    region:Region

    @Column({
        type:"enum",
        enum: Division
    })
    division:Division

   
    @ManyToOne(() => Team, (team) => team.queue, {eager:true})
    team:Team

    @CreateDateColumn()
    joined: Date

    //same id as in team.id. but needed for primary key, so it doesnt duplicate
    @PrimaryColumn()
    id:number


}