const { Events, ActivityType } = require('discord.js');
const { authorsIds } = require('./config.json');

module.exports.listen = function (client) {
	client.once(Events.ClientReady, async function () {
		client.user.setPresence({
			status: 'dnd',
			activities: [{
				name: 'customstatus',
				type: ActivityType.Custom,
				state: 'Floating in the sky!🌃⭐',
			}],
		});
		console.log(client.user.tag);
	});
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			if (interaction.commandName === 'reload') {
				// Check if the user is authorized to execute the reload command
				if (authorsIds.includes(interaction.user.id)) {
					throw new Error('Not Authorized');
				}
			}
			await command.execute(interaction);
			console.log(`Interaction: ${interaction.commandName} has been done successfully`);
		}
		catch (error) {
			console.error(error.message);
			await interaction.reply(error.message);
		}
	});
};