var mongoose = require('mongoose');

var searchTermSchema = new mongoose.Schema({
  term: String,
  when: Date
});

module.exports = mongoose.model('SearchTerm', searchTermSchema);
