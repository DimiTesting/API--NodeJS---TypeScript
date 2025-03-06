import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5c3e69a2962f25",
    pass: "01e06461991a57",
  },
});


const sendEmail = async function(userEmail: string, link: string) {

  const info = await transporter.sendMail({
    from: 'dimitesting31@gmail.com',
    to: userEmail, // list of receivers
    subject: "Restore password via link", // Subject line
    text: `${link}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendEmail