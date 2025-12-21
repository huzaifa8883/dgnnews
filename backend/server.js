const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
require("dotenv").config();
const postRoutes = require("./routes/posts");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: "https://dgnnews.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- DATABASE CONNECTION ----------
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

// ---------- CLOUDINARY CONFIG ----------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------- MULTER MEMORY STORAGE ----------
const upload = multer({ storage: multer.memoryStorage() });

// ---------- ROUTES ----------
app.use("/posts", postRoutes);

// Upload route using Cloudinary
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "news_images" }, // folder in Cloudinary
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        res.json({ url: result.secure_url }); // Cloudinary URL
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

