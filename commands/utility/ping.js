// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),
	/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
	async execute(interaction) {

		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
		await interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};