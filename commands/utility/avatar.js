const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('show avatar of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('select the user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const avatarURL = user.avatarURL({ format: 'png', dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setImage(avatarURL)
        const message = await interaction.reply({ embeds: [embed], content: 'Reac with given emoji!', fetchReply: true })
        await message.react('👌');
        await message.react('👎');
    }
}
