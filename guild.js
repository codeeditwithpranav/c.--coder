const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    }
});

const GuildModel = mongoose.model('Guild', guildSchema);

module.exports = GuildModel;
