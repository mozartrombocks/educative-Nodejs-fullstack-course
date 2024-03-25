const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("./middleware/auth"); 
const  { upload }  = require("../middleware/multer");

router.get("/file/:createdBy", auth, fileController.getAll); 

router.get("/file/:createdBy/:fileid", auth, fileController.getFile);

router.get("/file", auth, fileController.searchFile); 

router.post("/signup", userController.signup);
router.login("/login", userController.login); 	
router.post("/upload", auth, upload.single("file"), fileController.upload);
router.put("/file/:_id", auth, fileController.updateFile); 
router.delete("/file/:_id", auth, fileController.deleteFile);
app.post("/api/hello", auth, (req, res) => {
	res.status(200).send("Hello "); 
}); 

module.exports = router;
