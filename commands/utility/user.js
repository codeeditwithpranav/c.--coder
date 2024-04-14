const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information about a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select the user')
				.setRequired(true)
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const avatarURL = user.avatarURL({ format: 'png', dynamic: true, size: 1024 });

		const embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setTitle('User Information')
			.setThumbnail(avatarURL)
			.addFields(
				{ name: 'Username', value: user.username, inline: true },
				{ name: 'Tag', value: user.tag, inline: true },
				{ name: 'ID', value: user.id, inline: true },
				{ name: 'Created At', value: user.createdAt.toUTCString(), inline: true },
				{ name: '\u200B', value: '\u200B' }, // Empty field to create space
			);

		await interaction.reply({ embeds: [embed] });
	},
};
