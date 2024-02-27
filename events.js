const { Events, ActivityType } = require('discord.js');
const sendMessage = async function(client, id) {
	const channel = await client.channels.fetch(id);
	await channel.send('hello');
};
module.exports.listen = function(client) {
	client.once(Events.ClientReady, async readyClient => {
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
			await command.execute(interaction);
			console.log(`Interaction: ${interaction.commandName} has been done successfully`);
		} catch (error) {
			console.error(error);
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	});
};