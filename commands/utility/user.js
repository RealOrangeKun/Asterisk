// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with information about the user')
		.addUserOption(option => option
			.setName('user')
			.setDescription('User')
			.setRequired(false)),
	/**
*
* @param {ChatInputCommandInteraction} interaction
*/
	async execute(interaction) {
		try {
			let member = interaction.options.getMember('user');
			if (!member) member = interaction.member;
			const USER = interaction.options.getMember('user') ? await interaction.options.getUser('user').fetch() : await interaction.guild.members.fetch(interaction.user.id);
			const userRoleColor = member.roles.highest.color;
			const info = new EmbedBuilder();
			info.setColor(userRoleColor)
				.setTitle('User Information')
				.setDescription(`Here is some information about ${member.displayName}`)
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setImage(interaction.options.getMember('user') ? USER.bannerURL() : USER.user.bannerURL())
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
		}
		catch (e) {
			console.log(e);
			await interaction.reply({ content: 'Couldn\'t retrieve user info', ephemeral: true });
		}
	},
};