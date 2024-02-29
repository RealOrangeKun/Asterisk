// eslint-disable-next-line no-unused-vars
const { Events, ActivityType, Client } = require('discord.js');
const { authorsIds } = require('./config.json');
const membersWhoVoted = new Set();
/**
 *
 * @param {Client} client
 */
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

		if (interaction.commandName === 'reload') {
			// Check if the user is authorized to execute the reload command
			if (!authorsIds.includes(interaction.user.id)) {
				throw new Error('Not Authorized');
			}
		}
		await command.execute(interaction);
	}
		// else if (interaction.isButton()) {
		// 	const info = interaction.customId.split('-');
		// 	if (info[0] === 'Poll') {
		// 		const checker = `${interaction.user.id}-${interaction.message.id}`;
		// 		if ((membersWhoVoted).has(checker)) { return await interaction.reply({ content: 'You already voted!', ephemeral: true }); }
		// 		membersWhoVoted.add(checker);
		// 		const pollEmbed = interaction.message.embeds[0];
		// 		const yes = pollEmbed.fields[0];
		// 		const no = pollEmbed.fields[0];
		// 		switch (info[1]) {
		// 			case 'Yes': {
		// 				yes.value = parseInt(yes.value) + 1;
		// 			} break;
		// 			case 'No': {
		// 				no.value = parseInt(no.value) + 1;
		// 			} break;
		// 		}
		// 		await interaction.reply({ content: 'Your vote has been submitted', ephemeral: true });
		// 		await interaction.message.edit({ embeds: [pollEmbed] });
		// 	}
		// }
		// }
	);
};