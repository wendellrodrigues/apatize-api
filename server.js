const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Request Received at /");
  res.json({ response: "Response" });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
