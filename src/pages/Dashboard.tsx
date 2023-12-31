import React from "react";
import Activities from "../components/activities/Activities";
import Exercises from "../components/exercises/Exercises";
import Sessions from "../components/sessions/Sessions";

const Dashboard = () => {
  return (
    <div className="flex gap-10">
      <Sessions />
      <Activities />
      <Exercises />
    </div>
  );
};

export default Dashboard;
