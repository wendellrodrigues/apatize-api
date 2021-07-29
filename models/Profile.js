const mongoose = require("mongoose");
const FoodSchema = require("./Food").schema;

const Day = new mongoose.Schema({
  breakfasts: {
    type: Object,
  },
  lunches: {
    type: Object,
  },
  dinners: {
    type: Object,
  },
});

const Week = new mongoose.Schema({
  sunday: {
    type: Day,
  },
  monday: {
    type: Day,
  },
  tuesday: {
    type: Day,
  },
  wednesday: {
    type: Day,
  },
  thursday: {
    type: Day,
  },
  friday: {
    type: Day,
  },
  saturday: {
    type: Day,
  },
});

const ProfileSchema = new mongoose.Schema({
  //Reference a User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  lifestyle: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  recommendedCals: {
    type: Number,
  },

  //Saved meals (All are put in object for hash lookup)
  likedMeals: {
    type: Object,
  },
  dislikedMeals: {
    type: Object,
  },

  week: {
    type: Week,
  },

  //Temporary storage of weekly meals and weekly meal IDs (gets updated every week)
  weeklyBreakfasts: {
    type: Object,
  },

  weeklyLunches: {
    type: Object,
  },

  weeklyDinners: {
    type: Object,
  },

  //Offset (for getting new dishes)
  offset: {
    type: Number,
  },

  //Meal types
  allergies: {
    type: Object,
  },
  cuisines: {
    type: Object,
  },
  dietaryRestrictions: {
    type: Object,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
