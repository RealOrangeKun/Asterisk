const { Client, Collection, Events, GatewayIntentBits: { Guilds }, Activity, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const commands = require('./deploy-commands.js');

const bot = new Client({ intents: [Guilds] });

const start = async function() {
	try {
		await bot.login(token);
	} catch (e) {
		console.log(e);
	}
};

bot.commands = new Collection(commands);
bot.ready = require('./events/clientReady');
bot.interactionCreate = require('./events/interactionCreate');

bot.once(Events.ClientReady, readyClient => {
	try {
		bot.ready.execute(bot);
	} catch (e) {
		console.error(e);
	} finally {
		console.log(`${readyClient.user.tag}`);
	}
});

bot.on(Events.InteractionCreate, async interaction => {
	await bot.interactionCreate.execute(interaction);
});
bot.on(Events.GuildMemberAdd, async member => {
	try {
		await member.guild.systemChannel.send(`Welcome ${member.displayName} to the ${member.guild.name} server!`);
	} catch (e) {
		console.error(e);
	}
});
bot.on(Events.GuildMemberRemove, async member => {
	try {
		await member.guild.systemChannel.send(`${member.displayName} has sadly left us!`);
	} catch (e) {
		console.error(e);
	}
});

start();