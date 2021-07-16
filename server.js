const express = require("express");
const expressEJs = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");

const app = express();

//set ejs layout
app.use(expressEJs);

//setting viewengine
app.set("view engine", "ejs");

//setup static
app.use(express.static(__dirname + "/assests"));

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// routes
app.get("/", (req, res) => {
	res.render("index");
});

// url
app.get("/getVideo", async (req, res) => {
	const { url } = req.query;

	if (url === "") {
		return res.status(404).json({ message: "please fill in all fields" });
	}

	const info = await ytdl.getInfo(url);

	res.status(200).json(info);
});

// download video
app.get("/downloadVideo", (req, res) => {
	const { videoURL, itag, format } = req.query;
	res.header(
		"Content-Disposition",
		'attachment; filename="video.' + format + '"'
	);
	ytdl(videoURL, {
		filter: (format) => format.itag == itag,
	}).pipe(res);
});

// port and server listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server is running on port %d", PORT));
