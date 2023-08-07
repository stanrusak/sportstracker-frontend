import React, { createContext, useContext, useState } from "react";
import { ActivityType, ExerciseType, MuscleType } from "../types/workouts";

interface WorkoutContextType {
  allMuscles: MuscleType[];
  allActivities: ActivityType[];
  allExercises: ExerciseType[];

  setAllMuscles: (mucles: MuscleType[]) => void;
  setAllActivities: (activities: ActivityType[]) => void;
  setAllExercises: (exercises: ExerciseType[]) => void;
}

const WorkoutContext = createContext<WorkoutContextType>({
  allMuscles: [],
  allActivities: [],
  allExercises: [],

  setAllMuscles: () => {},
  setAllActivities: () => {},
  setAllExercises: () => {},
});

const useWorkoutData = () => useContext(WorkoutContext);

const WorkoutContextProvider = ({ children }) => {
  const [allMuscles, setAllMuscles] = useState<MuscleType[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityType[]>([]);
  const [allExercises, setAllExercises] = useState<ExerciseType[]>([]);

  return (
    <WorkoutContext.Provider
      value={{
        allMuscles,
        allActivities,
        allExercises,
        setAllMuscles,
        setAllActivities,
        setAllExercises,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export { WorkoutContextProvider, useWorkoutData };
