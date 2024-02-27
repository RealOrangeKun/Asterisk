const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

const start = async function() {
	try {
		await bot.login(token);
	} catch (e) {
		console.log(e);
	}
};

bot.once(Events.ClientReady, readyClient => {
	console.log(`${readyClient.user.tag}`);
});

start();