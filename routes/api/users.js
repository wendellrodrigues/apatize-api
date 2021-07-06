const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

/**
  @route    POST  api/users
  @desc     Register user
  @access   Public  
 */
router.post(
  "/",
  [
    //Express validator for inputs
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    //Check input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email account already in use" }] });
      }

      //Create new user
      user = new User({
        name,
        email,
        password,
      });

      //Encrypt password and save to db
      const salt = await bcrypt.genSalt(10); //Creates salt
      user.password = await bcrypt.hash(password, salt); //Hash it
      await user.save(); //Save to db

      //Create a payload which includes user's mongoDB id
      const payload = {
        user: {
          id: user.id,
        },
      };

      //Sign the payload
      jwt.sign(
        payload, //Include the payload
        config.get("jwtSecret"), //Pass in the secret
        { expiresIn: 360000 }, //Set expiration
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
