require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const expressfu = require("express-fileupload");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const authRoute = require("./Routes/auth");

const conn_uri = process.env.MONGO_URI;

const app = express();

app.use(express.static("public"));
app.use(express.json());
// app.use(
//   expressfu({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true })
// );
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true,}));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(conn_uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => {
    console.log("Connected to DB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);

const Student = require("./Models/users")
const Teacher = require("./Models/teacher")
const {Test,testSchema} = require("./Models/test")
const {Answer,answerSchema} = require("./Models/answer")


passport.use('st-local',Student.createStrategy());
passport.use('t-local',Teacher.createStrategy());


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Student.findById(id, function (err, user) {
    done(err, user);
  });
});


// ROUTES

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/api/auth", authRoute);

app.get("/uploadFile", (req, res) => {
  res.render("uploadFile", { title: "Test Window" });
});

app.get('/teachReg', (req, res) => {
  res.render('teachReg', { title: 'Teacher Sign Up' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get("/register", function (req, res) {
  res.render("register",{title:"Student Register"});
});


// const moment = require('moment');

app.get("/studentDashboard", function (req, res) {
  Test.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('studentDash', { tests: result, title: 'Student Dashboard' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/test",(req,res)=>{
console.log(req.body);
res.send("bub");
});