const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const info = new EmbedBuilder();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('Replies with the banner of the user')
		.addUserOption(option => option
			.setName('user')
			.setDescription('Test')
			.setRequired(false)),
	async execute(interaction) {
		let user = interaction.options.getMember('user');
		if (!user) user = interaction.member;
		const userRoleColor = user.roles.highest.color;

		info.setColor(userRoleColor)
			.setImage(user.user.bannerURL({ dynamic: true }))
			.setFooter({
				text: 'Requested by ' + interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});
		await interaction.reply({ embeds: [info] });
	},
};
