import { Archive } from "../entity/archive";
import AppDataSource from "./AppDataSource";
import { getTeams } from "./helpers";

const ArchiveRepository = AppDataSource.getRepository(Archive);

export const archive = async () => {
    const teams = await getTeams();

    const now = new Date();

    //if jan, last month was also last year
    if(now.getMonth()==1){
        now.setFullYear(now.getFullYear() - 1);
    }
    now.setMonth(now.getMonth()-1)


    const yearmonth = `${now.getFullYear()}${now.getMonth()}`

    const name = `${now.toLocaleString('default', {month:'short'})} ${now.getFullYear()}`

    const archive = new Archive()


    archive.teams = teams;
    archive.yearmonth = yearmonth
    archive.name = name;

    await ArchiveRepository.save(archive);
}

export const getArchive = async (yearmonth:string) => {
    const archive = await ArchiveRepository.findOne({
        where:{
            yearmonth:yearmonth
        }
    });
    if(archive) return archive;
    throw new Error("Archive not found");
}