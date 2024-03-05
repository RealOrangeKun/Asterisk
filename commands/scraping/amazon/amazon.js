// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { default: axios } = require('axios');
const { getProductsFromSearch } = require('../../../scraping/amazon/productsFromSearch.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('amazon')
        .setDescription('Gets information about product search from amazon')
        .addStringOption(option => option
            .setName('product')
            .setDescription('Name of the product')
            .setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.reply(JSON.stringify(await getProductsFromSearch(interaction.options.getString('product'))[0], null, 4));
    },
};
