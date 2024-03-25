const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcyrpt"); 
const { encrypt, decrypt } = require("../utils/confirmation");
const nodemailer = require('nodemailer')
const  { google } = require('googleapis')
const  OAuth2 = google.auth. OAuth2;

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		"{{OAUTH_CLIENT_ID}}", 
		"{{OAUTH_CLIENT_SECRET}}",
		"https://developers.google.com/oauthplayground"
	);
	oauth2Client.setCredentials({
		refresh_token: "{{OAUTH_REFRESH_TOKEN}}", 
	});

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});

	const Transport = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user:  "{{GMAIL_ADDRESS}}",
			accessToken,
			clientId: "{{OAUTH_CLIENT_ID}}",
			clientSecret: "{{OAUTH_CLIENT_SECRET}}",
			refreshToken: "{{OAUTH_REFRESH_TOKEN}}",
		}, 
		}); 

	return Transport;
}; 

const sendEmail = async ({ email, username, res }) => {
	const confirmationToken = encrypt(email);
	 

	const Transport = await createTransporter({
		service : "Gmail", 
		auth : {
			user: process.env.GMAIL_EMAIL, 
			pass: process.env.GMAIL_PASSWORD,
		}, 
	});

	const mailOptions = {
		from: "Educative FullStack Course",
		to: email,
		subject: "Email Confirmation",
		html: `Please click on the following link to confirm your email address: <a href=http://localhost:4000/verify/${confirmationToken}>Verification Link</a>`,
	};

	Transport.sendMail(mailOptions, function (error, response) {
		if (error) {
			res.status(400).send(error); 
		} else {
			res.status(200).json({
				message: "Email sent successfully",
				email,
			}); 
		}
		 
	});
	}; 


exports.signup = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const { firstName, lastName, username, email, password } = req.body;

		const oldUser = await User.findOne({email});
		if (oldUser) {
			return res.status(409).send("User already exists with given email");
		}

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(password, salt);

		let user = await User.create({
			firstName,
			lastName,
			email: email.toLowerCase(), 
			username,
			password: hashedPassword
		});

		const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, 
			{
				expiresIn: "2h", 
			}
		);
		user.token = token; 

		res.status(201).json(user); 
	}  catch (err) {
		console.error(err); 

	}
}; 

exports,verifyEmail = async (req, res) => {
	try {
		const { confirmationToken } = req.params;
		const username = decrypt(confirmationToken);

		const user = await User.findOne({ username: username });
		if (user) {
			user.isConfirmed = true;
			await user.save();
			res.status(201).json({
				message: "Email verified successfully",
				data: user }); 
			} else {
				return res.status(409).send("User not found");
			}
			
		} catch (err) {
			console.error(err); 
			return res.status(400).send("Internal server error");
		}

	}; 

exports.login = async (req, res) => {
	try {
		const { emailOrUsername, password } = req.body;

		if (!(emailOrUsername && password)) {
			res.status(400).send("Please provide email and password");
	}

	let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const data = regexEmail.test(emailOrUsername)
	? {
		email: emailOrUsername, 

	} :
	{
		username: emailOrUsername, 
	};

	const user = await User.findOne(data);

	if (user && (await bcrypt.compare(password, user.password))) {
		const email = user.email;
		const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '7d', }); 
		user.token = token;
		res.status(200).json(user); 
	} res.statuss(400).send("Invalid email or password");
	} catch (err) {
		console.error(err);
		res.status(400).send("Internal server error");
	}
};
