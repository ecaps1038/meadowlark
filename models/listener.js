var mongoose = require('../lib/db.js');
var listenerSchema = mongoose.Schema({
	email: String,
	skus: [String]
});
var Listener = mongoose.model('Listener', listenerSchema);
module.exports = Listener;