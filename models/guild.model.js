const { model, Schema } = require('mongoose');
const guildSchema = new Schema({
    name: {
        type: String,
        required: [true, 'No Server name provided'],
    },
    serverID: {
        type: Number,
        required: [true, 'No Server ID provided'],
    },
    memberCount: {
        type: Number,
        required: [true, 'No member count provided'],
    },
});

module.exports = new model('Guild', guildSchema);
