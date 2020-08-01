const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    //  required: true,
    trim: true,
  },
  time: {
    type: String,
    default: new Date().toLocaleTimeString(),
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [
      {
        type: Number,
        required: false,
      },
    ],
  },
  description: {
    //required: true,
    type: String,
    trim: true,
  },
  file: {
    Ftype: String,
    name: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: [String],
  eventType: {
    type: String,
    //required: true,
    enum: [
      'LOST & FOUND',
      'BUY & SALE',
      'EVENTS',
      'ACTIVITY',
      'NEWS',
      'OPPORTUNITY',
      'MISCELLANEOUS',
    ],
  },
  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
    diff: { type: Number, default: 0 },
  },
  creator: {
    type: String,
    //required: true,
    trim: true,
  },
  comments: [{
    comment: { type: String, required: true, trim: true },

    date: { type: Date, default: Date.now },

    writer: {
      writer_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      name: { type: String, required: true }
    },

    edited: { type: Boolean, default: false },

    editedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }]
  }],
  isReply: { type: Boolean, required: true, default: false }
});

activitySchema.index({ location: '2dsphere' });

const Activity = mongoose.model('activity', activitySchema);

module.exports = Activity;
