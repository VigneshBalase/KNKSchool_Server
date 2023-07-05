// routes/excelData.js

const express = require('express');
const router = express.Router();
const ExcelData = require('../models/Studentdata');

// Route to save Excel data to MongoDB
router.post('/', (req, res) => {
  const data = req.body;

  // Save the data to MongoDB
  ExcelData.create(data)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.error('Error saving Excel data:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
