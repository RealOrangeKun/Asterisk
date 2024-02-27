const { Events } = require('discord.js');
module.exports = {
	name: Events.GuildMemberRemove.toString(),
	once: false,
	async execute(member) {
		await member.guild.systemChannel.send(`${member.displayName} has sadly left us!`);
	},
};