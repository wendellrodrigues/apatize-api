const express = require("express");
const axios = require("axios");

module.exports = {
  /**
      Generates Weekly breakfasts
      Makes axios call to return data based on caloric input
      @param calories Is the max number of calories for each meal
   */
  generateWeeklyBreakfasts: async (calories) => {
    const params = {
      apiKey: process.env.SPOONACULAR_KEY,
      maxCalories: calories,
      type: "breakfast",
      addRecipeNutrition: true,
      includeIngredients: true,
      instructionsRequired: true,
      number: 1,
      offset: 0,
    };

    let data = null;

    try {
      await axios
        .get("https://api.spoonacular.com/recipes/complexSearch", {
          params,
        })
        .then((result) => {
          data = result.data.results;
        });
    } catch (err) {
      return null;
    }

    return data;
  },

  /**
      Generates Weekly lunches and dinners
      Makes axios call to return data based on caloric input
      @param calories Is the max number of calories for each meal
      @param offset Is the offset of search resulsts to the API endpoint
   */
  generateWeeklyMainCourses: async (calories, offset) => {
    const params = {
      apiKey: process.env.SPOONACULAR_KEY,
      maxCalories: calories,
      type: "main course",
      addRecipeNutrition: true,
      includeIngredients: true,
      instructionsRequired: true,
      number: 30,
      offset: offset,
    };

    try {
      await axios
        .get("https://api.spoonacular.com/recipes/complexSearch", {
          params,
        })
        .then((result) => {
          data = result.data.results;
        });
    } catch (err) {
      return null;
    }

    return data;
  },
};
