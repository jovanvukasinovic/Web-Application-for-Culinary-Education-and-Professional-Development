import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "./api/routers/user.routes";

const app = express();
const port = 4000;
const db = "proChefDB";

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/users", userRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
mongoose.connect(`mongodb://localhost:27017/${db}`);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connected!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
