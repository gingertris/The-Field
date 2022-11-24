import {Router} from 'express';
import { Division, Region } from '../enums';
import { getTeamByID, getTeams } from '../helpers';

const router = Router();

const minGamesPlayed = 0;

router.get('/team/:id', async (req, res) => {

    const {id} = req.params;
    const idInt = parseInt(id);

    let team;
    try{
        team = await getTeamByID(idInt);
    } catch(err){
        res.send(JSON.stringify({
            error:"Team not found"
        }))
        return;
    }
    

    res.send(JSON.stringify(team));

})

//new route
router.get('/:region/:division', async (req, res) => {

    let {region, division} = req.params;
    region = region.toUpperCase();
    division = division.toUpperCase();

    if(region != "EU" && region != "NA") {
        res.send(JSON.stringify({error:"Invalid region: must be either EU or NA."}));
        return;
    }

    if(division != "OPEN" && division != "CLOSED") {
        res.send(JSON.stringify({error:"Invalid division: must be either Open or Closed."}));
        return;
    }


    let teams = await getTeams();
    teams = teams.filter(t => t.region == region as Region && t.division == division as Division && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.send(JSON.stringify(teams));
    
});


export default router;