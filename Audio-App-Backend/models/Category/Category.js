const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   uri: String,
});

module.exports = Category = mongoose.model('Category', categorySchema);
