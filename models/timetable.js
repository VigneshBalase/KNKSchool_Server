const mongoose = require('mongoose')


const TimetableSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    classname: {
        type: String,
        required: true,
    },
    week: { 
        type: String,
        required: true,
    },
    fromtime: { 
        type: String,
        required: true,
    },
    totime: { 
        type: String,
        required: true,
    },
});

const TimeTableModel = mongoose.model('Timetable', TimetableSchema);

module.exports = TimeTableModel;