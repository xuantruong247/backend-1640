 const nodeMailer = require('nodemailer')

 const adminEmail = 'mailadmin@gmail.com'
 const adminPassword = 'admin123gmail'
 const mailHost = 'smtp.gmail.com'
 const mailPort = 587

 const sendMail = (mail) => {

   const transporter = nodeMailer.createTransport({
     host: mailHost,
     port: mailPort,
     secure: false,
     auth: {
       user: adminEmail,
       pass: adminPassword
     }
   })
 
   const options = {
     from: adminEmail,
     to: mail.to, 
     subject: mail.subject, 
     text: mail.text 
   }
 
   return transporter.sendMail(options, (err) => {
       if(err) console.log(err)
   })
 }
 
 module.exports = {
   sendMail: sendMail
 }