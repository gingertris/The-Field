import {Router} from 'express';
import { getArchive } from './archive';
import { Division, Region } from './enums';
import { getTeams } from './helpers';

const router = Router();

const minGamesPlayed = 0; 

const name = process.env.PROJECT_NAME;

/*
router.get('/eu/open', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.EU && t.division == Division.OPEN && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:"EU - Open Division",
        teams:teams
    })

});


router.get('/eu/closed', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.EU && t.division == Division.CLOSED && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:"EU - Closed Division",
        teams:teams
    })
    
});


router.get('/na/open', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.NA && t.division == Division.OPEN && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:"NA - Open Division",
        teams:teams
    })
    
});

router.get('/na/closed', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.NA && t.division == Division.CLOSED && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:"NA - Closed Division",
        teams:teams
    })
    
});

*/

//new route
router.get('/:region/:division', async (req, res) => {

    let {region, division} = req.params;
    region = region.toUpperCase();
    division = division.toUpperCase();

    if(region != "EU" && region != "NA") {
        res.send("Invalid region: must be either EU or NA.");
        return;
    }

    if(division != "OPEN" && division != "CLOSED") {
        res.send("Invalid division: must be either Open or Closed.");
        return;
    }


    let teams = await getTeams();
    teams = teams.filter(t => t.region == region as Region && t.division == division as Division && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:`${region} - ${division} Division`,
        teams:teams
    })
    
});

router.get('/archive/:year/:month/:region/:division', async (req, res) => {

    const {year, month, region, division} = req.params;
    const divisionStr = division.toUpperCase();
    const regionStr = region.toUpperCase();
    const yearInt = parseInt(year);
    let monthInt = parseInt(month);

    if(regionStr != "EU" && regionStr != "NA") {
        res.send("Invalid region: must be either EU or NA.");
        return;
    }

    if(divisionStr != "OPEN" && divisionStr != "CLOSED") {
        res.send("Invalid division: must be either Open or Closed.");
        return;
    }


    //jan = 0 in code, lol
    monthInt -= 1;

    const region_yearmonth = `${regionStr}_${yearInt}${monthInt}`;

    let archive;
    try{
        archive = await getArchive(region_yearmonth);
    } catch(err:any){
        res.send(err.message)
        return;
    }
    
    let teams = archive.teams;
    
    teams = teams.filter(t => t.region == regionStr as Region && t.division == divisionStr as Division && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:`${archive.name} - ${divisionStr} Division`,
        teams:teams
    })
    
});

//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
      res.render('index.ejs', {
        name:name
      })
});

export default router;