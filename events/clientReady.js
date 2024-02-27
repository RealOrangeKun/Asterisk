const { ActivityType , Events} = require('discord.js');

module.exports = {
	name: Events.ClientReady.toString(),
	once: true,
	async execute(client) {
		await client.user.setPresence({
			status: 'dnd',
			activities: [{
				name: 'customstatus',
				type: ActivityType.Custom,
				state: 'Floating in the sky!🌃⭐',
			}],
		});
	},
};