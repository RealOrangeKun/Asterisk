// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { defineKey } = require('./apiKeys.json');
const { default: axios } = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Gives the definition of the word given')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word to define')
                .setRequired(true)),
    /**
*
* @param {ChatInputCommandInteraction} interaction
*/
    async execute(interaction) {
        try {
            const response = await axios.get('https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary', {
                params: {
                    word: interaction.options.getString('word'),
                }, headers: {
                    'X-RapidAPI-Key': defineKey,
                    'X-RapidAPI-Host': 'dictionary-by-api-ninjas.p.rapidapi.com',
                },
            });
            const definition = String(response.data.definition).match(/\d+\.\s+(.*?)\s+\d+\.\s+/)[1];
            const reply = new EmbedBuilder()
                .setTitle(`Definition for the word ${interaction.options.getString('word')}`)
                .addFields(
                    { name: 'Definition', value: definition, inline: true },
                )
                .setFooter({ text: 'Powered by API-Ninjas' });
            await interaction.reply({ embeds: [reply] });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while getting the definition', ephemeral: true });
        }
    },
};