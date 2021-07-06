const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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

      //Return jsonwebtoken
      return res.send("User Registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
