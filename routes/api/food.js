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

//Temp results for dev purposes
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
  let userProfile = await Profile.findOne({ user: req.user.id });
  if (!userProfile) return res.status(500).json({ err: "No Profile Found" });

  //Get offset (offset is the randomization)
  let offset = userProfile.offset;
  //reset offset
  if (offset >= 10) offset = -1;

  //For dev purposes (remove later)
  tmpBkfst = tempBreakfast.results;
  tmpLnch = tempLunch.results;
  tmpDnr = tempLunch.results;

  //Add weekly meals to the user's Profile in the db
  await profile.addWeeklyBreakfasts(req.user.id, tmpBkfst).then((res) => {
    if (res == false) return res.status(500).send("Server Error");
  });
  await profile.addWeeklyLunches(req.user.id, tmpLnch).then((res) => {
    if (res == false) return res.status(500).send("Server Error");
  });
  await profile.addWeeklyDinners(req.user.id, tmpDnr, offset).then((res) => {
    if (res == false) return res.status(500).send("Server Error");
  });

  const weeklyMealPlan = userProfile.week;

  res.status(200).json(weeklyMealPlan);

  // //Get Breakfasts from spoonacular
  // await foods.generateWeeklyBreakfasts(600).then((breakfasts) => {
  //   if (breakfasts == null) return res.status(500).send("Server Error");
  //   await profile
  // .addWeeklyBreakfasts(req.user.id, tmpBkfst, offset)
  // .then((res) => {
  //   if (res == false) return res.status(500).send("Server Error");
  // });
  // });

  // //Get Lunches from spoonacular;
  // await foods.generateWeeklyMainCourses(600, offset).then((lunches) => {
  //   if (lunches == null) return res.status(500).send("Server Error");
  //   await profile.addWeeklyLunches(req.user.id, tmpLnch, offset).then((res) => {
  //   if (res == false) return res.status(500).send("Server Error");
  // });
  // });

  // //Get Dinners from spoonacular
  // await foods.generateWeeklyMainCourses(600, offset + 1).then((dinners) => {
  //   if (dinners == null) return res.status(500).send("Server Error");
  //   await profile.addWeeklyDinners(req.user.id, tmpDnr, offset).then((res) => {
  //   if (res == false) return res.status(500).send("Server Error");
  // });
  // });
});

/**
  @route    POST api/food/getRecipe
  @desc     Gets a Recipe based on ID
  @access   Private 
 */
router.get("/getRecipe", auth, async (req, res) => {
  //Request includes id of meal
  mealId = req.body.mealId.toString();
  day = req.body.day.toString();
  mealType = req.body.mealType.toString();

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      console.log("Getting profile");
      meal = profile.week[day][mealType][mealId];
      if (meal) {
        const recipe = meal.instructions;
        //No recipe or empty recipe
        if (recipe == null)
          return res.status(200).json({ msg: "No Instructions" });
        if (meal.instructions.length == 0)
          return res.status(200).json({ msg: "No Instructions" });
        //Return the recipe
        return res.status(200).json(recipe);
      } else {
        //Recipe does not exist in user's weekly meals
        return res.status(500).send("Server Error");
      }
    } else {
      //No profile found
      console.log("No profile");
      return res.status(500).send("Server Error");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

/**
  @route    POST api/food/dislikeMeal/meal_:id
  @desc     Dislikes a meal, removes it from weekly meals and 
  @access   Private 
 */

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
