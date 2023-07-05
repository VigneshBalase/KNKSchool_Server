// models/ExcelData.js

const mongoose = require('mongoose');

// Create a schema for the Excel data
const excelDataSchema = new mongoose.Schema({
  ADMISSION_NUMBER: { type: String },
  Student_Name: { type: String },
  Father_Name: { type: String },
  Mother_name: { type: String },
  Date_of_Birth: { type: String },
  Mobile_No: { type: String },
});

// Create a model based on the schema
const ExcelData = mongoose.model('ExcelData', excelDataSchema);

module.exports = ExcelData;
