require("dotenv").config(); 
require("./database/database.js").connect();
const express = require("express");
const router = require("./routes/index");
const app = express(); 
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const favicon =  require("express-favicon");
const path = require("path");

app.use("/api", router); 
app.get("/", (req, res) => {
	res.send("Hell-O Varld.");
});
 
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(favicon(__dirname + "/frontend/build/favicon.ico"));
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.use(favicon(__dirname + "/frontend/build/favicon.ico"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
}); 

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
}); 

