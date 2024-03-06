// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require('discord.js');
const { getProductsFromSearch } = require('../../../scraping/amazon/productsFromSearch.js');
let products;
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
        await interaction.reply({ content: 'Getting info from Amazon..', fetchReply: true, ephemeral: true });
        try {
            products = await getProductsFromSearch(interaction.options.getString('product'));
            const info = new EmbedBuilder()
                .setTitle('Search Results for the word ' + interaction.options.getString('product'));
            let embedLength = 0;
            let i;
            for (i = 0; i < Math.min(products.length, 10); i++) {
                if (embedLength >= 5000) break;
                info.addFields(
                    {
                        name: 'Product Name', value: `[${products[i].title}](${products[i].link}) - ` +
                            products[i].price + '\n', inline: false,
                    },
                );
                embedLength += products[i].title.length + products[i].link.length;
            }
            const options = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Secondary).setCustomId('Amazon-Forward-' + String(interaction.user.id)),
                );
            await interaction.followUp({ embeds: [info], ephemeral: false, components: [options], fetchReply: true });
            console.log(i);
            return i;
        }
        catch (e) {
            await interaction.followUp({ content: 'Couldn\'t get product results from Amazon', ephemeral: true });
            console.log(e);
        }
    },
    /**
    *
    * @param {ButtonInteraction} interaction
    * @param {Number} start
    */
    async forward(interaction, start) {
        let i = start;
        const info = new EmbedBuilder();
        const options = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Secondary).setCustomId('Amazon-Forward-' + String(interaction.user.id)),
        );
        if (start >= products.length) {
            info.setTitle('Last Page Reached!');
        }
        else {
            let embedLength = 0;
            for (i = start; i < products.length; i++) {
                if (embedLength >= 5000) break;
                info.addFields(
                    {
                        name: 'Product Name', value: `[${products[i].title}](${products[i].link}) - ` +
                            products[i].price + '\n', inline: false,
                    },
                );
                embedLength += products[i].title.length + products[i].link.length;
            }
        }
        await interaction.message.edit({ embeds: [info], components: [options] });
        console.log(i, products.length);
        return i;
    },
};
