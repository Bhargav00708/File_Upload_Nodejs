const path = require("path");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ip = require("ip");

const app = express();

// This middleware is used to enable Cross Origin Resource Sharing This sets Headers to allow access to our client application
app.use(cors());
app.use(express.static('public'))
// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

// Route To Load Index.html page to browser
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

// Single File Route Handler
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  res.send({"name":req.file.originalname,"type":req.file.mimetype,"size":req.file.size});
});

// Multiple Files Route Handler
app.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send("Multiple Files Upload Success");
});

const listen = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on http://${ip.address()}:${listen.address().port}`)
})