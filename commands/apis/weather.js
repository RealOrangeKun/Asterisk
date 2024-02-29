const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Replies with the weather information for the specified city')
        .addStringOption(option => option
            .setName('city')
            .setDescription('City to get weather for')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Getting Weather Data...', fetchReply: true, ephemeral: false });
        const city = interaction.options.getString('city').toLowerCase();
        const locationCodeAPI = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=96tQ0vPbj0Wz1Wttb1j2d6maz8V7HPif&q=${city}`;
        try {
            const locationData = await axios.get(locationCodeAPI);
            const locationKey = locationData.data[0].Key;
            const weatherAPI = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=96tQ0vPbj0Wz1Wttb1j2d6maz8V7HPif&language=en-us&details=false&metric=true`;

            const weatherData = await axios.get(weatherAPI);
            const minimumTemp = weatherData.data.DailyForecasts[0].Temperature.Minimum.Value;
            const maxTemp = weatherData.data.DailyForecasts[0].Temperature.Maximum.Value;
            const userTimezone = interaction.member.user.timezone || 'UTC';
            const currentTime = moment().tz(userTimezone);
            const timeOfDay = currentTime.hours() >= 0 && currentTime.hours() < 12 ? 'morning' : 'night';
            const url = timeOfDay === 'morning' ? 'https://cdn-icons-png.flaticon.com/512/869/869869.png' : 'https://cdn-icons-png.flaticon.com/512/1823/1823324.png';
            const weatherInfo = new EmbedBuilder()
                .setTitle(`Weather for ${city.charAt(0).toUpperCase() + city.substr(1).toLowerCase()}`)
                .addFields(
                    { name: 'Maximum Temperature', value: `${maxTemp}°C`, inline: true },
                    { name: 'Minimum Temperature', value: `${minimumTemp}°C`, inline: true },
                )
                .setFooter({ text: 'Powered by AccuWeather' })
                .setThumbnail(url);
            await interaction.editReply({ content: '', embeds: [weatherInfo], ephemeral: false });
        }
        catch (error) {
            console.error('Error fetching weather data:', error.response.data.Message);
            await interaction.editReply({ content: 'Error fetching weather data.', ephemeral: true });
        }
    },
};