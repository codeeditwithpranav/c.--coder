const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The duration of the ban (e.g., 1d, 1w, 1m,1s)')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const duration = interaction.options.getString('duration');
        let durationMilliseconds = 0;

        if (duration) {
            const durationMatch = duration.match(/^(\d+)([wdhms])$/);
            if (durationMatch) {
                const [, amount, unit] = durationMatch;
                switch (unit) {
                    case 'w':
                        durationMilliseconds = parseInt(amount) * 7 * 24 * 60 * 60 * 1000; // Weeks
                        break;
                    case 'd':
                        durationMilliseconds = parseInt(amount) * 24 * 60 * 60 * 1000; // Days
                        break;
                    case 'h':
                        durationMilliseconds = parseInt(amount) * 60 * 60 * 1000; // Hours
                        break;
                    case 'm':
                        durationMilliseconds = parseInt(amount) * 60 * 1000; // Minutes
                        break;
                    case 's':
                        durationMilliseconds = parseInt(amount) * 60 * 1000; // Minutes
                        break;
                }
            } else {
                return interaction.reply('Invalid duration format. Use format: [number][w/d/h/m] (e.g., 1w for 1 week)');
            }
        }
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle('Danger');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle('Secondary');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        await interaction.reply({
            content: `Are you sure you want to ban ${user} for reason: ${reason}?`,
            components: [row],
        });

        const filter = (i) => i.customId === 'confirm' || i.customId === 'cancel';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'confirm') {
                await interaction.guild.members.ban(user, { reason });
                await interaction.followUp(`${user.tag} has been banned for ${reason} to the time period of ${duration}.`);
                if (durationMilliseconds > 0) {
                    setTimeout(async () => {
                        await interaction.guild.members.unban(user);
                    }, durationMilliseconds);
                }
            } else {
                await interaction.followUp('Ban action canceled.');
            }
            collector.stop();
        });

        collector.on('end', async () => {
            await interaction.editReply({ components: [] });
        });

        // await interaction.guild.members.ban(user, { reason });
        // await interaction.reply(`${user.tag} has been banned for ${reason}.`);
    }
};
