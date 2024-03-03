// eslint-disable-next-line no-unused-vars
const { Events, ActivityType, Client, GuildMember } = require('discord.js');
const { authorsIds } = require('./config.json');
const membersWhoVoted = new Set();
let member;
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
		const command = interaction.client.commands.get(interaction.commandName);
		if (interaction.isChatInputCommand()) {
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				await interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
				return;
			}

			if (interaction.commandName === 'reload') {
				if (!authorsIds.includes(interaction.user.id)) {
					await interaction.reply({ content: 'Bs ya a7ba', ephemeral: true });
				}
			}
			if (interaction.commandName === 'kick') { member = await command.execute(interaction); }
			else { await command.execute(interaction); }
		}
		else if (interaction.isButton()) {
			const info = interaction.customId.split('-');
			if (info[0] === 'Poll') {
				const checker = `${interaction.user.id}-${interaction.message.id}`;
				if ((membersWhoVoted).has(checker)) { return await interaction.reply({ content: 'You already voted!', ephemeral: true }); }
				membersWhoVoted.add(checker);
				const pollEmbed = interaction.message.embeds[0];
				const yes = pollEmbed.fields[0];
				const no = pollEmbed.fields[1];
				switch (info[1]) {
					case 'Yes': {
						yes.value = parseInt(yes.value) + 1;
					} break;
					case 'No': {
						no.value = parseInt(no.value) + 1;
					} break;
				}
				await interaction.reply({ content: 'Your vote has been submitted', ephemeral: true });
				await interaction.message.edit({ embeds: [pollEmbed] });
			}
			else if (info[0] === 'Kick') {
				try {
					const kick = interaction.client.commands.get('kick');
					switch (info[1]) {
						case 'Yes': {
							if (info[2] !== interaction.user.id) return await interaction.reply({ content: 'You are not authorized to choose', ephemeral: true });
							await kick.kick(interaction, member);
							await interaction.message.delete();
							await interaction.reply({ content: 'User kicked sucessfully!', ephemeral: true });
						} break;
						case 'No': {
							if (info[2] !== interaction.user.id) return await interaction.reply({ content: 'You are not authorized to choose', ephemeral: true, components: null });
							await interaction.message.delete();
						} break;
					}
				}
				catch (e) {
					console.log(e);
					await interaction.message.edit({ content: 'There was an error while trying to kick', components: null });
					setTimeout(() => interaction.message.delete(), 1500);
				}
			}
		}
	},
	);
};