// calculate max weight and total volume for a set
export const getAggregateExerciseData = (setData) => {
  let max = 0;
  let volume = 0;
  setData.forEach((set) => {
    max = Math.max(max, set.weight);
    volume += set.weight * set.reps;
  });
  return { max, volume };
};

// calculate max weight and volumes for all exercises in session
export const getAggregateSessionData = (sessionData) => {
  return sessionData["exercises"].map((exercise) => ({
    name: exercise.name,
    ...getAggregateExerciseData(exercise.sets),
  }));
};
