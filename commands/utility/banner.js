// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('Replies with the banner of the user')
		.addUserOption(option => option
			.setName('user')
			.setDescription('Send banner of user')
			.setRequired(false)),
	/**
*
* @param {ChatInputCommandInteraction} interaction
*/
	async execute(interaction) {
		try {
			const info = new EmbedBuilder();
			let member = interaction.options.getMember('user');
			if (!member) member = interaction.member;
			const USER = interaction.options.getMember('user') ? await interaction.options.getUser('user').fetch() : await interaction.guild.members.fetch(interaction.user.id);
			const userRoleColor = member.roles.highest.color;
			info.setColor(userRoleColor)
				.setImage(interaction.options.getMember('user') ? USER.bannerURL() : USER.user.bannerURL())
				.setFooter({
					text: 'Requested by ' + interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});
			await interaction.reply({ embeds: [info] });
		}
		catch (e) {
			await interaction.reply({ content: 'Couldn\'t retrieve user banner', ephemeral: true });
		}
	},
};

