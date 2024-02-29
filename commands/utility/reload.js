const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { utility, apis } = require('./commands.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Used to reload a command if it\'s not wokring')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Command to be reloaded')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const commandName = interaction.options.getString('command', true).toLowerCase();
            const command = interaction.client.commands.get(commandName);
            if (!command) {
                await interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true });
                return;

            }
            if (utility.includes(command.data.name)) {
                delete require.cache[require.resolve(`./${command.data.name}.js`)];
            }
            else {
                const object = require('./commands.json');
                for (const key in object) {
                    if (object[key].includes(command.data.name)) {
                        const commandFolder = path.join(__dirname, `../${key}`);
                        delete require.cache[path.join(commandFolder, `${command.data.name}.js`)];
                    }
                }
            }

            interaction.client.commands.delete(command.data.name);
            let newCommand;
            if (utility.includes(command.data.name)) {
                newCommand = require(`./${command.data.name}.js`);
            }
            else {
                const object = require('./commands.json');
                for (const key in object) {
                    if (object[key].includes(command.data.name)) {
                        const commandFolder = path.join(__dirname, `../${key}`);
                        newCommand = require(path.join(commandFolder, `${command.data.name}.js`));
                    }
                }
            }
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({ content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: `There was an error while reloading a command \`${interaction.options.getString('command', true).toLowerCase()}\`:\n\`${e.message}\``, ephemeral: true });
        }

    },
};
