const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 10,
    maxLength: 265,
    trim: true,
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
