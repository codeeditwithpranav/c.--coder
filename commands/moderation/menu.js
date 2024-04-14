const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('about all command in this bot'),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('option')
            .setPlaceholder('select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Moderation Commands 🛡️')
                    .setDescription('there are four moderation commands.')
                    .setValue('mod-commands'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('ai-commands')
                    .setDescription('there is only one ai command.')
                    .setValue('ai-commands'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('utility-commands')
                    .setDescription('there are three utility commands.')
                    .setValue('utility-commands'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('server-commands')
                    .setDescription('there is only one command.')
                    .setValue('server'),

            )

        const row1 = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Choose your starter!',
            components: [row1],
        });
        const filter = i => i.customId === 'option' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const val = i.values[0]
            if (val === 'mod-commands') {
                const embed = new EmbedBuilder()
                    .setTitle('Moderation Commands')
                    .addFields(
                        { name: '🚫 /ban', value: 'ban a member' },
                        { name: '👢 /kick', value: 'kick a member' },
                        { name: '🔇 /mute', value: 'mute a member' },
                        { name: '⏳ /time_out', value: 'time_out a member' },
                        { name: '🔒 /lock-down', value: 'lock-down a spcific channel' },
                        { name: '🔓 /un-lockdown', value: 'un-lockdown a channel' },
                        { name: '🗑️ /clear', value: 'clear meassage from a chat' },
                        { name: '⏱️ /slow-mode', value: 'enable slow mode in a channel' },

                    )
                    .setColor(0x0099FF)
                    .setTimestamp()
                    .setFooter({ text: 'is this helpfull', iconURL: 'https://t3.ftcdn.net/jpg/03/99/53/44/360_F_399534445_zG1tMcAn0q7bCaPw2Lp5ZWiBiBgQYxvN.jpg' });

                await i.update({ content: 'Here are the moderation commands:', embeds: [embed] });
            }
            if (val === 'ai-commands') {
                const embed = new EmbedBuilder()
                    .setTitle('ai Commands')
                    .addFields(
                        { name: '🧠 /prompt', value: 'you can intract with gemini pro' },
                        { name: '🖼️ /gen-image', value: 'you can create ai images' },


                    )
                    .setColor(0x0099FF)
                    .setTimestamp()
                    .setFooter({ text: 'is this helpfull', iconURL: 'https://t3.ftcdn.net/jpg/03/99/53/44/360_F_399534445_zG1tMcAn0q7bCaPw2Lp5ZWiBiBgQYxvN.jpg' });

                await i.update({ content: 'Here are the moderation commands:', embeds: [embed] });
            }
            if (val === 'utility-commands') {
                const embed = new EmbedBuilder()
                    .setTitle('utility-commands')
                    .addFields(
                        { name: '👤 /user', value: 'you can get the information of a user' },
                        { name: '🏰 /server', value: 'you can get the information of our server' },
                        { name: '🏓 /ping', value: 'it will reply with your ping' },
                        { name: '🖼️ /avatar', value: 'gives a user profile image' },


                    )
                    .setColor(0x0099FF)
                    .setTimestamp()
                    .setFooter({ text: 'is this helpfull', iconURL: 'https://t3.ftcdn.net/jpg/03/99/53/44/360_F_399534445_zG1tMcAn0q7bCaPw2Lp5ZWiBiBgQYxvN.jpg' });

                await i.update({ content: 'Here are the moderation commands:', embeds: [embed] });
            }
            if (val === 'server') {
                const embed = new EmbedBuilder()
                    .setTitle('server commands')
                    .addFields(
                       
                        { name: '🏰 /create-anc', value: 'You can put your announcement in your desired channels.' },
                        


                    )
                    .setColor(0x0099FF)
                    .setTimestamp()
                    .setFooter({ text: 'is this helpfull', iconURL: 'https://t3.ftcdn.net/jpg/03/99/53/44/360_F_399534445_zG1tMcAn0q7bCaPw2Lp5ZWiBiBgQYxvN.jpg' });

                await i.update({ content: 'Here are the moderation commands:', embeds: [embed] });
            }
        });

        collector.on('end', async collected => {
            await interaction.editReply({ content: 'Interaction ended.' });
        });

    }
}