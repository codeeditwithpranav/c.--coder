const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-anc')
        .setDescription('create announcement')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('enter your title here')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('which channel you want to send')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('enter the content [less than 1024]')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('author-name')
                .setDescription('enter the name of author')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.user;
        const title = interaction.options.getString('title');
        const channel = interaction.options.getChannel('channel');
        const content = interaction.options.getString('content');
        const avatarURL = user.avatarURL({ format: 'png', dynamic: true });

        if (!channel) {
            return await interaction.reply('Please provide a valid channel.');
          }
      
          const botUser = await interaction.client.users.fetch(interaction.client.user.id);
          const permissions = channel.permissionsFor(botUser);
          if (!permissions || !permissions.has('SEND_MESSAGES')) {
            try {
              await channel.permissionOverwrites.upsert(botUser, {
                SEND_MESSAGES: true,
              });
            } catch (error) {
              console.error(error);
              return await interaction.reply(
                'Failed to grant permission to send messages in that channel.'
              );
            }
          }
        try {
            const embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle(title)
                .setAuthor({ name: user.username, iconURL: avatarURL })
                .setDescription(content)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
            await interaction.reply('Announcement created successfully!');
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to create announcement.');
        }
    },
};
