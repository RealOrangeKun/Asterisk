const { REST, Routes } = require('discord.js');
const { clientId, guildId, token, adminCommands } = require('./config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const commands = [], commands2 = [];
const commandsMap = new Map();

function readCommands(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.lstatSync(filePath);
		if (stat.isDirectory()) {
			readCommands(filePath);
		}
		else if (file.endsWith('.js')) {
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
				console.log(chalk.green(`[SUCCESS] Command "${command.data.name}" added successfully.`));
			}
			else {
				console.log(chalk.yellow(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
			}
		}
	}
}

// Call readCommands with the commands directory path
readCommands(path.join(__dirname, 'commands'));

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
		console.log(chalk.green(`Successfully reloaded ${data.length} application (/) commands.`));
		console.log(chalk.green(`Added Admin commands to test server, length: ${adminData.length}`));
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(chalk.red(`[ERROR] ${error}`));
	}
})();

module.exports = commandsMap;