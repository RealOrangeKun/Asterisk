// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
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
        const products = await getProductsFromSearch(interaction.options.getString('product'));
        const title = products[0].title;
        await interaction.reply({ content: `${title}\n$${products[0].price}`, ephemeral: true });
    },
};
