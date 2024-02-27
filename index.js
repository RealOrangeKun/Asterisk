const { Client, Collection, Events, GatewayIntentBits: { Guilds }, Activity, ActivityType } = require('discord.js');
const { token } = require('./config.json');

const bot = new Client({ intents: [Guilds] });

const start = async function() {
	try {
		await bot.login(token);
	} catch (e) {
		console.log(e);
	}
};


bot.commands = new Collection(require('./deploy-commands.js'));
bot.events = require('./events.js');

bot.once(Events.ClientReady, readyClient => {
	try {
		bot.events.get(Events.ClientReady.toString()).execute(bot);
		console.log(`${readyClient.user.tag}`);
	} catch (e) {
		console.error(e);
	}
});
bot.on(Events.InteractionCreate, async interaction => {
	try {
		await bot.events.get(Events.InteractionCreate.toString()).execute(interaction);
	} catch (e) {
		console.error(e);
	}

});
bot.on(Events.GuildMemberAdd, async member => {
	try {
		await bot.events.get(Events.GuildMemberAdd.toString()).execute(member);
	} catch (e) {
		console.error(e);
	}

});
bot.on(Events.GuildMemberRemove, async member => {
	try {
		await bot.events.get(Events.GuildMemberRemove.toString()).execute(member);
	} catch (e) {
		console.error(e);
	}
});
start();