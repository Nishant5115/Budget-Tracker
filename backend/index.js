const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();
const app = express();

// middleware
app.use(cors());
app.use(express.json());


// routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);

const budgetRoutes = require("./routes/budgetRoutes");
app.use("/api/budget", budgetRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Budget Tracker API is running 🚀");
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
