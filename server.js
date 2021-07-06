const express = require("express");
const connectDB = require("./config/db");

//Initilize app
const app = express();

//Connect Database
connectDB();

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

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
