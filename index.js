const { Client, Collection, Events, GatewayIntentBits: { Guilds }, Activity, ActivityType } = require('discord.js');
const { token } = require('./config.json');

const bot = new Client({ intents: [Guilds] });

const start = async function() {
	try {
		await bot.login(token);
	} catch (e) {
		console.log(e);
		setTimeout(() => start(), 5000);
	}
};


bot.commands = new Collection(require('./deploy-commands.js'));
let events = require('./events.js');

events.listen(bot);


start();