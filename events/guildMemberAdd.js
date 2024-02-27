const {Events} = require('discord.js')
module.exports = {
	name: Events.GuildMemberAdd.toString(),
	once: false,
	async execute(member){
		try {
			await member.guild.systemChannel.send(`Welcome ${member.displayName} to the ${member.guild.name} server!`);
		} catch (e) {
			console.error(e);
		}
	}
}