const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");


const sendMail = asyncHandler( async (data, req, res) => {
	let transporter = nodemailer.createTransport({
		name: 'example.com',
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		requireTLS: true,
		auth: {
			user: process.env.MAIL_ID,
			pass: process.env.MAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false
		 }
	});
	let info = await transporter.sendMail({
		from: "Elevate Platforms",
		to: data.to,
		subject: data.subject,
		text: data.text,
		html: data.html
	});
	
	console.log("Message Sent: ", info.messageId);
	console.log("Preview Url: ", nodemailer.getTestMessageUrl(info));
});

module.exports = sendMail;