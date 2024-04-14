const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slow-mode')
        .setDescription('Enable slow mode in the channel')
        .addIntegerOption(option =>
            option.setName('delay')
                .setDescription('Set the slow mode delay in seconds (1-21600)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Set the duration of slow mode (e.g., 5m, 1h, 1d)')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
        }

        const channel = interaction.channel;
        const delay = interaction.options.getInteger('delay');
        const durationString = interaction.options.getString('duration');

        if (delay < 1 || delay > 21600) {
            return interaction.reply({ content: 'Please provide a delay between 1 and 21600 seconds.', ephemeral: true });
        }

        const durationRegex = /^(\d+)([smhd])$/;
        const match = durationString.match(durationRegex);
        let durationMilliseconds = 0;
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

        try {
            const currentDelay = channel.rateLimitPerUser;
            if (currentDelay === delay) {
                return interaction.reply({ content: `Slow mode is already set to ${delay} seconds.`, ephemeral: true });
            }

            await channel.setRateLimitPerUser(delay);
            await interaction.reply({ content: `Slow mode enabled. Users can send messages every ${delay} seconds for ${durationString}.`, ephemeral: true });

            // Automatically disable slow mode after the specified duration
            setTimeout(async () => {
                await channel.setRateLimitPerUser(0);
                await interaction.followUp({ content: 'Slow mode disabled.', ephemeral: true });
            }, durationMilliseconds);
        } catch (error) {
            console.error('Failed to enable slow mode:', error);
            await interaction.reply({ content: 'Failed to enable slow mode.', ephemeral: true });
        }
    },
};
