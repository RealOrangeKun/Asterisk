const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const info = new EmbedBuilder();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('Replies with the banner of the user'),
	async execute(interaction) {
		const member = interaction.member;
		const userRoleColor = member.roles.highest.color;

		info.setColor(userRoleColor)
			.setImage(member.user.bannerURL({ dynamic: true }))
			.setFooter({
				text: 'Requested by ' + interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});
		await interaction.reply({ embeds: [info] });
	},
};
