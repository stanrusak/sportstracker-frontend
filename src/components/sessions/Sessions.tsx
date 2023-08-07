import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useWorkoutData } from "../../context/workouts";
import { SiteButton } from "../layout/Layout";
import { ActivityType } from "../../types/workouts";
import CreateSession from "./NewSession";
import activityImages from "../../assets/activities";
import dayjs from "dayjs";

import { getAggregateSessionData } from "./utils";

const SelectedWorkoutDay = ({ date, dateSessions, latest }) => {
  if (date === "") return <div>Loading...</div>;
  const dateString = dayjs(date).format("dddd DD/MM/YYYY");

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
  const [showCreateNewSession, setShowCreateNewSession] = useState(false);

  const { userData } = useAuth();
  const { allActivities, allMuscles } = useWorkoutData();
  // group activities by id
  const activitiesById = allActivities.reduce(
    (result: { [key: number]: ActivityType }, item: ActivityType) => {
      result[item.id] = item;
      return result;
    },
    {},
  );

  // group sessions by date
  if (userData === null) return <p>Error</p>;
  const sessions = userData.sessions.reduce((result, session) => {
    const { date, ...rest } = session;
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push({
      ...session,
      activity: activitiesById[session.activity_id]?.name,
    });
    return result;
  }, {});

  const latestDate = Object.keys(sessions).length
    ? Object.keys(sessions)[0]
    : undefined;

  const [selectedDate, setSelectedDate] = useState(latestDate);
  // useEffect(() => {
  //   if (Object.keys(sessions).length === 0) return;
  //   setSelectedDate(latestDate);
  // }, [sessions]);

  return (
    <section className="">
      <div className="">
        <h1 className="my-2 text-xl font-semibold">Sessions</h1>
        <SiteButton onClick={() => setShowCreateNewSession(true)}>
          New Training Session
        </SiteButton>
      </div>
      {showCreateNewSession && (
        <CreateSession
          show={setShowCreateNewSession}
          setSelectedDate={setSelectedDate}
        />
      )}
      {!!Object.keys(sessions).length && (
        <div className="mt-2 flex">
          <SelectedWorkoutDay
            date={selectedDate}
            dateSessions={selectedDate ? sessions[selectedDate] : undefined}
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
