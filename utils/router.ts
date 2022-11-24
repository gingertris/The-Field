import {Router} from 'express';
import { getArchive } from './archive';
import { Division, Region } from './enums';
import { getPlayer, getTeamByID, getTeams } from './helpers';
import apiRouter from './routes/api'
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



//get archived team
router.get('/archive/:year/:month/:teamId', async (req, res) => {

    const {year, month, teamId} = req.params;
    const yearInt = parseInt(year);
    let monthInt = parseInt(month);
    const teamIdInt = parseInt(teamId)
    //jan = 0 in code, lol
    monthInt -= 1;

    const region_yearmonth = `${yearInt}${monthInt}`;

    let archive;
    try{
        archive = await getArchive(region_yearmonth);
    } catch(err:any){
        res.send(err.message)
        return;
    }
    
    const teams = archive.teams;
    
    const team = teams.filter(t => t.id == teamIdInt)[0];

    
    const captain_name = (await getPlayer(team.captain_id)).username;


    res.render('team.ejs', {
        name:name,
        team:team,
        captain_name:captain_name,
        title:team.name
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

    const yearmonth = `${yearInt}${monthInt}`;

    let archive;
    try{
        archive = await getArchive(yearmonth);
    } catch(err:any){
        res.send(err.message)
        return;
    }
    
    let teams = archive.teams;
    
    teams = teams.filter(t => t.region == regionStr as Region && t.division == divisionStr as Division && t.gamesPlayed > minGamesPlayed).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        name:name,
        title:`${archive.name} - ${divisionStr} Division`,
        teams:teams,
        base_team_url: `/archive/${year}/${month}`
    })
    
});

router.get('/team/:id', async (req, res) => {

    const {id} = req.params;
    const idInt = parseInt(id);

    let team;
    try{
        team = await getTeamByID(idInt);
    } catch(err){
        res.send("Team not found")
        return;
    }
    

    const captain_name = (await getPlayer(team.captain_id)).username;

    res.render('team.ejs', {
        name:name,
        team:team,
        captain_name:captain_name,
        title:team.name
    })
})

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
        teams:teams,
        base_team_url: '/team'
    })
    
});

router.use("/api", apiRouter)

//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
      res.render('index.ejs', {
        name:name,
        title:"Tris' Field"
      })
});

export default router;