const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send({
			auth: false,
			message: "No token provided.",
		});
	}
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
		req.user = decoded;

	} catch (err) {
		return res.status(401).send({
			auth: false,
			message: "Failed to authenticate token.",
		});
	}

	return next(); 

}; 

module.exports = verify;