const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete number of messages from current channel')
        .addIntegerOption(option => option
            .setName('messages')
            .setDescription('Number of messages to be deleted')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Administrator),
    /**
*
* @param {import('discord.js').ChatInputCommandInteraction} interaction
*/
    async execute(interaction) {
        try {
            await interaction.reply({ content: 'Deleting replies..', ephemeral: true, fetchReply: true });
            await interaction.channel.bulkDelete(Number(interaction.options.getInteger('messages')));
            await interaction.editReply({ content: 'Deleted messages successfully' });
        }
        catch (error) {
            console.log(error);
            await interaction.editReply({ content: 'Couldn\'t delete messages' });
        }
    },
};