const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('select the user to kick')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription("give the reason")
                .setRequired(false)
    ),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') || 'No reason provided'
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Kick')
            .setStyle('Danger');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle('Secondary');

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);
        await interaction.reply({
            content: `Are you sure you want to Kick ${user} for reason: ${reason}?`,
            components: [row],
        });
        const filter = (i) => i.customId === 'confirm' || i.customId === 'cancel';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'confirm') {
                await interaction.guild.members.kick(user, { reason });
                await interaction.followUp(`${user.tag} has been Kick for ${reason}.`);
            } else {
                await interaction.followUp('kick action canceled.');
            }
            collector.stop();
        });

        collector.on('end', async () => {
            await interaction.editReply({ components: [] });
        });
    }
}