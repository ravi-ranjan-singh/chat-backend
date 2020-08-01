const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    contentType: { type: String },//can be video or image
    date: { type: Date, default: Date.now },
    time: { type: Date, default: new Date().toLocaleTimeString() },
    caption: { type: String, maxlength: 60, minlength: 0 },
    contentUrl: { type: String },
    writer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1m' },
        required: true
    }




})

const Story = mongoose.model('story', storySchema);

module.exports = Story;
