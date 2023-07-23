const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');

require("dotenv").config();

const bodyParser = require('body-parser');
const upload = multer({ dest: 'uploads/' });

app.use(cors());
const ClassDataModel = require('./models/Studentdata');
const BlogModel = require('./models/Blog');
const TimetableModel = require('./models/timetable');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

mongoose.connect(
  "mongodb+srv://dbadmin:knk2121@cluster0.aifbbb9.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed:', error);
  });


app.get("/teacher/classdata/read", async (req, res) => {
  try {
    const result = await ClassDataModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Teacher read blogs
app.get("/teacher/imageupload/read", async (req, res) => {
  try {
    const result = await BlogModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Teacher read timetable
app.get("/teacher/timetable/read", async (req, res) => {
  try {
    const result = await TimetableModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Teacher upload class data
app.post("/teacher/classdata/post", async (req, res) => {
  const classdata = req.body;
  console.log(req.body)

  if (!Array.isArray(classdata)) {
    return res.status(400).json({ message: 'Class data should be an array' });
  }

  try {
    for (const row of classdata) {
      const {
        CLASS_NUMBER,
        ADMISSION_NUMBER,
        Student_Name,
        Father_Name,
        Mother_name,
        Date_of_Birth,
        Mobile_No,
      } = row;

      const student = new ClassDataModel({
        CLASS_NUMBER,
        ADMISSION_NUMBER,
        Student_Name,
        Father_Name,
        Mother_name,
        Date_of_Birth,
        Mobile_No,
      });

      await student.save();
    }

    return res.status(200).json({ message: 'Student data saved successfully' });
  } catch (error) {
    console.error('Error saving student:', error);
    return res.status(500).json({ message: 'An error occurred while saving student data' });
  }
});


// Teacher upload blogs
app.post("/teacher/imageupload/post", async (req, res) => {
  const { name, baseimage, head, description } = req.body;

  const user = new BlogModel({ baseimage, head, description, name });
  await user.save();
  res.send('Success');
});

// Teacher upload timetable
app.post("/teacher/timetable/post", async (req, res) => {
  try {
    const { subject, classname, week, fromtime, totime } = req.body;

    if (!subject || !classname || !week || !fromtime || !totime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTimetable = new TimetableModel({
      subject,
      classname,
      week,
      fromtime,
      totime
    });
    console.log(request)

    await newTimetable.save();

    console.log("saved");
    res.send('Success');
  } catch (error) {
    res.status(501).json({ error: 'Failed to create timetable entry' });
  }
});

// Delete a blog by ID
app.delete("/teacher/imageupload/:id", async (req, res) => {
  try {
    const result = await BlogModel.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Delete a timetable entry
app.delete('/teacher/timetable/delete', (req, res) => {
  const { classname, week } = req.body;

  TimetableModel.deleteOne({ classname, week })
    .then(() => {
      res.status(200).send('Timetable entry deleted successfully');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete timetable entry' });
    });
});

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log("App is running on port " + port);
});
