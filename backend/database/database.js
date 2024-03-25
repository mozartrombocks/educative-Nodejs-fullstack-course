const mongoose = require("mongoose");

const { MONGO_URI } = process.env; 

exports.connect = () => {
	mongoose	.connect(MONGO_URI)
    			.then(() => { 
			 	console.log("Connected to MongoDB"); 
    			}) 
    			.catch((error) => {
				console.log("Failed to connect to database, terminating application");
    				console.error(error);
    				process.exit(1);
    			});
}; 

