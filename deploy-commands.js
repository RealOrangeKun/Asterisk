const { REST, Routes } = require('discord.js');
const { clientId, guildId, token, adminCommands } = require('./config.json');
const fs = require('fs');
const path = require('path');

const commands = [], commands2 = [];
const commandsMap = new Map();
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if (adminCommands.includes(command.data.name)) {
				commands2.push(command.data.toJSON());
				commandsMap.set(command.data.name, command);
			}
			else {
				commands.push(command.data.toJSON());
				commandsMap.set(command.data.name, command);
			}
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		const adminData = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands2 },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		console.log(`Added Admin commands to test server, length: ${adminData.length}`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

module.exports = commandsMap;