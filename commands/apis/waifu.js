// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { waifuKey } = require('./apiKeys.json');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Provides info about an anime waifu')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the waifu')
            .setRequired(false))
        .addStringOption(option => option
            .setName('anime')
            .setDescription('Name of the anime desired')
            .setRequired(false)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const name = interaction.options.getString('name'), anime = interaction.options.getString('anime');
        try {
            const response = await axios.get('https://waifu.it/api/v4/waifu', {
                headers: {
                    Authorization: waifuKey,
                }, params: {
                    name: name ? String(name) : '',
                    anime: anime ? String(anime) : '',
                },
            });
            const data = response.data;
            const waifuName = data.name.full, image = data.image.large, age = data.age, gender = data.gender,
                dateOfBirth = new Date(data.dateOfBirth.year, data.dateOfBirth.month, data.dateOfBirth.day),
                description = data.description;
            const waifuInfo = new EmbedBuilder()
                .setTitle(waifuName)
                .setImage(image)
                .addFields(
                    { name: 'Age', value: age ? age : 'No Age Data Found' },
                    { name: 'Gender', value: gender ? gender : 'No Gender Data Found' },
                    { name: 'Date of Birth', value: dateOfBirth ? dateOfBirth.toDateString() : 'No Date of Birth Data Found' },
                    { name: 'Description', value: description ? description : 'No Description Data Found' },
                );
            await interaction.reply({ embeds: [waifuInfo] });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while retrieving the waifu info', ephemeral: true });
        }

    },
};