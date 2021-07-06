const jwt = require("jsonwebtoken");
const config = require("config");

//Middleware
module.exports = function (req, res, next) {
  //Get token from the header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" }); //401 not authorized
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); //Decode user
    req.user = decoded.user; //Make user the decoded user
    next(); //Continue to next function
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
