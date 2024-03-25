const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	firstName: { type: String, default: null }, 
	lastName: { type: String, default: null }, 
	userName: { type: String, default: true }, 
	email: { type: String, unique: true }, 
	password: { type: String }, 
	token: { type: String }, 
	isConfirmed: { type: Boolean, default: false },  
}); 

const User = mongoose.model("User", userSchema); 

const validate = (user) => {
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(), 
		userName: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(), 
	}); 
	return schema.validate(user); 
}; 

module.exports = { User, validate }; 