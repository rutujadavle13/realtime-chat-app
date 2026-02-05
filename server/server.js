const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Correct static path
app.use(express.static(path.join(__dirname, "../client")));

// Uploads public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- File Upload ---------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    fileUrl: `http://localhost:3000/uploads/${req.file.filename}`,
  });
});

/* ---------- Server & Socket ---------- */

const server = http.createServer(app);
const io = socketio(server);

const socketHandler = require("./socket");
socketHandler(io);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

server.listen(3000, () =>
  console.log("MongoDB Connected\nServer running on 3000"),
);
