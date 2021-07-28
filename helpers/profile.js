const axios = require("axios");
const Profile = require("../models/Profile");
const Food = require("../models/Food");
const User = require("../models/User");

module.exports = {
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
      const food = constructFood(meal);
      const foodId = meal.id;

      weeklyMeals[foodId] = food;
    }

    //Add to local profileFields object
    const profileFields = {};

    //Add to profile
    if (type == "breakfast") profileFields.weeklyBreakfasts = weeklyMeals;
    if (type == "lunch") profileFields.weeklyLunches = weeklyMeals;
    if (type == "dinner") {
      profileFields.weeklyDinners = weeklyMeals;
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

  //Gets the users profile object from mongoDB

  //Gets the user's weekly meals from MongoDB Profile Object
  getWeeklyBreakfasts: async (id) => {
    let profile = await Profile.findOne({ user: id });
    if (!profile) return false;

    return profile.weeklyBreakfasts;
  },
};

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
