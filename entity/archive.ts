import { Column, Entity, PrimaryColumn } from "typeorm";
import { Team } from "./team";

@Entity()
export class Archive{

    //when getting/setting, always use format YYYYM(M) e.g. 20229 or 202210
    //Jan = 0
    @PrimaryColumn()
    yearmonth: string

    @Column()
    name: string

    @Column({type:'jsonb', nullable:true})
    teams: Team[]

}
