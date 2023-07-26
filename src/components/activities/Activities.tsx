import { useEffect, useState } from "react";
import { getProtectedData } from "../../utils/api";
import { SiteButton } from "../layout/Layout";
import { ActivityType } from "../../types";
import activityImages from "../../assets/activities";

const Activities = () => {
  const [activities, setActivities] = useState<ActivityType[]>();
  useEffect(() => {
    const getActivities = async () => {
      const activities = await getProtectedData<ActivityType[]>(
        "activities",
        "",
      );
      setActivities(activities);
    };

    getActivities();
  });
  return (
    <div>
      <section>
        <div className="">
          <h1 className="my-2 text-xl font-semibold">My Activities</h1>
          <SiteButton
            onClick={(e) => {
              e.target.innerHTML = "Not implemented yet :)";
            }}
          >
            New Activity
          </SiteButton>
        </div>
        {/* {showCreateNewExercise && (
          <CreateExercise show={setShowCreateNewExercise} />
        )} */}
        <div className="mt-2 flex flex-wrap gap-4">
          {activities?.map((activity) => (
            <div
              key={`activity-${activity.id}`}
              className="flex w-[200px] flex-col rounded-xl  bg-white shadow-md transition-all duration-300 hover:scale-105"
            >
              <img
                src={activityImages[activity.name]}
                className="h-[100px] rounded-t-xl object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{activity.name}</h3>
                <h4 className="text-xs font-extralight">
                  {activity.description || "standard"}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Activities;
