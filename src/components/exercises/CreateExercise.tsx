import { useEffect, useState } from "react";
import { getProtectedData, mutateProtectedData } from "../../utils/api";

import {
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  Select,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import { GiMuscularTorso, GiStopwatch } from "react-icons/gi";

import { SiteButton, Icon } from "../layout/Layout";

const label = { inputProps: { "aria-label": "Checkbox" } };
const NINJA_API_KEY = "o5ytoTGsuo31Tj2VqIqRWA==D6LvJm0sWJRc941f";

const NinjaSuggestions = ({ muscleName, setExerciseData }) => {
  const [ninjaExercises, setNinjaExercises] = useState([]);

  const getNinjaData = async (muscle) => {
    const response = await fetch(
      "https://api.api-ninjas.com/v1/exercises?muscle=" +
        muscle.toLowerCase().replace(" ", "_"),
      {
        headers: { "X-Api-Key": NINJA_API_KEY },
      },
    );
    const data = await response.json();
    setNinjaExercises(data);
  };

  useEffect(() => {
    getNinjaData(muscleName);
  }, [ninjaExercises]);

  return (
    <>
      <h2 className="mt-[-5vh] text-lg font-bold">Suggested exercises</h2>
      <p className="text-xs text-slate-500">
        Here are some suggestions coming from an external API. This will go away
        once the app has a substantial exercise database of its own. Pick one
        from the list below and fill in the rest of the info. Or create your
        own.
      </p>
      <div className="mt-2 h-[50vh] overflow-y-auto">
        {ninjaExercises.map((exercise) => (
          <div
            onClick={() => {
              setExerciseData((prevData) => ({
                ...prevData,
                name: exercise.name,
              }));
            }}
            className="mx-4 flex w-[80%] cursor-pointer flex-col gap-1 rounded-md px-4 py-2 hover:scale-110 hover:bg-slate-200"
          >
            <h3 className="text-sm font-bold">{exercise.name}</h3>
            <h4 className="text-sm font-semibold text-slate-600">
              {exercise.type}
            </h4>
          </div>
        ))}
      </div>
    </>
  );
};

const CreateExercise = ({ show }) => {
  const [activities, setActivities] = useState([]);
  const [currentMuscle, setCurrentMuscle] = useState("");
  const [muscles, setMuscles] = useState([]);

  const [exerciseData, setExerciseData] = useState({
    name: "",
    variation: "",
    muscle_groups: [""],
    activities: [],
    bodyweight: false,
    static: false,
  });

  const getData = async () => {
    setActivities(await getProtectedData("activities", ""));
    setMuscles(await getProtectedData("muscles", ""));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async () => {
    await mutateProtectedData("exercises", exerciseData, "");
    show(false);
  };

  return (
    <div
      className={`rounded-2xln absolute left-1/2 top-1/2 flex h-[80vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 border-blue-500 bg-white shadow-md sm:w-[550px] md:w-[650px]`}
    >
      <div className="relative w-full">
        <button onClick={() => show(false)} className="absolute right-2">
          x
        </button>
      </div>
      <div className="m-4 flex w-full flex-grow flex-col">
        <h1 className="m-4 text-2xl font-bold">Create New Exercise</h1>
        <div className="mt-8 flex flex-grow">
          <div className="flex h-full w-1/2 flex-col items-center gap-2">
            <div className="flex flex-grow flex-col gap-2">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="muscle-select-label">Muscle Group</InputLabel>
                <Select
                  labelId="muscle-select-label"
                  id="demo-simple-select-helper"
                  value={currentMuscle}
                  label="Muscle"
                  onChange={(e) => {
                    setCurrentMuscle(e.target.value);
                    setExerciseData((prevData) => ({
                      ...prevData,
                      muscle_groups: [e.target.value.id],
                    }));
                  }}
                >
                  {muscles.map((muscle) => (
                    <MenuItem key={`muscle-${muscle.id}`} value={muscle}>
                      {muscle.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ minWidth: "100%" }}
                id="exercise-name"
                value={exerciseData.name}
                label=""
                variant="outlined"
                onChange={(e) => {
                  setExerciseData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }));
                }}
              />
              <TextField
                id="exercise-variation"
                label="Variation"
                variant="outlined"
                sx={{ minWidth: "100%" }}
                onChange={(e) => {
                  setExerciseData((prevData) => ({
                    ...prevData,
                    variation: e.target.value,
                  }));
                }}
              />

              <Autocomplete
                multiple
                limitTags={2}
                id="activity"
                onChange={(event: any, selectedActivities) =>
                  setExerciseData((prevData) => ({
                    ...prevData,
                    activities: selectedActivities.map((act) => act.id),
                  }))
                }
                options={activities}
                getOptionLabel={(activity) => activity.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Activities"
                    placeholder="Activities"
                  />
                )}
                sx={{ width: "100%" }}
              />
              <FormGroup
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...label}
                      icon={<Icon icon={GiMuscularTorso} />}
                      checkedIcon={<Icon icon={GiMuscularTorso} />}
                      onChange={(e) =>
                        setExerciseData((prevData) => ({
                          ...prevData,
                          bodyweight: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Bodyweight"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...label}
                      icon={<Icon icon={GiStopwatch} />}
                      checkedIcon={<Icon icon={GiStopwatch} />}
                      onChange={(e) =>
                        setExerciseData((prevData) => ({
                          ...prevData,
                          static: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Static"
                />
              </FormGroup>
            </div>
            <div className="flex w-full justify-around ">
              <SiteButton onClick={() => handleSubmit()}>Save</SiteButton>
              <SiteButton onClick={() => show(false)}>Cancel</SiteButton>
            </div>
          </div>
          <div className="flex h-full w-1/2 flex-col">
            {currentMuscle ? (
              <NinjaSuggestions
                muscleName={currentMuscle.name}
                setExerciseData={setExerciseData}
              />
            ) : (
              <p className="mt-10 text-center">Choose muscle group</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;
