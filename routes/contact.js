
var express = require('express');
var nodemailer = require('nodemailer');
function sendMail(to, subject, html) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_EMAIL
        }
      });
  
      var mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: html
      };
  
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, error => {
          if (error) {
            reject(error);
          }
          resolve("ok");
        });
      })
  }
module.exports = sendMail;
