# Tris' Field
My attempt at a recreation of Psyonix x Rival Esports' The Field.

# How will Tris’ field work?

There will be 2 divisions: **Open Division** and **Closed Division**.

Closed Division capped at 16 teams (but may increase with more users). Open Division is open for anyone.

*For Season 1, all teams start in Open Division. Top 16 in Open Division at the end of the month get promoted to Closed Division for future seasons.*

At the start of each month, all teams reset to 1000 points. Players can gain/lose rating throughout the month. 

At the end of the month, **Top 4 from Open Division promote to Closed Division**, and **Bottom 4 of Closed Division relegate to Open Division**.

You will need to play 10 games in a month to be eligible for prizing and promotion. *Prizes to be determined, this is all hypothetical so far. I do not have money*

# Opening times

The following times assume these timezones:
 - EU (CET - UTC+1)
 - NA (EST - UTC-5)

**Mon - Fri**

18:00 - 22:00

**Sat - Sun**

16:00 - 22:00

<ins>Power Hours

Saturdays + Sundays @ 7 PM, 8 PM, 9 PM

Power Hour Ladder Point Multiplier (for wins): 1.5x

# Matchmaking


Queues will pop at the top of each hour. 21:00 is when the last queue will pop. Queueing outside of the opening times will not be possible.

All queued teams will be sorted in order of Rating. Teams will be matched against teams of a similar rating in order to create fair, balanced and (hopefully) enjoyable matches.

If there is an odd number of people in the queue, randomly select one team from the queue and remove them. Maybe give them a few points bonus for the inconvenience? It's a work in progress.

# Commands

`/create “Team Name”`

Creates a team name, sets person who ran command as Captain

`/invite @User`
	
Invites @User to your team.

You need to be the Captain of your team to use this command.

`/join`
	
Lists invites. Button for each invite, press button to join team.

Command will fail if you are already in a team.

`/leave`

Leave team.

You cannot leave a team you are captain of. `/transfer` ownership of the team to someone else before leaving.

`/transfer @User`

Transfers ownership of team to @User. If not Captain of a team, this command fails.

You need to be the Captain of your team to use this command.

`/rename “New Team Name”`
	
Renames team to a new team name. 
   
You need to be the Captain of your team to use this command.

`/kick @User`

Kicks @User from team. 
    
You need to be the Captain of your team to use this command.

`/report`
	
Report match score. 

*How? Gives user a message with a Win button and a Loss button. 
When one team reports, bot can message the captain of the other team asking to confirm the score, with its own interaction.*

<ins>Ideas

Separate Join / Leave queue button in a Read Only queue channel. Queue will fail if you are not in a team. If someone else in your team queued, you can still leave the queue.

Register EU / NA buttons, must be registered before aforementioned queue button channel visible.
