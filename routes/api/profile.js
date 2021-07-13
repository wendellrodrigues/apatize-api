const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const calculators = require("../../helpers/calculators");

/**
  @route    GET  api/profile/me
  @desc     Get current users' profile
  @access   Private 
 */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
  @route    POST api/profile
  @desc     Create OR update a user profile
  @access   Private 
 */
router.post(
  "/",
  [
    auth,
    [
      check("height", "Height is required").not().isEmpty(),
      check("weight", "Weight is required").not().isEmpty(),
      check("age", "Age is required").not().isEmpty(),
      check("sex", "Sex is required").not().isEmpty(),
      check("goal", "Goal is required").not().isEmpty(),
      check("lifestyle", "Lifestyle is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Pull fields out of the request body
    const { height, weight, age, sex, goal, lifestyle } = req.body;

    //Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.height = height;
    profileFields.weight = weight;
    profileFields.age = age;
    profileFields.sex = sex;
    profileFields.goal = goal;
    profileFields.lifestyle = lifestyle;

    //Get recommended calories
    recommendedCals = calculators.calculateGoal(
      weight,
      height,
      age,
      sex,
      lifestyle,
      goal
    );

    //Add recommended calories to profile fields
    profileFields.recommendedCals = recommendedCals;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); //Matched from token
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { useFindAndModify: false }
        );
        return res.status(200).send();
      }
      //Create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.status(200).send();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
  @route    POST api/profile/addLikedMeals
  @desc     Add liked meals to profile
  @access   Private 
 */
router.post("/addLikedMeals", auth, async (req, res) => {
  const meals = req.body.meals;

  //If no meals are liked
  if (meals.length == 0) {
    return res.status(200).json({ status: "empty" });
  }

  for (let meal of meals) {
    //Add to profile
  }
});

module.exports = router;
