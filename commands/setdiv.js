import { SlashCommandBuilder } from "discord.js";
import { Division } from "../utils/enums";
import { editTeamDivision,getTeam, syncRoles } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("setdiv")
        .setDescription("Set division of a team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team Name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        )
        .addStringOption(option => 
            option
                .setName("division")
                .setDescription("Division")
                .setRequired(true)
                .addChoices(
                    {name:"Open", value:"OPEN"},
                    {name:"Closed", value:"CLOSED"}
                )
        ),
    async execute(interaction){

        const teamname = interaction.options.getString("name");
        const division = interaction.options.getString("division");

        const team = await getTeam(teamname);
        if(!team){
            interaction.reply({content:"Team not found.", ephemeral:true})
            return
        }

        const divisionEnum =  division == "OPEN" ? Division.OPEN : Division.CLOSED

        await editTeamDivision(team, divisionEnum)
        team.players.forEach(async (player) => {
            await syncRoles(player);
        })

        interaction.reply({content:"Team updated.", ephemeral:true})
        return
    }
}