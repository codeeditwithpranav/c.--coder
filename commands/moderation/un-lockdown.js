const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('un-lockdown')
        .setDescription('Unlock the channel, allowing users to send messages'),

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: 1 });
            await interaction.reply({ content: 'Channel unlocked. Users can send messages.', ephemeral: true });
        } catch (error) {
            console.error('Failed to unlock channel:', error);
            await interaction.reply({ content: 'Failed to unlock channel.', ephemeral: true });
        }
    },
};
