const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock-down')
        .setDescription('Lockdown the channel, preventing users from sending messages')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Set the duration of the lockdown (e.g., 5m, 1h, 1d)')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
        }

        const channel = interaction.channel;
        const durationString = interaction.options.getString('duration');

        let durationMilliseconds = 0;
        if (durationString) {
            const durationRegex = /^(\d+)([smhd])$/;
            const match = durationString.match(durationRegex);
            if (match) {
                const [, amount, unit] = match;
                switch (unit) {
                    case 's':
                        durationMilliseconds = parseInt(amount) * 1000; // Seconds
                        break;
                    case 'm':
                        durationMilliseconds = parseInt(amount) * 60000; // Minutes
                        break;
                    case 'h':
                        durationMilliseconds = parseInt(amount) * 3600000; // Hours
                        break;
                    case 'd':
                        durationMilliseconds = parseInt(amount) * 86400000; // Days
                        break;
                }
            } else {
                return interaction.reply('Invalid duration format. Use format: [number][s/m/h/d] (e.g., 1s for 1 second)');
            }
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { 
                SEND_MESSAGES: 0 // Use Permissions.FLAGS.SEND_MESSAGES instead of 'SEND_MESSAGES'
            });
            await interaction.reply({ content: 'Channel locked down. Users cannot send messages.', ephemeral: true });
        
            if (durationMilliseconds > 0) {
                setTimeout(async () => {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { 
                        SEND_MESSAGES: 1 // Use null to remove the overwrite
                    });
                    await interaction.followUp({ content: 'Lockdown duration ended. Channel unlocked.', ephemeral: true });
                }, durationMilliseconds);
            }
        } catch (error) {
            console.error('Failed to lock down channel:', error);
            await interaction.reply({ content: 'Failed to lock down channel.', ephemeral: true });
        }
    },
};
