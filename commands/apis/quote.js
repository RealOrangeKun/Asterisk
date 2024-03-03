// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { XApiKey } = require('./apiKeys.json');
const { default: axios } = require('axios');
const categories = [
    'age', 'alone', 'amazing', 'anger', 'architecture', 'art', 'attitude', 'beauty', 'best', 'birthday',
    'business', 'car', 'change', 'communication', 'computers', 'cool', 'courage', 'dad', 'dating', 'death',
    'design', 'dreams', 'education', 'environmental', 'equality', 'experience', 'failure', 'faith', 'family',
    'famous', 'fear', 'fitness', 'food', 'forgiveness', 'freedom', 'friendship', 'funny', 'future', 'god',
    'good', 'government', 'graduation', 'great', 'happiness', 'health', 'history', 'home', 'hope', 'humor',
    'imagination', 'inspirational', 'intelligence', 'jealousy', 'knowledge', 'leadership', 'learning', 'legal',
    'life', 'love', 'marriage', 'medical', 'men', 'mom', 'money', 'morning', 'movies', 'success',
];


module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Sends quotes about a category if provided')
        .addStringOption(option => option
            .setName('category')
            .setDescription('Category of the quote')
            .setRequired(false)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const category = interaction.options.getString('category');
            const response = await axios.get(category ? 'https://api.api-ninjas.com/v1/quotes?category=' + category : 'https://api.api-ninjas.com/v1/quotes?category=', {
                headers: {
                    'X-Api-Key': XApiKey,
                },
            });
            const data = response.data[0];
            const quote = data.quote, author = data.author, cat = data.category;
            const quoteEmbed = new EmbedBuilder()
                .setTitle(quote)
                .addFields(
                    { name: 'Author', value: author },
                    { name: 'Category', value: cat.charAt(0).toUpperCase() + cat.substr(1).toLowerCase() },
                );
            await interaction.reply({ embeds: [quoteEmbed] });
        }
        catch (e) {
            console.error(e);
            await interaction.reply({ content: 'There was an error while trying to retrieve a quote', ephemeral: true });
        }
    },
};