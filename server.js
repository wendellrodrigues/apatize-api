const express = require("express");
const connectDB = require("./config/db");

//Initilize app
const app = express();

//Connect Database
connectDB();

//Use Env Variables
require("dotenv").config();

//Initialize Middleware
app.use(express.json({ extended: false }));

//Port is either env variable or defaults to 3000
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Request Received at /");
  res.json({ response: "Response" });
});

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/food", require("./routes/api/food"));

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
