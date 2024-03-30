const express = require("express");
const cors = require("cors");
const app = express();

const movieRoutes = require("./routes/movieRoutes");
const searchRoutes = require("./routes/searchRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET, POST, PUT, DELETE, OPTIONS, HEAD"],
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(express.json());

// authentication
app.use(authRoutes);

// routes
app.use(movieRoutes);
app.use(searchRoutes);

// Handle non matching request from the client
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(5000);
