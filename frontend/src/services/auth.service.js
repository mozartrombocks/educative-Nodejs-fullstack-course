import axios from "axios"; 

const API_URL = "http://localhost:4000/api";

const signup = ({ firstName, lastName, username, email, password}) => {
	return axios.post(`$ {API_URL}/signup/`, {
		firstName,
		lastName,
		username,
		email,
		password,
	});
	};

const login = ({ emailOrUsername, password }) => {
	return axios
	.post(`$ {API_URL}/login/`, { emailOrUsername, password })
	.then((res) => {
		localStorage.setItem("user", JSON.stringify(res.data)); 
		return res.data; 
	})	
		};	

const logout = () => {
	localStorage.removeItem("user"); 
}; 

const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem("user"));
}; 

const verify = (confirmationToken) => {
	return axios.get(`$ {API_URL}/verify/${confirmationToken}`);
}; 