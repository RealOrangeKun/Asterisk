// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, GuildMember } = require('discord.js');
const { bot } = require('../../index.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member out of the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for the kick')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.Administrator),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const reply = await interaction.reply({ content: `Are you sure you want to kick ${interaction.options.getUser('user')}?`, ephemeral: false, fetchReply: true });
        const options = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setLabel('Yes').setCustomId(`Kick-Yes-${interaction.user.id}-${interaction.options.getUser('user').id}-${reply.id}`).setStyle(ButtonStyle.Success),
                new ButtonBuilder().setLabel('No').setCustomId(`Kick-No-${interaction.user.id}`).setStyle(ButtonStyle.Danger),
            );
        const Reply = await reply.fetch();
        await Reply.edit({ components: [options] });
        return interaction.options.getMember('user');
    },
    /**
    *
    * @param {ButtonInteraction} interaction
    * @param {GuildMember} memberToKick
    */
    async kick(interaction, memberToKick) {
        try {
            await memberToKick.kick();
        }
        catch (e) {
            await interaction.reply({ content: 'There was an error while trying to kick', ephemeral: true });
            console.log(e);
        }
    },
};