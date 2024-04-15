const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField  } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the invite link for the bot'),
  async execute(interaction) {
    // Get the invite link for the bot
    const inviteLink = await interaction.client.generateInvite({
      scopes: ['bot', 'applications.commands'],
      permissions: [
        PermissionsBitField.Flags.Administrator
      ],
    });

    // Reply with the invite link
    await interaction.reply(`You can invite me to your server using this link: ${inviteLink}`);
  },
};
