const { ActivityType } = require('discord.js');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.user.setPresence({
			status: 'dnd',
			activities: [{
				name: 'customstatus',
				type: ActivityType.Custom,
				state: 'Floating in the sky!🌃⭐',
			}],
		});
	},
};