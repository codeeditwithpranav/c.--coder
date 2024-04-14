const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('select the user to mute')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription("give the reason")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The duration of the ban (e.g., 1d, 1w, 1m, 1s)')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
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
                        durationMilliseconds = parseInt(amount) * 1000; // second
                        break;
                }
            } else {
                return interaction.reply('Invalid duration format. Use format: [number][w/d/h/m] (e.g., 1w for 1 week)');
            }
        }
        let muteRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    permissions: [],
                    mentionable: false,
                    reason: 'Creating a mute role for muting user'
                });
            } catch (error) {
                console.error('failed to create mute role', error);
                return interaction.reply("failed to create mute role");
            }
        }

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm mute')
            .setStyle('Danger');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle('Secondary');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);
        await interaction.reply({
            content: `Are you sure you want to mute ${user} for reason: ${reason}?`,
            components: [row],
        });
        const filter = (i) => i.customId === 'confirm' || i.customId === 'cancel';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        // Assuming the rest of your code remains the same

        collector.on('collect', async (i) => {
            if (i.customId === 'confirm') {
                try {
                    const member = await interaction.guild.members.fetch(user.id);
                    await member.roles.add(muteRole.id);
                    await interaction.followUp(`${member.user.tag} has been muted for ${reason}.`);
                    console.log('muted')
                    if (durationMilliseconds > 0) {
                        console.log('hi')
                        setTimeout(async () => {
                            try {

                                await member.roles.remove(muteRole.id);
                                console.log(`${member.user.tag} has been unmuted after the specified duration.`);
                                await interaction.followUp(`${member.user.tag} has been unmuted after the specified duration.`);

                            } catch (error) {
                                console.error('Failed to remove mute role from user:', error);
                            }
                        }, durationMilliseconds);
                    }

                } catch (error) {
                    console.error('Failed to add mute role to user:', error);
                    return interaction.followUp('Failed to mute user.');
                }
            } else {
                await interaction.followUp('Mute action canceled.');
            }
            collector.stop();
        });

        // Assuming the rest of your code remains the same


        collector.on('end', async () => {
            await interaction.editReply({ components: [] });
        });
    }
}
