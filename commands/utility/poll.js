// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll so users can vote on something')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('question')
            .setDescription('Questions of the pole')
            .setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const question = interaction.options.getString('question');
            const poll = new EmbedBuilder()
                .setTitle(`Question: ${question}`)
                .setImage('https://i.ibb.co/vxdBKFd/Untitled-1.gif')
                .addFields([
                    { name: 'Yes\'s', value: '0', inline: true },
                    { name: 'No\'s', value: '0', inline: true },
                ])
                .setColor([104, 204, 156]);
            const reply = await interaction.reply({ embeds: [poll], fetchReply: true });
            const pollOptions = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setLabel('Yes').setCustomId(`Poll-Yes-${reply.id}`).setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setLabel('No').setCustomId(`Poll-No-${reply.id}`).setStyle(ButtonStyle.Danger),
                );
            const Reply = await reply.fetch();
            await Reply.edit({ components: [pollOptions] });
        }
        catch (e) {
            console.log(e);
            await interaction.editReply('Couldn\'t make the poll!');
        }

    },
};
