module.exports = {
  //Calculates a goal caloric expenditure
  calculateGoal: (weight, height, age, sex, lifestyle, goal) => {
    //Calculate caloric expenditure using harris benedict formula
    const expenditure = calculateHarrisBenedict(
      weight,
      height,
      age,
      sex,
      lifestyle
    );

    var recommendedCals = expenditure;

    if (goal == "lose") {
      recommendedCals = expenditure - 500;
    } else if (goal == "maintain") {
      recommendedCals = expenditure; //Do nothing
    } else if (goal == "gain") {
      recommendedCals = expenditure + 500;
    }

    return Math.round(recommendedCals);
  },
};

//Calulates basal metabolic rate
calculateBMR = (weight, height, age, sex) => {
  //Convert weight from lbs to kgs
  const kgs = weight * 0.453592;
  //Convert height from in to cm
  const cms = height * 2.54;
  var bmr = 0;
  //Calculate bmr based on sex
  if (sex == "male") {
    bmr = 10 * kgs + 6.25 * cms - 5 * age + 5;
  } else {
    bmr = 10 * kgs + 6.25 * cms - 5 * age - 161;
  }
  return bmr;
};

//Calculates energy expenditure based on harris/benedict formula
calculateHarrisBenedict = (weight, height, age, sex, lifestyle) => {
  const bmr = calculateBMR(weight, height, age, sex);

  if (lifestyle == "sedentary") {
    return bmr * 1.2;
  } else if (lifestyle == "light") {
    return bmr * 1.375;
  } else if (lifestyle == "moderate") {
    return bmr * 1.55;
  } else if (lifestyle == "active") {
    return bmr * 1.725;
  } else {
    return bmr * 1.9;
  }
};
