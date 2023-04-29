const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
let records = [];

//Get all students
router.get("/", (req, res) => {
  res.send("App is running..");
});

//Create new record
router.post("/add", (req, res) => {
  res.send("New record added.");
});

//delete existing record
router.delete("/", (req, res) => {
  res.send("Deleted existing record");
});

//updating existing record
router.put("/", (req, res) => {
  res.send("Updating existing record");
});

//showing demo records
router.get("/demo", (req, res) => {
  res.json([]);
});
router.get("/email", (req, res) => {
  const { name, email, number, message } = req.query;

  if (name && email && number && message) {
    const from = "karthik-interior-decorators@outlook.com";
    const passwd = "karthik_2428";

    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secureConnection: false,
      auth: {
        user: from,
        pass: passwd,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // Load the HTML email template from the public folder
    const templatePath = path.join(__dirname, "public", "email-template.html");
    const emailTemplate = require("fs").readFileSync(templatePath, "utf-8");

    // Replace template placeholders with actual values
    let html = emailTemplate.replace("%NAME%", name);
    html = html.replace("%EMAIL%", email);
    html = html.replace("%NUMBER%", number);
    html = html.replace("%MESSAGE%", message);

    let mailOptions = {
      from: from,
      to: from,
      subject: "Client request from the website",
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Message sent: %s", info.messageId);
        res.status(200).send("Email sent successfully");
      }
    });
  } else {
    res.status(200).send("Please Enter the parameter values");
  }
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
