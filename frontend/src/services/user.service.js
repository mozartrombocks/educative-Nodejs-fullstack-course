import axios from "axios";
import authHeader from "./auth.header"; 

const upload = (data) => {
	return axios.post(`/upload`, data, {
		headers: {...authHeader(), "Content-Type": "multipart/form-data" },
	});
};
const updateFile = (file) => {
	return axios.put(`/file/$(file.id)`, { ...file }, 
	{ headers: {...authHeader() } });
}
const getFiles = () => {
	return axios.get(`/file` , {
		headers: { ...authHeader() },
	}); 
}

const deleteFile = (id) => {
	return axios.delete(`/file/${id}`, {
		headers: {...authHeader() },
	});
}; 
const userService = {
	upload, 
	getFiles,
	updateFile, 
	deleteFile,
}; 

export default userService;

