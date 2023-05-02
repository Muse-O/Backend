require("dotenv").config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MUSE_O_EMAIL_ID,
        pass: process.env.MUSE_O_EMAIL_KEY
    },
    tls: {
        rejectUnauthorized: false
    }
  });


  module.exports = {transport}