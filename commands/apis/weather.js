const axios = require('axios');
// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction } = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
const { weatherKey } = require('./apiKeys.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Replies with the weather information for the specified city')
        .addStringOption(option => option
            .setName('city')
            .setDescription('City to get weather for')
            .setRequired(true)),
    /**
*
* @param {ChatInputCommandInteraction} interaction
*/
    async execute(interaction) {
        await interaction.reply({ content: 'Getting Weather Data...', fetchReply: true, ephemeral: false });
        const city = interaction.options.getString('city').toLowerCase();
        try {
            const locationData = await axios.get('https://ai-weather-by-meteosource.p.rapidapi.com/find_places', {
                params: {
                    text: String(city),
                    language: 'en',
                }, headers: {
                    'X-RapidAPI-Key': weatherKey,
                    'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com',
                },
            });
            const placeId = String(locationData.data[0].place_id), timezone = String(locationData.data[0].timezone), country = String(locationData.data[0].country);
            const weatherData = await axios.get('https://ai-weather-by-meteosource.p.rapidapi.com/current', {
                params: {
                    place_id: placeId,
                    timezone: timezone,
                    language: 'en',
                    units: 'metric',
                }, headers: {
                    'X-RapidAPI-Key': weatherKey,
                    'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com',
                },
            });
            const temp = weatherData.data.current.temperature, feelsLike = weatherData.data.current.feels_like, uvIndex = weatherData.data.current.uv_index;
            const currentTime = moment().tz(String(timezone));
            const timeOfDay = currentTime.hours() >= 0 && currentTime.hours() < 12 ? 'morning' : 'night';
            const url = timeOfDay === 'morning' ? 'https://cdn-icons-png.flaticon.com/512/869/869869.png' : 'https://cdn-icons-png.flaticon.com/512/1823/1823324.png';
            const weatherInfo = new EmbedBuilder()
                .setTitle(`Weather for ${city.charAt(0).toUpperCase() + city.substr(1).toLowerCase()}`)
                .addFields(
                    { name: 'Country', value: country, inline: true },
                    { name: 'Current Temperature', value: `${temp} °C`, inline: true },
                    { name: 'Feels Like', value: `${feelsLike} °C`, inline: true },
                    { name: 'UV Index', value: String(uvIndex), inline: true },
                    { name: 'Timezone', value: timezone, inline: true },
                )
                .setFooter({ text: 'Powered by Meteosource' })
                .setThumbnail(url);
            await interaction.editReply({ content: '', embeds: [weatherInfo], ephemeral: false });
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.editReply({ content: 'Error fetching weather data.' });
            setTimeout(async () => {
                await interaction.deleteReply();
            }, 1500);
        }
    },
};