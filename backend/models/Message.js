const mongoose = require('mongoose');

// function ltrim(str) {
//   if (!str) return str;
//   return str.replace(/^\s+/g, '');
// }

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 1,
    maxLength: 100000,
    trim: true,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
