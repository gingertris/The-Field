import { SlashCommandBuilder } from "discord.js";
import { getPlayer, registerPlayer, syncRoles } from "../utils/helpers";

export default {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for Tris' Field")
        .addStringOption(option => 
            option
                .setName("username")
                .setDescription("Set your username")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(1)

        )
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

        try{
            let player = await getPlayer(interaction.user.id);

            if(player){
                interaction.reply({content:"You are already registered. If you want to change region, please contact an administrator.", ephemeral:true})
                return
            }
        } catch (err) {
            //player doesnt exist. thats expected, continue
        }



        const id = interaction.user.id;
        const region = interaction.options.getString("region");
        const username = interaction.options.getString("username");
        console.log(`${id}: ${region}`)

        try{
            await registerPlayer(id, username, region);
        } catch (err){
            interaction.reply({content:err.message, ephemeral:true});
            return;
        }
        
        try{
            await getPlayer(interaction.user.id); //check if exists
        } catch (err) {
            interaction.reply({content:err.message, ephemeral:true});
            return;
        }

        
        try{
            await syncRoles(interaction.member)
        } catch(err){
            console.log("unable to change nickname of user " + username)
        }
        interaction.reply({content:"You have successfully registered. Enjoy!", ephemeral:true});

    }
}