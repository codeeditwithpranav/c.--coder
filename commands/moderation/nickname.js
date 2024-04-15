const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-nickname')
    .setDescription('Change a user\'s nickname in the server')
    .addUserOption((option) => option.setName('user')
      .setDescription('The user whose nickname will be changed')
      .setRequired(true))
    .addStringOption((option) => option.setName('nickname')
      .setDescription('The new nickname')
      .setRequired(true)),
  async execute(interaction) {
    // Check if the user has the required permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
      console.log('This member does not have permission to change nicknames.');
      return;
    }

    const user = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');

    try {
      await interaction.guild.members.fetch(user.id).then((member) => {
        member.setNickname(nickname);
        interaction.reply({ content: `Changed ${user.username}'s nickname to ${nickname}.`, ephemeral: true });
      });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Failed to change nickname.', ephemeral: true });
    }
  },
};