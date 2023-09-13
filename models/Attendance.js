// attendanceSchema.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class: { type: String, required: true },
  date: { type: Date, required: true },
  absentNames: { type: [String], required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
