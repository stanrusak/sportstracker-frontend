import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { getProtectedData } from "../../utils/api";
import CreateExercise from "./CreateExercise";
import { Button } from "../layout/Layout";

interface MuscleType {
  id: number;
  name: string;
  area: string;
}

interface ActivityType {
  id: number;
  name: string;
  description: string;
}

interface ExerciseType {
  id: number;
  name: string;
  variation: string;
  muscle_groups: MuscleType[];
  activities: ActivityType[];
}

const Exercises = () => {
  const [exercises, setExercises] = useState<ExerciseType[]>();
  const [showCreateNewExercise, setShowCreateNewExercise] = useState(false);
  const [test, settest] = useState(false);
  const getExercises = async () => {
    console.log("Fetching exercises");
    try {
      const data = await getProtectedData<ExerciseType[]>("exercises", "");
      setExercises(data);
    } catch (error) {
      console.log("Error in getExercises:", error);
    }
  };

  useEffect(() => {
    getExercises();
  }, [showCreateNewExercise]);
  return (
    <section>
      <div className="">
        <h1 className="w-[800px] text-xl font-semibold">Exercises</h1>
        <Button onClick={() => setShowCreateNewExercise(true)}>
          New Exercise
        </Button>
      </div>
      {showCreateNewExercise && (
        <CreateExercise show={setShowCreateNewExercise} />
      )}
      <div className="flex flex-wrap gap-4">
        {exercises?.map((exercise) => (
          <div
            key={`exercise-${exercise.id}`}
            className="flex w-[200px] flex-col rounded-xl border-2 bg-white p-4 shadow-md transition-all duration-300 hover:scale-105"
          >
            <h3 className="font-semibold">{exercise.name}</h3>
            <h4 className="text-xs font-extralight">
              {exercise.variation || "standard"}
            </h4>
            <span>
              {exercise.muscle_groups[0].name === exercise.muscle_groups[0].area
                ? exercise.muscle_groups[0].name
                : `${exercise.muscle_groups[0].area}: ${exercise.muscle_groups[0].name}`}
            </span>
            <div className="mt-4">
              {exercise.activities.map((activity) => (
                <span
                  key={`exercise-activity-${activity.id}`}
                  className="rounded-xl bg-blue-500 p-2 text-white"
                >
                  {activity.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Exercises;
