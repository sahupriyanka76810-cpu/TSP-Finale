const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");


const app = express();
app.use(express.json())
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

;

const connectDB = require("./config/db");
connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});