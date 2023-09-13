const mongoose = require('mongoose');

// Create a schema for the student data
const studentSchema = new mongoose.Schema({
  CLASS_NUMBER: {
    type: String,
    required: true,
},

  ADMISSION_NUMBER: { 
    type: String, 
    required: true 
  },
  Student_Name:{
     type: String, 
     required: true 
    },
  Father_Name: { 
    type: String, 
    required: true 
  },
  Mother_name: { 
    type: String,  
  },
  Date_of_Birth: { 
    type: String, 
    required: true 
  },
  Mobile_No: { 
    type: String, 
    required: true 
  },
  Email_id: {
    type: String,
    required: true
  },
});

// Create a model based on the schema
const ClassDataModel  = mongoose.model('classdata', studentSchema);

module.exports = ClassDataModel ;
