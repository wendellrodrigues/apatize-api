const axios = require("axios");
const Profile = require("../models/Profile");
const Food = require("../models/Food");
const User = require("../models/User");

module.exports = {
  //Adds breakfasts to each day of the week
  addWeeklyBreakfasts: async (id, meals) => {
    //Get profile
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;

    let profileFields = {
      week: {
        sunday: {
          breakfasts: {},
        },
        monday: {
          breakfasts: {},
        },
        tuesday: {
          breakfasts: {},
        },
        wednesday: {
          breakfasts: {},
        },
        thursday: {
          breakfasts: {},
        },
        friday: {
          breakfasts: {},
        },
        saturday: {
          breakfasts: {},
        },
      },
    };

    //Construct Meals
    for (let meal in meals) {
      const food = constructFood(meals[meal]);
      const foodId = meals[meal].id;
      if (meal <= 4) {
        profileFields.week.sunday.breakfasts[foodId] = food;
      } else if (meal <= 8) {
        profileFields.week.monday.breakfasts[foodId] = food;
      } else if (meal <= 12) {
        profileFields.week.tuesday.breakfasts[foodId] = food;
      } else if (meal <= 16) {
        profileFields.week.wednesday.breakfasts[foodId] = food;
      } else if (meal <= 20) {
        profileFields.week.thursday.breakfasts[foodId] = food;
      } else if (meal <= 24) {
        profileFields.week.friday.breakfasts[foodId] = food;
      } else if (meal <= 30) {
        profileFields.week.saturday.breakfasts[foodId] = food;
      }
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

  //Adds lunches to each day of the week
  addWeeklyLunches: async (id, meals) => {
    //Get profile
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;

    let profileFields = {
      week: {
        sunday: {
          breakfasts: profile.week.sunday.breakfasts,
          lunches: {},
        },
        monday: {
          breakfasts: profile.week.monday.breakfasts,
          lunches: {},
        },
        tuesday: {
          breakfasts: profile.week.tuesday.breakfasts,
          lunches: {},
        },
        wednesday: {
          breakfasts: profile.week.wednesday.breakfasts,
          lunches: {},
        },
        thursday: {
          breakfasts: profile.week.thursday.breakfasts,
          lunches: {},
        },
        friday: {
          breakfasts: profile.week.friday.breakfasts,
          lunches: {},
        },
        saturday: {
          breakfasts: profile.week.saturday.breakfasts,
          lunches: {},
        },
      },
    };

    //Construct Meals
    for (let meal in meals) {
      const food = constructFood(meals[meal]);
      const foodId = meals[meal].id;
      if (meal <= 4) {
        profileFields.week.sunday.lunches[foodId] = food;
      } else if (meal <= 8) {
        profileFields.week.monday.lunches[foodId] = food;
      } else if (meal <= 12) {
        profileFields.week.tuesday.lunches[foodId] = food;
      } else if (meal <= 16) {
        profileFields.week.wednesday.lunches[foodId] = food;
      } else if (meal <= 20) {
        profileFields.week.thursday.lunches[foodId] = food;
      } else if (meal <= 24) {
        profileFields.week.friday.lunches[foodId] = food;
      } else if (meal <= 30) {
        profileFields.week.saturday.lunches[foodId] = food;
      }
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

  //Adds dinners to each day of the week
  addWeeklyDinners: async (id, meals, offset) => {
    //Get profile
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;

    let profileFields = {
      week: {
        sunday: {
          breakfasts: profile.week.sunday.breakfasts,
          lunches: profile.week.sunday.lunches,
          dinners: {},
        },
        monday: {
          breakfasts: profile.week.monday.breakfasts,
          lunches: profile.week.monday.lunches,
          dinners: {},
        },
        tuesday: {
          breakfasts: profile.week.tuesday.breakfasts,
          lunches: profile.week.tuesday.lunches,
          dinners: {},
        },
        wednesday: {
          breakfasts: profile.week.wednesday.breakfasts,
          lunches: profile.week.wednesday.lunches,
          dinners: {},
        },
        thursday: {
          breakfasts: profile.week.thursday.breakfasts,
          lunches: profile.week.thursday.lunches,
          dinners: {},
        },
        friday: {
          breakfasts: profile.week.friday.breakfasts,
          lunches: profile.week.friday.lunches,
          dinners: {},
        },
        saturday: {
          breakfasts: profile.week.saturday.breakfasts,
          lunches: profile.week.saturday.lunches,
          dinners: {},
        },
      },
    };

    //Construct Meals
    for (let meal in meals) {
      const food = constructFood(meals[meal]);
      const foodId = meals[meal].id;
      if (meal <= 4) {
        profileFields.week.sunday.dinners[foodId] = food;
      } else if (meal <= 8) {
        profileFields.week.monday.dinners[foodId] = food;
      } else if (meal <= 12) {
        profileFields.week.tuesday.dinners[foodId] = food;
      } else if (meal <= 16) {
        profileFields.week.wednesday.dinners[foodId] = food;
      } else if (meal <= 20) {
        profileFields.week.thursday.dinners[foodId] = food;
      } else if (meal <= 24) {
        profileFields.week.friday.dinners[foodId] = food;
      } else if (meal <= 30) {
        profileFields.week.saturday.dinners[foodId] = food;
      }
    }

    //Update offset
    profileFields.offset = offset + 1;

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

  //Adds weekly meals as an object to the user's Profile object in mongo DB
  addWeeklyMeals: async (type, id, meals, offset) => {
    //Get profile
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;
    //This weeks meals are to be stored in an object and
    const weeklyMeals = {};

    let sundayMeals = {};
    let mondayMeals = {};
    let tuesdayMeals = {};
    let wednesdayMeals = {};
    let thursdayMeals = {};
    let fridayMeals = {};
    let saturdayMeals = {};

    //Add to local object
    for (let meal in meals) {
      //Add to weeklyMeals meals
      const food = constructFood(meals[meal]);
      const foodId = meal.id;

      if (meals <= 4) {
        sundayMeals[foodId] = food;
      } else if (meals <= 8) {
        mondayMeals[foodId] = food;
      } else if (meals <= 12) {
        tuesdayMeals[foodId] = food;
      } else if (meals <= 16) {
        wednesdayMeals[foodId] = food;
      } else if (meals <= 20) {
        thursdayMeals[foodId] = food;
      } else if (meals <= 24) {
        fridayMeals[foodId] = food;
      } else if (meals <= 30) {
        saturdayMeals[foodId] = food;
      }

      weeklyMeals[foodId] = food;
    }

    //Add to local profileFields object
    const profileFields = {
      sunday: {},
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
    };

    // //Add to profile
    // if (type == "breakfast") profileFields.week.weeklyBreakfasts = weeklyMeals;
    // if (type == "lunch") profileFields.weeklyLunches = weeklyMeals;
    // if (type == "dinner") {
    //   profileFields.weeklyDinners = weeklyMeals;
    //   profileFields.offset = offset + 1; //Update offset numbers (add one)
    // }

    if (type == "breakfast") {
      profileFields.sunday.breakfasts = sundayMeals;
      profileFields.monday.breakfasts = mondayMeals;
      profileFields.tuesday.breakfasts = tuesdayMeals;
      profileFields.wednesday.breakfasts = wednesdayMeals;
      profileFields.thursday.breakfasts = thursdayMeals;
      profileFields.friday.breakfasts = fridayMeals;
      profileFields.saturday.breakfasts = saturdayMeals;
    }

    if (type == "lunch") {
      profileFields.sunday.lunches = sundayMeals;
      profileFields.monday.lunches = mondayMeals;
      profileFields.tuesday.lunches = tuesdayMeals;
      profileFields.wednesday.lunches = wednesdayMeals;
      profileFields.thursday.lunches = thursdayMeals;
      profileFields.friday.lunches = fridayMeals;
      profileFields.saturday.lunches = saturdayMeals;
    }

    if (type == "dinner") {
      profileFields.sunday.dinners = sundayMeals;
      profileFields.monday.dinners = mondayMeals;
      profileFields.tuesday.dinners = tuesdayMeals;
      profileFields.wednesday.dinners = wednesdayMeals;
      profileFields.thursday.dinners = thursdayMeals;
      profileFields.friday.dinners = fridayMeals;
      profileFields.saturday.dinners = saturdayMeals;
      profileFields.offset = offset + 1; //Update offset numbers (add one)
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

addDay = (day, meals) => {};

//Constructs food based on inputs from the spoonacular API and the Food model
constructFood = (meal) => {
  const food = {};

  //Construct fields
  food.vegetarian = meal.vegetarian;
  food.vegan = meal.vegan;
  food.glutenFree = meal.glutenFree;
  food.dairyFree = meal.dairyFree;
  food.veryHealthy = meal.veryHealthy;
  food.cheap = meal.cheap;
  food.veryPopular = meal.veryPopular;
  food.sustainable = meal.sustainable;
  food.weightWatcherSmartPoints = meal.weightWatcherSmartPoints;
  food.gaps = meal.gaps;
  food.lowFodmap = meal.lowFodmap;
  food.preparationMinutes = meal.preparationMinutes;
  food.cookingMinutes = meal.cookingMinutes;
  food.aggregateLikes = meal.aggregateLikes;
  food.spoonacularScore = meal.spoonacularScore;
  food.healthScore = meal.healthScore;
  food.creditsText = meal.creditsText;
  food.sourceName = meal.sourceName;
  food.pricePerServing = meal.pricePerServing;
  food.id = meal.id;
  food.title = meal.title;
  food.readyInMinutes = meal.readyInMinutes;
  food.servings = meal.servings;
  food.sourceUrl = meal.sourceUrl;
  food.image = meal.image;
  food.imageType = meal.imageType;

  food.nutrients = [];
  food.properties = [];
  food.flavonoids = [];
  food.ingredients = [];
  for (nutrient of meal.nutrition.nutrients) food.nutrients.push(nutrient);
  for (property of meal.nutrition.properties) food.properties.push(property);
  for (flavonoid of meal.nutrition.flavonoids) food.flavonoids.push(nutrient);
  for (ingredient of meal.nutrition.ingredients)
    food.ingredients.push(ingredient);

  food.caloricBreakdown = meal.nutrition.caloricBreakdown;
  food.weightPerServing = meal.nutrition.weightPerServing;

  food.cuisines = meal.cuisines;
  food.dishTypes = meal.dishTypes;
  food.diets = meal.diets;
  food.occasions = meal.occasions;

  food.instructions = [];
  const analyzedInstructions = meal.analyzedInstructions;

  if (analyzedInstructions.length > 0) {
    const instructions = meal.analyzedInstructions[0].steps;
    for (instruction of instructions) {
      food.instructions.push(instruction);
    }
  }
  return food;
};
