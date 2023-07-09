const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require("dotenv").config();

var bodyParser = require('body-parser')

app.use(cors());
// const { count } = require('./models/Users');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));




mongoose.connect(
    "mongodb+srv://dbadmin:knk2121@cluster0.aifbbb9.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);



app.get("/hello", async (req,res) => {

    
  res.send("sample hello");

  
})

let port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log("App is running on port " + port);
});