import { Archive } from "../entity/archive";
import AppDataSource from "./AppDataSource";
import { Division, Region } from "./enums";
import { getTeams } from "./helpers";

const ArchiveRepository = AppDataSource.getRepository(Archive);

export const archive = async (region:Region) => {
    const teams = (await getTeams()).filter(t => t.region == region);

    const now = new Date();

    //if jan, last month was also last year
    if(now.getMonth()==1){
        now.setFullYear(now.getFullYear() - 1);
    }
    now.setMonth(now.getMonth()-1)


    const region_yearmonth = `${region.toString()}_${now.getFullYear()}${now.getMonth()}`

    const name = `${now.toLocaleString('default', {month:'short'})} ${now.getFullYear()}`

    const archive = new Archive()


    archive.teams = teams;
    archive.region_yearmonth = region_yearmonth
    archive.name = name;

    await ArchiveRepository.save(archive);
}

export const getArchive = async (region_yearmonth:string) => {
    const archive = await ArchiveRepository.findOne({
        where:{
            region_yearmonth:region_yearmonth
        }
    });
    if(archive) return archive;
    throw new Error("Archive not found");
}