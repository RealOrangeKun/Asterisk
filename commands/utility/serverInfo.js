const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('server').setDescription('Sends a message with information about the server'),
	async execute(ineraction) {
		await ineraction.reply(`The server's name is ${ineraction.guild.name} and has ${ineraction.guild.memberCount} members`);
	},
};