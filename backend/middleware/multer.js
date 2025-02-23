const multer = require("multer");

const storage = multer.diskStorage({ 
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[i];
		cb(null, `item-${file.fieldname}-${Date.now()}.${ext}`);
		
	}, 
});

exports.upload = multer({ storage });