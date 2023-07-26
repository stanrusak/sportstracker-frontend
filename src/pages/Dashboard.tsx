import Activities from "../components/activities/Activities";
import Exercises from "../components/exercises/Exercises";
import Sessions from "../components/sessions/Sessions";

const Dashboard = () => {
  return (
    <div className="flex flex-col bg-bglight px-[100px] pt-[80px]">
      <h1 className="text-3xl font-extrabold leading-relaxed">Dashboard</h1>
      <div className="flex gap-4">
        <Sessions />
        <Activities />
      </div>
      <Exercises />
    </div>
  );
};

export default Dashboard;
