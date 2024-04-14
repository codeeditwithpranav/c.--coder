const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select the user')
				.setRequired(
					false
				)
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const startTime = Date.now();
		const avatarURL = user.avatarURL({ format: 'png', dynamic: true });
		try {
			const message = await interaction.reply({ content: 'Pinging...', fetchReply: true });
			const endTime = Date.now();

			const latency = endTime - startTime;
			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setAuthor({ name: user.username, iconURL: avatarURL })
				.addFields({ name: " ", value: `Latency of ${user.tag}: ${latency}ms` })
			await message.edit({ content: " ", embeds: [embed] });
		} catch (error) {
			console.error(`Failed to ping ${user.tag}:`, error);
			await interaction.reply(`Failed to ping ${user.tag}.`);
		}
	},
};
