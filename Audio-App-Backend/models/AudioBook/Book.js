const mongoose = require('mongoose');

const AudioBookSchema = mongoose.Schema({
  title: String,
  duration: String,
  publication: String,
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  }],
  textContent: String,
  audioContent: Buffer,
  cover: String,
  language: String,
});

module.exports = Audiobook = mongoose.model('Audiobook', AudioBookSchema);

