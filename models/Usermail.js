const mongoose = require('mongoose');

const UsermailSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  randomNum: { type: Number, required: true }
});

const UsermailModel = mongoose.model('Usermail', UsermailSchema);

module.exports = UsermailModel;
