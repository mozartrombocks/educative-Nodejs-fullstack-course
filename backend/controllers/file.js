const { File, validate } = require("../models/file");
const fs = require("fs");
const readline = require("readline");
const SpellChecker = require("spellchecker");
const stringSimilarity = require("string-similarity"); 
const BASE_URL = "https://api.edamam.com/search?q=";
const sharp = require("sharp");
const spellCheck = (path) => {
	const readInterface = readline.createInterface({
		input: fs.createReadStream(path),
		output: process.stdout, 
		console: false, 
	});

	let text = "";

	for await (const line of readInterface) {
	     const correctedLine = line
		.split(" ")
		.map((word) => {
			if (!SpellChecker.spellCheck(word)) {
				const suggestions = SpellChecker.getSuggestions(word);
				const matches = stringSimilarity.findBestMatch(word, suggestions);
				return matches.bestMatch.target; 
			} else return word; 
		})
		.join(""); 
	      text += correctedLine + "\n"; 
	};

	readInterface.on("line", function (line)  {
	    const correctedLine = line
		.split(" ")
		.map((word) => {
			if (!SpellChecker.spellCheck(word)) {
				const suggestions = SpellChecker.getSuggestions(word); 
				console.log(suggestions); 
			}
			return word; 
		})
		 .join(" ");
            
	     text += correctedLine + "\n";
	
	});
};

const processImage = async (path) => {
	try {
		const imgProcessing = sharp(path); 
		const metadata = await imgProcessing.metadata();
		console.log(metadata); 

		const newPath = path.split(".")[0] + "-img.png";
		imgInstance
		.resize({
			width: 350,
		 	fit: sharp.fit.contain,
		})
		.toFormat("jpeg", { mozjpeg: true})
		.blur(1)
		.composite([{ input: "uploads/logo.png", gravity: "center" }])
		.toFile(newPath);
		
		return newPath;
	}
	 catch (e) {
		console.log(
		`An error occurred during processing the uploaded image: ${error}`
		); 
	}

}; 


exports.upload = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, description } = req.body;
    let path = req.file.path;

    if (req.file.mimetype === "text/plain") {
      await spellCheck(req.file.path);
      path = `${req.file.path}.txt`;
    }

    const file1 = await File.create({
      name,
      createdBy: req.user.user._id,
      description,
      createdAt: Date.now(),
      filepath: BASE_URL + "/" + path,
    });

    res.status(200).json({ message: "File uploaded successfully", data: file1 });

    if (req.file.mimetype.match(/^image/)) {
      path = await processImage(req.file.path);
    }
    const file2 = await File.create({
      name,
      createdBy: req.user.user._id,
      description,
      createdAt: Date.now(),
      filepath: BASE_URL + "/" + path,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

exports.getAll = async (req, res) => {
	try {
		const { createdBy } = req.params; 

		const allFiles = await File.find({ createdBy: createdBy }); 
		res
		.status(200)
		.json({ message : "Files fetched successfully", data : allFiles });
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
};

exports.getFile = async (req, res) => {
	try {
		const { createdBy, fileId } = req.params;
		const files = await File.findOne({ _id: fileId, createdBy: createdBy });
		if (!files) {
			return res.status(404).send("File not found");
		}
		res.status(200)
		.json({ message: "File fetched successfully", data: file });
	} catch (err) {
		console.log(err);
		res.status(500).send(err.message);
	}
};

exports.searchFile = async (req, res) => {
	try { 
		const filter = {}; 
		
		if (req.query.name) filter.name = /req.query.name/; 
		if (req.query.description) filter.description = /req.query.description/;
		if (req.query.createdAt) filter.createdBy = req.query.createdAt; 

		const files = await File.find(filter);
		res.status(200).json({ message: "Files fetched successfully", data: files });
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
};

exports.updateFile = async (req, res) => {
	try {
		const { _id } = req.params;
		const { name, description } = req.body;

		if (!name && !description) {
			return res.status(400).send("Please provide name or description");
		}

		const result = await File.validateAsync({ name, description });
		const file = await File.findOne({
			_id, 
		});
		
		if (!file){
			return res.status(404).send("File not found");
		}

		const updatedFile = await File.update(
			{
				_id,
			}, 
			{
				$set: result, 
			}, 
			{ upsert: true }
		); 

		res
			.status(200)
			.json({ message: `File updated successfully`, data: updatedFile });
	} catch (err) {
		console.log(err);
		res.status(500).send(err.message);
	}
};

exports.deleteFile = async (req, res) => {
	try {
		const { _id } = req.params;
		const file = await File.findOne({ _id });
		if (!file) {
			return res.status(404).send("File not found");
		}
		await file.remove({
			_id,
		});
		res.status(200).json({ message: "File deleted successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).send(err.message);
	}
};




