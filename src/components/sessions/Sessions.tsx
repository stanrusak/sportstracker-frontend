import { useState } from "react";
import { useAuth } from "../../utils/auth";
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
    <div className="flex h-full w-[350px] flex-col rounded-xl  bg-bgsecondary  shadow-md transition-all duration-300 hover:scale-105">
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
                  {aggregateData.map((exercise, exIdx) => (
                    <div key={`exercise-${session.id}-${exIdx}`}>
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
  const { userData } = useAuth();
  const activitiesById = userData.activities.reduce(
    (result: { [key: number]: ActivityType }, item: ActivityType) => {
      result[item.id] = item;
      return result;
    },
    {},
  );

  console.log(activitiesById);
  // group sessions by date
  const sessions = userData.sessions.reduce(
    (result: { [key: string]: SessionType[] }, item: SessionType) => {
      if (!result[item.date]) {
        result[item.date] = [];
      }
      result[item.date].push({
        ...item,
        activity: activitiesById[item.activity_id]?.name,
      });
      return result;
    },
    {},
  );

  const [selectedDate, setSelectedDate] = useState(
    Object.keys(sessions).length === 0 ? null : Object.keys(sessions)[0],
  );
  const [showCreateNewSession, setShowCreateNewSession] = useState(false);

  const latestDate = Object.keys(sessions).length
    ? Object.keys(sessions)[0]
    : undefined;
  console.log(sessions);
  return (
    <section className="">
      <div className="">
        <h1 className="my-2 text-xl font-semibold">Sessions</h1>
        <SiteButton onClick={() => setShowCreateNewSession(true)}>
          New Training Session
        </SiteButton>
      </div>
      {showCreateNewSession && <CreateSession show={setShowCreateNewSession} />}
      {!!Object.keys(sessions).length && (
        <div className="mt-2 flex">
          <SelectedWorkoutDay
            date={selectedDate}
            dateSessions={sessions[selectedDate]}
            latest={selectedDate === latestDate}
          />
          <div className="flex flex-col gap-1">
            <h5 className="mx-4 font-semibold">Latest workouts</h5>
            {Object.entries(sessions)
              .slice(0, 5)
              .map(([date, dateSessions]) => (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={` mx-2 flex w-[140px] cursor-pointer flex-col rounded-xl border-2 border-accent ${
                    date === selectedDate
                      ? "bg-accent text-white"
                      : "bg-bgsecondary text-slate-200"
                  } p-4 shadow-md transition-all duration-300 hover:scale-105`}
                >
                  <h4 className="text-sm font-semibold">
                    {dayjs(date).format("dddd DD/MM")}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dateSessions.map((dateSession, idx) => (
                      <span
                        key={`date-${idx}`}
                        className="rounded-full bg-red-400 px-2 text-xs"
                      >
                        {dateSession.activity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Sessions;
