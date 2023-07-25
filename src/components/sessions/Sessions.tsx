import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { getProtectedData } from "../../utils/api";
import CreateSession from "./NewSession";
import { SiteButton } from "../layout/Layout";
import dayjs from "dayjs";
import { ActivityType } from "../../types";
import activityImages from "../../assets/activities";

interface SessionType {
  id: number;
  user_id: number;
  activity_id: number;
  date: string;
  session_data: object;
  activity?: string;
}

const SelectedWorkoutDay = ({ date, dateSessions, latest }) => {
  if (date === "") return <div>Loading...</div>;

  const dateString = dayjs(date).format("dddd DD/MM/YYYY");

  const getAggregateExerciseData = (setData) => {
    let max = 0;
    let volume = 0;
    setData.forEach((set) => {
      max = Math.max(max, set.weight);
      volume += set.weight * set.reps;
    });
    return { max, volume };
  };

  const getAggregateSessionData = (sessionData) => {
    return sessionData["exercises"].map((exercise) => ({
      name: exercise.name,
      ...getAggregateExerciseData(exercise.sets),
    }));
  };

  return (
    <div className="flex h-full w-[350px] flex-col rounded-xl border-2 bg-white  shadow-md transition-all duration-300 hover:scale-105">
      <img
        src={activityImages[dateSessions[0].activity]}
        className="rounded-t-xl"
      />
      <div className="flex h-full flex-col p-4">
        {latest && <h1>Last workout day</h1>}
        <h2 className="text-2xl font-bold">{dateString}</h2>
        <div className="scrollbar mb-4 mt-2 h-[150px] overflow-y-auto">
          {dateSessions.map((session) => {
            const aggregateData = getAggregateSessionData(session.session_data);
            return (
              <div key={`session-${session.id}`}>
                <h3 className="font-semibold">{session.activity}</h3>
                <div className="flex flex-col px-2">
                  {aggregateData.map((exercise) => (
                    <div key={`exercise-${session.id}-${exercise.name}`}>
                      <h4>{exercise.name}</h4>
                      <span className="text-xs">
                        Max: {exercise.max} | Volume: {exercise.volume}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Sessions = () => {
  const { token, setToken } = useAuth();
  // const [activities, setActivities] = useState<{ [id: number]: ActivityType }>(
  //   [],
  // );
  const [sessions, setSessions] = useState<{ [date: string]: SessionType[] }>(
    {},
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [showCreateNewSession, setShowCreateNewSession] = useState(false);

  const getSessions = async (token: string | null) => {
    try {
      // get activities
      const activityData = await getProtectedData<ActivityType[]>(
        "activities",
        "",
      );
      // store as an id => object map for faster lookup
      const activitiesById = activityData.reduce(
        (result: { [key: number]: ActivityType }, item: ActivityType) => {
          result[item.id] = item;
          return result;
        },
        {},
      );
      // setActivities(activitiesById);

      const sessionData = await getProtectedData<SessionType[]>(
        "sessions",
        token,
      );

      const sessionsByDate = sessionData
        .slice(0, 15)
        .reduce(
          (result: { [key: string]: SessionType[] }, item: SessionType) => {
            if (!result[item.date]) {
              result[item.date] = [];
            }
            result[item.date].push({
              ...item,
              activity: activitiesById[item.activity_id].name,
            });
            return result;
          },
          {},
        );

      setSessions(sessionsByDate);
      setSelectedDate(Object.keys(sessionsByDate)[0]);
    } catch (error) {
      // clear token if expired
      if (error instanceof Error && error.message === "401: Unauthorized") {
        setToken(null);
        localStorage.removeItem("token");
      } else {
        console.log("Error in getSessions:", error);
      }
    }
  };

  useEffect(() => {
    getSessions(token);
  }, [showCreateNewSession]);
  if (Object.keys(sessions).length === 0) {
    return <div>Loading...</div>;
  }

  const latestDate = Object.keys(sessions)[0];

  return (
    <section className="h-full">
      <div className="">
        <h1 className="my-2 text-xl font-semibold">Sessions</h1>
        <SiteButton onClick={() => setShowCreateNewSession(true)}>
          New Training Session
        </SiteButton>
      </div>
      {showCreateNewSession && <CreateSession show={setShowCreateNewSession} />}
      <div className="mt-2 flex">
        <SelectedWorkoutDay
          date={selectedDate}
          dateSessions={sessions[selectedDate]}
          latest={selectedDate === latestDate}
        />
        <div className="flex flex-col gap-1">
          <h5 className="mx-4 font-semibold">Latest workouts</h5>
          {Object.entries(sessions).map(([date, dateSessions]) => (
            <div
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`mx-2 flex w-[220px] cursor-pointer flex-col rounded-xl border-2 ${
                date === selectedDate
                  ? "bg-primary text-white"
                  : "bg-white text-slate-800"
              } p-4 shadow-md transition-all duration-300 hover:scale-105`}
            >
              <h4 className="text-sm font-semibold">
                {dayjs(date).format("dddd DD/MM")}
              </h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {dateSessions.map((dateSession, idx) => (
                  <span
                    key={`date-${idx}`}
                    className="rounded-full bg-blue-300 px-2 text-xs"
                  >
                    {dateSession.activity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sessions;
