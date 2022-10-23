import {ButtonInteraction} from 'discord.js'

export const handleJoinQueue = async (interaction: ButtonInteraction) => {
    interaction.reply({content:"joined", ephemeral:true})
}

export const handleLeaveQueue =  async (interaction: ButtonInteraction) => {
    interaction.reply({content:"left", ephemeral:true})
}