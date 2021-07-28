const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const calculators = require("../../helpers/calculators");
const util = require("util");

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

    console.log(req.user.id);

    //Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.height = height;
    profileFields.weight = weight;
    profileFields.age = age;
    profileFields.sex = sex;
    profileFields.goal = goal;
    profileFields.lifestyle = lifestyle;
    profileFields.offset = 0;

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

    profileFields.likedMeals = {};
    profileFields.dislikedMeals = {};

    //Meal types
    profileFields.allergies = {};
    profileFields.cuisines = {};
    profileFields.dietaryRestrictions = {};

    try {
      let profile = await Profile.findOne({ user: req.user.id }); //Matched from token
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).send({ msg: "User Profile Created" });
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
  @route    GET api/profile
  @desc     Get all profiles
  @access   Public
 */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
  @route    GET api/profile/user/:user_id
  @desc     Get profile by user ID
  @access   Public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name"]);
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.king == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

/**
  @route    DELETE api/profile
  @desc     Delete profile and user
  @access   Private
 */
router.delete("/", auth, async (req, res) => {
  try {
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    return res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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

  //Get profile
  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(500).send("No Profile");

  //Get previously liked meals from db profile + store in local obj
  if (profile.likedMeals) var likedMeals = profile.likedMeals;
  else var likedMeals = {};

  //Add to local obj based on liked meals
  for (let meal of meals) {
    //If meal exists in liked meals already, add another like to it
    if (likedMeals[meal]) {
      const numOfLikes = likedMeals[meal];
      likedMeals[meal] = numOfLikes + 1;
      //Else, add an initial like to it
    } else {
      likedMeals[meal] = 1;
    }
  }

  //Update local obj with liked meals
  const profileFields = {};
  profileFields.likedMeals = likedMeals;

  //Upload to mongoDB profile
  try {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { useFindAndModify: false }
    );
    res.status(200).send();
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/**
  @route    PUT api/profile/addDislikedMeals
  @desc     Add disliked meals to profile
  @access   Private 
 */
router.put("/addDislikedMeals", auth, async (req, res) => {
  const meals = req.body.meals;

  //If no meals are liked
  if (meals.length == 0) {
    return res.status(200).json({ status: "empty" });
  }

  //Get profile
  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(500).send("No Profile");

  //Get previously liked meals from db profile + store in local obj
  if (profile.dislikedMeals) var dislikedMeals = profile.dislikedMeals;
  else var dislikedMeals = {};

  //Add to local obj based on disliked meals
  for (let meal of meals) {
    //If meal exists in disliked meals already, add another like to it
    if (dislikedMeals[meal]) {
      const numOfLikes = dislikedMeals[meal];
      dislikedMeals[meal] = numOfLikes + 1;
      //Else, add an initial like to it
    } else {
      dislikedMeals[meal] = 1;
    }
  }

  //Update local obj with disliked meals
  const profileFields = {};
  profileFields.dislikedMeals = dislikedMeals;

  //Upload to mongoDB profile
  try {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { useFindAndModify: false }
    );
    res.status(200).send();
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;
