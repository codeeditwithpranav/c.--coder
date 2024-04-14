const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
	    
		const guild = interaction.guild;
		const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');
		const voiceChannelCount = voiceChannels.size;
		const categories = guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY');
		const categoryCount = categories.size;
		const embed = new EmbedBuilder()
			.setTitle('SERVER INFORMATION')
			.setColor('DarkGold')
			.setTimestamp()
			.addFields({
				name: ' ', value: `👑 Owner: ${interaction.guild.owner}\n\n👥 Members: ${interaction.guild.memberCount}
		   \n📅 Created: ${interaction.guild.createdAt}\n\n🌍 Region: ${interaction.guild.region}\n\n🔗 Server ID: ${interaction.guild.id}\n\n📝 Description: null\n
		   \n🔒 Verification Level: ${interaction.guild.verificationLevel}\n💬 Total Channels: ${interaction.guild.channels.cache.size}
		   \n🔊 Voice Channels: ${voiceChannelCount}\n📁 Categories: ${categoryCount}`
			})

		await interaction.reply({ embeds: [embed] })
	},
};
