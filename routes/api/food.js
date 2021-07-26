const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const calculators = require("../../helpers/calculators");
const util = require("util");
const profile = require("../../helpers/profile");
const foods = require("../../helpers/food");

//Temp resulsts for dev purposes
const tempBreakfast = require("../../helpers/temp/breakfast");
const tempLunch = require("../../helpers/temp/lunch");
const tempDinner = require("../../helpers/temp/dinner");

/**
  @route    POST api/food/generateMealPlan
  @desc     Generates a meal plan for the week
  @access   Private 
 */
router.post("/generateMealPlan", auth, async (req, res) => {
  //Get profile requirements

  //Get offset (offset is the randomization)
  //After 10 weeks, offset resets to 0
  let offset = 0;

  if (offset > 10) {
    //reset offset function
  }

  //For dev purposes (remove later)
  tmpBkfst = tempBreakfast.results;
  tmpLnch = tempLunch.results;
  tmpDnr = tempLunch.results;

  profile.addWeeklyMeals("breakfast", req.user.id, tmpBkfst, offset);
  profile.addWeeklyMeals("lunch", req.user.id, tmpLnch, offset);
  profile.addWeeklyMeals("dinner", req.user.id, tmpDnr, offset);

  res.status(200).send("Success");

  // //Get Breakfasts from spoonacular
  // await foods.generateWeeklyBreakfasts(600).then((breakfasts) => {
  //   if (breakfasts == null) return res.status(500).send("Server Error");
  //   profile.addWeeklyMeals("breakfast", req.user.id, breakfasts); //Add to db
  // });

  // //Get Lunches from spoonacular;
  // await foods.generateWeeklyMainCourses(600, offset).then((lunches) => {
  //   if (lunches == null) return res.status(500).send("Server Error");
  //   profile.addWeeklyMeals("lunch", req.user.id, lunches); //Add to db
  // });

  // //Get Dinners from spoonacular
  // await foods.generateWeeklyMainCourses(600, offset + 1).then((dinners) => {
  //   if (dinners == null) return res.status(500).send("Server Error");
  //   profile.addWeeklyMeals("dinner", req.user.id, dinners); //Add to db
  // });
});

/**
  @route    POST api/food/getIngredients
  @desc     Test route to get ingredients
  @access   Private 
 */
router.post("/getIngredients", auth, async (req, res) => {
  console.log("getting ingredients");
  res.status(200).send();
});

/**
  @route    POST api/food/addLikedMeals
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
  @route    PUT api/food/addDislikedMeals
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
