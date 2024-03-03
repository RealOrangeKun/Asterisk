// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Adds chosen role to specific user')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
        .addRoleOption(option => option
            .setName('role')
            .setDescription('Role to be added')
            .setRequired(true))
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to add role to if not provided will add role to self')
            .setRequired(false)),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role'), user = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;
            if (user.roles.cache.some(r => r.id === role.id)) return await interaction.reply({ content: 'User already has role', ephemeral: true });
            user.roles.add(role);
            await interaction.reply({ content: 'Role has been added', fetchReply: true });
            setTimeout(async () => await interaction.deleteReply(), 2000);
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while trying to add the role', ephemeral: true });
        }
    },
};