import {Router} from 'express';
import { Division, Region } from './enums';
import { getTeams } from './helpers';

const router = Router();

router.get('/eu/open', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.EU && t.division == Division.OPEN).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        title:"EU - Open Division",
        teams:teams
    })

});


router.get('/eu/closed', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.EU && t.division == Division.CLOSED).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        title:"EU - Closed Division",
        teams:teams
    })
    
});


router.get('/na/open', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.NA && t.division == Division.OPEN).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        title:"EU - Open Division",
        teams:teams
    })
    
});


router.get('/na/closed', async (req, res) => {

    let teams = await getTeams();
    teams = teams.filter(t => t.region == Region.NA && t.division == Division.CLOSED).sort((a,b) => {return b.rating - a.rating})

    res.render('leaderboard.ejs', {
        title:"EU - Open Division",
        teams:teams
    })
    
});

//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
  res.status(404).send('Nice try.');
});

export default router;