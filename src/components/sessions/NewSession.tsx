import { useEffect, useState } from "react";
import { getProtectedData, mutateProtectedData } from "../../utils/api";

import { Button, FormControl, Input, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ExerciseType } from "../exercises/Exercises";
import { SiteButton } from "../layout/Layout";
import { useAuth } from "../../utils/auth";

interface SetType {
  weight: number;
  reps: number;
}

const parseReps = (reps: number[]) => {
  for (let i = 1; i < reps.length; i++) {
    if (reps[i] != reps[i - 1]) {
      return reps.join(" | ");
    }
  }
  return `${reps.length}x${reps[0]}`;
};

const processSets = (sets: SetType[]) => {
  const setsByWeight = {};
  sets.forEach((set) => {
    if (setsByWeight[set.weight]) {
      setsByWeight[set.weight].push(set.reps);
    } else {
      setsByWeight[set.weight] = [set.reps];
    }
  });

  return Object.entries(setsByWeight).map(([weight, reps]) => ({
    weight: weight,
    reps: parseReps(reps),
  }));
};

const ExerciseCard = ({ idx, exerciseData, setEditing }) => {
  const processedSets = processSets(exerciseData.sets);
  return (
    <div className="flex gap-4 rounded-lg bg-blue-200 p-2">
      <div className="flex flex-col">
        <span className="font-semibold">{exerciseData.name}</span>
        <span className="text-xs uppercase">{exerciseData.variation}</span>
      </div>
      <div className="flex gap-4">
        {processedSets.map((set, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center rounded-2xl border-2 border-blue-900 bg-blue-700 p-2 text-white"
          >
            <h5 className="text-sm">{set.weight}kg</h5>
            <span>{set.reps}</span>
          </div>
        ))}
      </div>
      <Button onClick={() => setEditing((prev) => [...prev, idx])}>Edit</Button>
    </div>
  );
};

const Sets = ({ exerciseIdx, sessionExercises, setNewExerciseField }) => {
  const [sets, setSets] = useState(sessionExercises[exerciseIdx].sets);
  useEffect(() => setNewExerciseField(exerciseIdx, "sets", sets), [sets]);
  const updateSets = (event, idx, field) => {
    const newSets = [...sets];
    newSets[idx][field] = event.target.value;
    setSets(newSets);
  };
  const inputStyle = {
    fontSize: 13,
    textAlign: "center",
    margin: 2,
    width: 70,
  };
  return (
    <div className="mx-2 flex w-[200px] flex-grow flex-col">
      <h2 className="text-center text-sm font-semibold uppercase text-slate-500">
        Sets
      </h2>
      <div className="flex h-full items-center gap-1 overflow-x-auto">
        {sets.map((set, idx) => (
          <div key={`set-${idx}`} className="w-20">
            <OutlinedInput
              id="set-weight"
              value={set.weight}
              endAdornment={<span className="text-xs">kg</span>}
              onChange={(event) => updateSets(event, idx, "weight")}
              size={"small"}
              style={inputStyle}
            />
            <OutlinedInput
              id="set-reps"
              value={set.reps}
              onChange={(event) => updateSets(event, idx, "reps")}
              size={"small"}
              style={inputStyle}
            />
          </div>
        ))}
        <Button
          onClick={() => setSets((prev) => [...prev, { weight: 0, reps: 0 }])}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const EditExercise = ({
  exercises,
  idx,
  sessionExercises,
  setNewExerciseField,
  setEditing,
}) => {
  const [sets, setSets] = useState([]);
  return (
    <div className="flex rounded-xl border border-blue-200 p-2 shadow-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-sm font-semibold uppercase text-slate-500">
          Add new exercise
        </h2>
        <Autocomplete
          onChange={(event, newValue) =>
            setNewExerciseField(idx, "name", newValue.name)
          }
          id="exercise-name"
          value={sessionExercises[idx].name}
          isOptionEqualToValue={(option, value) => option.name === value}
          options={exercises}
          renderInput={(params) => <TextField {...params} label="Exercise" />}
          sx={{ minWidth: 150 }}
          size={"small"}
        />
        <TextField
          id="exercise-variation"
          value={sessionExercises[idx].variation}
          label="Variation"
          variant="outlined"
          onChange={(event) =>
            setNewExerciseField(idx, "variation", event.target.value)
          }
          size={"small"}
        />
      </div>
      <Sets
        exerciseIdx={idx}
        sessionExercises={sessionExercises}
        setNewExerciseField={setNewExerciseField}
      />
      <Button
        onClick={() =>
          setEditing((prev) => prev.filter((item) => item !== idx))
        }
      >
        Save
      </Button>
    </div>
  );
};

const CreateSession = ({ show }) => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [activities, setActivities] = useState([]);
  const [currentActivityId, setCurrentActivityId] = useState("");
  const [sessionExercises, setSessionExercises] = useState([]);
  const [editing, setEditing] = useState<number[]>([]);
  const getActivities = async () => {
    setActivities(await getProtectedData("activities", ""));
  };

  useEffect(() => {
    getActivities();
  }, []);

  const [exercises, setExercises] = useState<
    ExerciseType[] & { label: string }
  >();
  const getExercises = async () => {
    const response = await getProtectedData<ExerciseType[]>("exercises", "");
    setExercises(
      // add labels to be displayed in the autocomplete
      response.map((exercise) => ({
        ...exercise,
        label: exercise.name,
      })),
    );
  };

  useEffect(() => {
    getExercises();
  }, []);

  const handleAddExercise = async () => {
    await setSessionExercises((prev) => [
      ...prev,
      {
        name: null,
        variation: "",
        sets: [],
      },
    ]);
    setEditing((prev) => [...prev, sessionExercises.length]);
  };

  const [activityError, setActivityError] = useState(false);
  const handleSelectActivity = (event: SelectChangeEvent) => {
    setActivityError(false);
    setCurrentActivityId(event.target.value);
  };

  const setNewExerciseField = (idx, field, newValue) => {
    const newSessionExercises = [...sessionExercises];
    newSessionExercises[idx][field] = newValue;
    setSessionExercises(newSessionExercises);
  };

  const { token } = useAuth();
  const handleSaveSession = async () => {
    if (!currentActivityId) {
      setActivityError(true);
      return;
    }
    const data = {
      activity_id: currentActivityId,
      date: date.toISOString().slice(0, 10),
      session_data: { exercises: sessionExercises },
    };
    const response = await mutateProtectedData("sessions", data, token);
    console.log(response);
  };
  return (
    <div
      className={`rounded-2xln absolute left-1/2 top-1/2 z-10 h-[80vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-blue-500 bg-white shadow-md sm:w-[550px] md:w-[650px]`}
    >
      <div className="relative w-full">
        <button onClick={() => show(false)} className="absolute right-2">
          x
        </button>
      </div>
      <div className="m-4">
        <h1 className="text-2xl font-bold">Create New Session</h1>
        <h2 className="text-lg">{date.format("dddd[, ]MMMM D")}</h2>
        <div className="mt-4 flex flex-col">
          <div className="flex items-center gap-2">
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate as Dayjs)}
              sx={{ width: 150 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="activity-select-label">Activity</InputLabel>
              <Select
                labelId="activity-select-label"
                id="demo-simple-select-helper"
                value={currentActivityId}
                label="Activity"
                onChange={handleSelectActivity}
                error={activityError}
              >
                {activities.map(({ id, name }) => (
                  <MenuItem key={`activity-${id}`} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Exercises</h2>
          <div className="mt-4 flex h-[300px] flex-col gap-2 overflow-auto">
            {sessionExercises.map((exerciseData, idx) => (
              <div key={`session-exercise-${idx}`}>
                {editing.includes(idx) ? (
                  <EditExercise
                    exercises={exercises}
                    idx={idx}
                    sessionExercises={sessionExercises}
                    setNewExerciseField={setNewExerciseField}
                    setEditing={setEditing}
                  />
                ) : (
                  <ExerciseCard
                    exerciseData={exerciseData}
                    idx={idx}
                    setEditing={setEditing}
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleAddExercise}
              className="mt-2 flex w-[100px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add
            </button>
            <Button onClick={() => console.log(sessionExercises)}>Debug</Button>
          </div>
          <SiteButton onClick={handleSaveSession}>Save Session</SiteButton>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
