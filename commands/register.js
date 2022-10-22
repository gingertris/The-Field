import { SlashCommandBuilder } from "discord.js";
import { getPlayer, registerPlayer } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for Tris' Field")
        .addStringOption(option => 
            option
                .setName("region")
                .setDescription("Region")
                .setRequired(true)
                .addChoices(
                    {name:"Europe", value:"EU"},
                    {name:"North America", value:"NA"}
                )
        ),
    async execute(interaction){

        let player = await getPlayer(interaction.user.id);
        if(player){
            interaction.reply({content:"You are already registered. If you want to change region, please contact an administrator.", ephemeral:true})
            return
        }


        const id = interaction.user.id;
        const region = interaction.options.getString("region");
        console.log(`${id}: ${region}`)
        await registerPlayer(id, region);

        player = await getPlayer(interaction.user.id);

        if(!player){
            interaction.reply({content:"Something went wrong. You are not registered.", ephemeral:true});
            return
        }

        interaction.reply({content:"You have successfully registered. Enjoy!", ephemeral:true});

    }
}