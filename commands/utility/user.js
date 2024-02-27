const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const info = new EmbedBuilder();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with information about the user'),
	async execute(interaction) {
		const member = interaction.member;
		const userRoleColor = member.roles.highest.color;
		info.setColor(userRoleColor)
			.setTitle('User Information')
			.setDescription(`Here is some information about ${member.displayName}`)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: 'Username', value: member.user.username, inline: true },
				{ name: 'Discriminator', value: member.user.discriminator, inline: true },
				{ name: 'User ID', value: member.id },
				{ name: 'Joined Discord', value: member.user.createdAt.toLocaleDateString('en-US') },
				{ name: 'Joined Server', value: member.joinedAt.toLocaleDateString('en-US') },
				{ name: 'Roles', value: member.roles.cache.map(role => role.name).join(', ') },
			)
			.setTimestamp()
			.setFooter({
				text: 'Requested by ' + interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});
		await interaction.reply({ embeds: [info] });
	},
};