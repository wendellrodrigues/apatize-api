const axios = require("axios");
const Profile = require("../models/Profile");
const User = require("../models/User");

module.exports = {
  //Gets the user's weekly meals from MongoDB Profile Object

  //Adds weekly meals as an object to the user's Profile object in mongo DB
  addWeeklyMeals: async (type, id, meals, offset) => {
    //Get profile
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;
    //This weeks meals are to be stored in an object and
    const weeklyMeals = {};
    //Add to local object
    for (let meal of meals) {
      //Add to weekly meals
      weeklyMeals[meal] = 0;
    }

    //Add to local profileFields object
    const profileFields = {};

    //Add to profile
    if (type == "breakfast") profileFields.weeklyBreakfasts = weeklyMeals;
    if (type == "lunch") profileFields.weeklyLunches = weeklyMeals;
    if (type == "dinner") {
      profileFields.weeklyDinners = weeklyMeals;
      profileFields.offset = offset + 1;
      //Update offset numbers (add one)
    }

    //Upload to mongoDB profile
    try {
      profile = await Profile.findOneAndUpdate(
        { user: id },
        { $set: profileFields },
        { useFindAndModify: false }
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
