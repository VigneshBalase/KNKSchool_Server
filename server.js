const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
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
const AttendanceModel = require('./models/Attendance')
const UsermailModel = require('./models/Usermail');
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




  // Mailer Configuration
const mailConfig = {
  service: 'gmail',
  auth: {
    user: 'mailerwhatsapp@gmail.com', // Replace with your email address
    pass: 'whcvsdkaalannquu' // Replace with your generated password
  }
};


const transporter = nodemailer.createTransport(mailConfig);


app.post('/mailsent', async (req, res) => {
  const { emailId } = req.body;
  console.log(emailId);

  if (!emailId) {
    return res.status(400).send('Email ID is missing in the request body');
  }

  var randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  console.log(randomNum); // Print the generated OTP

  const mailDetails = {
    from: 'vigneshbalase1999@gmail.com', // Replace with the sender's email address
    to: emailId, // Replace with the recipient's email address
    subject: 'Your OTP for Login',
    html: `<p>Dear User,</p>
    <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
    <h2><strong>${randomNum}</strong></h2>
    <p>Please use this OTP within the specified time limit to complete your authentication or transaction. Do not share this OTP with anyone, as it is valid for a single use only.</p>
    <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
    <p>Thank you,</p>
    <p>KNK GIRLS HIGH SCHOOL</p>`
  };

  
    // Send email
    try {
      await transporter.sendMail(mailDetails);
  
      const mailuser = new UsermailModel({ emailId: emailId, randomNum: randomNum });
      await mailuser.save();
  
      res.status(200).json({ success: true, randomNum: randomNum });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Something went wrong while sending the email' });
    }
  });



  app.post('/otpreceive',async(req,res) => {
  
    const emailId = req.body.emailId;
    const randomNum = req.body.randomNum;
  
    if (emailId && randomNum) {
      
    const users = await UsermailModel.find({ emailId: emailId, randomNum: randomNum });
  
    if (users.length > 0) {
      res.sendStatus(200);
  
    } else {
      res.sendStatus(404);
  
      
    }
    } 
    });
  




  

app.get("/teacher/classdata/read", async (req, res) => {
  try {
    const result = await ClassDataModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.get("/teacher/classdata/classnumber/read", async (req, res) => {
  try {
    const { classNumber } = req.query; // Get the classNumber from the query parameters

    // Make sure the classNumber is provided in the request
    if (!classNumber) {
      return res.status(400).json({ error: "Class number is missing in the request parameters." });
    }

    const result = await ClassDataModel.find({ CLASS_NUMBER: classNumber }); // Fetch data for the given classNumber

    // Create an array to store the Student_Names
    const studentNamesArray = [];

    // Iterate through the result and extract Student_Name
    result.forEach((data) => {
      if (data.Student_Name) {
        studentNamesArray.push(data.Student_Name);
      }
    });

    // Find the index of "Student_Name" in the array and remove it
    const index = studentNamesArray.indexOf("Student_Name");
    if (index > -1) {
      studentNamesArray.splice(index, 1);
    }

    res.json(studentNamesArray);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});


// GET request to fetch student names for the selected class
app.get('/teacher/classdata/classnumber/read', async (req, res) => {
  try {
    const { classNumber } = req.query;
    const foundClass = await Class.findOne({ classNumber });

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const studentNames = foundClass.students.map((student) => ({ name: student.name }));
    res.json(studentNames);
  } catch (err) {
    console.error('Error fetching student names:', err);
    res.status(500).json({ error: 'Internal server error' });
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




app.get("/teacher/attendanceupdate/read", async (req, res) => {
  try {
    const result = await AttendanceModel.find({});
    res.json(result);
    console.log(result);
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
        Email_id,
      } = row;

      const student = new ClassDataModel({
        CLASS_NUMBER,
        ADMISSION_NUMBER,
        Student_Name,
        Father_Name,
        Mother_name,
        Date_of_Birth,
        Mobile_No,
        Email_id,
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

app.post("/teacher/attendanceupdate/post", async(req, res) =>{
  console.log(req.body);
  const { date, absentNames, class: selectedClass } = req.body;

  try {
    const [day, month, year] = date.split('-');
    const validDate = new Date(`${year}-${month}-${day}`);
    // Create a new document and save it to the "Attendance" collection
    const newAttendance = new AttendanceModel({
      class: selectedClass,
      date: validDate,
      absentNames,
    });

    await newAttendance.save();

    console.log('Attendance updated and stored in the database:', newAttendance);
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance and storing in the database:', error);
    res.status(500).json({ error: 'Error updating attendance' });
  }
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

    await newTimetable.save();

    console.log("saved");
    res.send('Success');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create timetable entry' });
  }
});



app.post('/teacher/marksdata/post', async (req, res) => {
  try {
    const { class: classNumber, marksData } = req.body;
    const foundClass = await Class.findOne({ classNumber });

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    marksData.forEach(({ name, marks, testType }) => {
      const studentIndex = foundClass.students.findIndex((student) => student.name === name);

      if (studentIndex !== -1) {
        foundClass.students[studentIndex].marks = marks;
        foundClass.students[studentIndex].testType = testType;
      }
    });

    await foundClass.save();
    res.json({ message: 'Marks data updated successfully' });
  } catch (err) {
    console.error('Error updating marks data:', err);
    res.status(500).json({ error: 'Internal server error' });
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
