const mongoose = require("mongoose");

const NutrientComplex = new mongoose.Schema({
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  amount: {
    type: Number,
  },
  unit: {
    type: String,
  },
  percentOfDailyNeeds: {
    type: Number,
  },
});

const NutritionSimple = new mongoose.Schema({
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  amount: {
    type: Number,
  },
  unit: {
    type: String,
  },
});

const Ingredient = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
  unit: {
    type: String,
  },
});

const CaloricBreakdown = new mongoose.Schema({
  percentProtein: {
    type: Number,
  },
  percentFat: {
    type: Number,
  },
  percentCarbs: {
    type: Number,
  },
});

const WeightPerServing = new mongoose.Schema({
  amount: {
    type: Number,
  },
  unit: {
    type: String,
  },
});

const Item = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  localizedName: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Instruction = new mongoose.Schema({
  number: {
    type: Number,
  },
  step: {
    type: String,
  },
  ingredients: {
    type: [Item],
  },
  equipment: {
    type: [Item],
  },
});

const FoodSchema = new mongoose.Schema({
  vegetarian: {
    type: Boolean,
  },
  vegan: {
    type: Boolean,
  },
  glutenFree: {
    type: Boolean,
  },
  dairyFree: {
    type: Boolean,
  },
  veryHealthy: {
    type: Boolean,
  },
  cheap: {
    type: Boolean,
  },
  veryPopular: {
    type: Boolean,
  },
  sustainable: {
    type: Boolean,
  },
  weightWatcherSmartPoints: {
    type: Number,
  },
  gaps: {
    type: String,
  },
  lowFodmap: {
    type: Boolean,
  },
  preparationMinutes: {
    type: Number,
  },
  cookingMinutes: {
    type: Number,
  },
  aggregateLikes: {
    type: Number,
  },
  spoonacularScore: {
    type: Number,
  },
  healthScore: {
    type: Number,
  },
  creditsText: {
    type: String,
  },
  sourceName: {
    type: String,
  },
  pricePerServing: {
    type: Number,
  },
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  readyInMinutes: {
    type: Number,
  },
  servings: {
    type: Number,
  },
  sourceUrl: {
    type: String,
  },
  image: {
    type: String,
  },
  imageType: {
    type: String,
  },
  nutrients: {
    type: [NutrientComplex],
  },
  properties: {
    type: [NutritionSimple],
  },
  flavonoids: {
    type: [NutritionSimple],
  },
  ingredients: {
    type: [Ingredient],
  },
  caloricBreakdown: {
    type: CaloricBreakdown,
  },
  weightPerServing: {
    type: WeightPerServing,
  },
  cuisines: {
    type: [String],
  },
  dishTypes: {
    type: [String],
  },
  diets: {
    type: [String],
  },
  occasions: {
    type: [String],
  },
  instructions: {
    type: [Instruction],
  },
});

module.exports = Food = mongoose.model("food", FoodSchema);
