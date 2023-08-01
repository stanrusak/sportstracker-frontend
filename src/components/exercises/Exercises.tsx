import { useEffect, useState } from "react";
import { getProtectedData, mutateProtectedData } from "../../utils/api";
import CreateExercise from "./CreateExercise";
import { SiteButton } from "../layout/Layout";
import { useAuth } from "../../utils/auth";

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

export interface ExerciseType {
  id: number;
  name: string;
  variation: string;
  muscle_groups: MuscleType[];
  activities: ActivityType[];
}

const ExerciseCard = ({
  exercise,
  userExercises = [],
  setUserExercises = () => {},
}) => {
  const [selected, setSelected] = useState(
    userExercises?.includes(exercise.id),
  );

  const handleSelect = () => {
    const newSelected = [...userExercises];
    if (selected) {
      setUserExercises(newSelected.filter((id) => id !== exercise.id));
    } else {
      setUserExercises([...newSelected, exercise.id]);
    }
    setSelected((prev) => !prev);
  };
  return (
    <div
      onClick={() => handleSelect()}
      className={`flex w-[200px] flex-col rounded-xl border-2 bg-bgsecondary p-4 shadow-md transition-all duration-300 hover:scale-105 ${
        selected ? " border-accent" : "border-transparent"
      }`}
    >
      <h3 className="font-semibold">{exercise.name}</h3>
      <h4 className="text-xs font-extralight">
        {exercise.variation || "standard"}
      </h4>
      {!!exercise.muscle_groups.length && (
        <span>
          {exercise.muscle_groups[0].name === exercise.muscle_groups[0].area
            ? exercise.muscle_groups[0].name
            : `${exercise.muscle_groups[0].area}: ${exercise.muscle_groups[0].name}`}
        </span>
      )}
      <div className="mt-4">
        {exercise.activities.map((activity) => (
          <span
            key={`exercise-activity-${activity.id}`}
            className="rounded-xl bg-blue-500 p-2 text-xs text-white"
          >
            {activity?.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const AddExercise = ({ show }) => {
  const { token, userData, setUserData } = useAuth();
  console.log(userData);
  const [userExercises, setUserExercises] = useState(
    userData.exercises.map((exercise) => exercise.id),
  );
  const [exercises, setExercises] = useState([]);
  const [showCreateNewExercise, setShowCreateNewExercise] = useState(false);

  const getData = async () => {
    setExercises(await getProtectedData("exercises", ""));
  };

  useEffect(() => {
    getData();
  }, [setShowCreateNewExercise]);

  const handleSave = async () => {
    if (userExercises.length > 0) {
      var response = await mutateProtectedData(
        "users/me/exercises",
        userExercises,
        token,
        "PATCH",
      );
    }
    console.log(response);
    setUserData((oldData) => ({ ...oldData, exercises: response.exercises }));
    show(false);
  };
  return (
    <div
      className={`rounded-2xln absolute left-1/2 top-1/2 z-10 flex h-[640px] w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 border-blue-500 bg-bgprimary shadow-md sm:w-[550px] md:w-[680px]`}
    >
      {showCreateNewExercise && (
        <CreateExercise
          show={setShowCreateNewExercise}
          setExercises={setExercises}
        />
      )}
      <div className="relative w-full">
        <button onClick={() => show(false)} className="absolute right-2">
          x
        </button>
      </div>
      <div className="m-4 flex w-full flex-grow flex-col">
        <h1 className="m-4 text-2xl font-bold">Select exercises</h1>
        <div className="flex w-full justify-center">
          <div className="scrollbar flex h-[500px] w-[95%] flex-wrap gap-2 overflow-y-auto">
            {exercises.map((exercise, idx) => (
              <ExerciseCard
                key={`select-exercise-${idx}`}
                exercise={exercise}
                userExercises={userExercises}
                setUserExercises={setUserExercises}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <SiteButton onClick={() => handleSave()}>Save</SiteButton>
        <SiteButton onClick={() => setShowCreateNewExercise(true)}>
          Create new exercise
        </SiteButton>
        <SiteButton onClick={() => show(false)}>Cancel</SiteButton>
      </div>
    </div>
  );
};

const Exercises = () => {
  const { userData } = useAuth();
  const exercises = userData.exercises;
  const [showAddExercise, setShowAddExercise] = useState(false);

  return (
    <section className="mb-2 max-w-md">
      <div className="">
        <h1 className="my-2 text-xl font-semibold">My Exercises</h1>
        <SiteButton onClick={() => setShowAddExercise(true)}>
          New Exercise
        </SiteButton>
      </div>
      {showAddExercise && <AddExercise show={setShowAddExercise} />}

      <div className="mt-2 flex flex-wrap gap-4">
        {exercises
          ?.slice(0, 10)
          .map((exercise) => (
            <ExerciseCard key={`exercise-${exercise.id}`} exercise={exercise} />
          ))}
      </div>
    </section>
  );
};

export default Exercises;
