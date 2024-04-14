const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('to clear messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to clear')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'You can only clear between 1 and 100 messages.', ephemeral: true });
        }
        if (!interaction.channel.permissionsFor(interaction.client.user).has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'I do not have permission to delete messages.', ephemeral: true });
        }


        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });
        
            if (messages.size == 0){
                return interaction.reply({ content: `There is no messages in this channel.`, ephemeral: true });
            }
            if (messages.size < amount + 1) {
                return interaction.reply({ content: `There are less than ${amount} messages in this channel.`, ephemeral: true });
            }
            await interaction.channel.bulkDelete(messages);
            await interaction.reply({ content: `Successfully cleared ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to clear messages:', error);
            await interaction.reply({ content: 'Failed to clear messages.', ephemeral: true });
        }
    }
}