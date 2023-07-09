// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const excelDataRouter = require('./routes/Studentdatas');

const app = express();
const port = 8001;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://dbadmin:knk2121@cluster0.aifbbb9.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/excel-data', excelDataRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
