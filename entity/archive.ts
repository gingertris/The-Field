import { Column, Entity, PrimaryColumn } from "typeorm";
import { Team } from "./team";

@Entity()
export class Archive{

    //when getting/setting, always use format REGION_YYYYM(M) e.g. EU_20229 or EU_202210
    //Jan = 0
    @PrimaryColumn()
    region_yearmonth: string

    @Column()
    name: string

    @Column({type:'jsonb', nullable:true})
    teams: Team[]

}
