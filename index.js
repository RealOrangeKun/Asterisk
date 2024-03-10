const { Client, Collection, GatewayIntentBits: { Guilds } } = require('discord.js');
const { token } = require('./config.json');

const chalk = require('chalk');

const bot = new Client({ intents: [Guilds] });

const start = async function () {
	try {
		console.log(chalk.green('Connected to Database! 🍃'));
		await bot.login(token);
	}
	catch (e) {
		console.log(e);
		setTimeout(() => start(), 5000);
	}
};


bot.commands = new Collection(require('./controllers/deploy-commands.js'));
const events = require('./controllers/events.js');

events.listen(bot);

start();

module.exports = {
	bot,
};