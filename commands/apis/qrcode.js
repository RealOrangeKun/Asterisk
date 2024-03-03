// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { XApiKey } = require('./apiKeys.json');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Send qr code rotuing to link provided')
        .addStringOption(option => option
            .setName('url')
            .setDescription('The url to be stored in the QRCode')
            .setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {

            const response = await axios.get('https://api.api-ninjas.com/v1/qrcode?data=' + interaction.options.getString('url') + '&formats=png', {
                headers: {
                    'X-Api-Key': XApiKey,
                    'Accept': 'image/png',
                }, stream: true,
                responseType: 'arraybuffer',
            });
            const attachment = new AttachmentBuilder(response.data, { name: 'qrcode.png' });
            await interaction.reply({ files: [attachment] });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while trying to generate the QR Code', ephemeral: true });
        }
    },
};