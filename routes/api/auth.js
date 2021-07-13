const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

/**
  @route    GET  api/auth
  @desc     Test route
  @access   Public  
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //Return everything except password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
  @route    POST  api/auth
  @desc     Authenticate user and get token
  @access   Public  
 */
router.post(
  "/",
  [
    //Express validator for inputs
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],

  async (req, res) => {
    //Check input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //See if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //Make sure that passwords match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //Create a payload which includes user's mongoDB id
      const payload = {
        user: {
          id: user.id,
        },
      };

      //Sign the token
      jwt.sign(
        payload, //Include the payload
        config.get("jwtSecret"), //Pass in the secret
        { expiresIn: 36000000000000000 }, //Set expiration
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
