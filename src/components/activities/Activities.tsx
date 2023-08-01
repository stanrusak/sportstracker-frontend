import { useEffect, useState } from "react";
import { getProtectedData, mutateProtectedData } from "../../utils/api";
import { SiteButton } from "../layout/Layout";
import { ActivityType } from "../../types";
import activityImages from "../../assets/activities";
import { useAuth } from "../../utils/auth";

const ActivityCard = ({
  activity,
  userActivities = [],
  setUserActivities = () => {},
}) => {
  const [selected, setSelected] = useState(
    userActivities?.includes(activity.id),
  );

  const handleSelect = () => {
    const newSelected = [...userActivities];
    if (selected) {
      setUserActivities(newSelected.filter((id) => id !== activity.id));
    } else {
      setUserActivities([...newSelected, activity.id]);
    }
    setSelected((prev) => !prev);
  };
  return (
    <div
      onClick={() => handleSelect()}
      className={`${
        selected ? " border-accent" : "border-transparent"
      } m-1 flex w-[200px] flex-col rounded-xl border-2 bg-bgsecondary shadow-md transition-all duration-300 hover:scale-105`}
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
  );
};

const AddActivity = ({ show }) => {
  const { token, userData, setUserData } = useAuth();
  const [userActivities, setUserActivities] = useState(
    userData.activities.map((activity) => activity.id),
  );
  const [activities, setActivities] = useState([]);

  const getData = async () => {
    setActivities(await getProtectedData("activities", ""));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (userActivities.length > 0) {
      var response = await mutateProtectedData(
        "users/me/activities",
        userActivities,
        token,
        "PATCH",
      );
    }
    setUserData((oldData) => ({ ...oldData, activities: response.activities }));
    show(false);
  };
  return (
    <div
      className={`rounded-2xln absolute left-1/2 top-1/2 flex w-[96vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 border-blue-500 bg-bgsecondary shadow-md sm:w-[550px] md:w-[680px]`}
    >
      <div className="relative w-full">
        <button onClick={() => show(false)} className="absolute right-2">
          x
        </button>
      </div>
      <div className="m-4 flex w-full flex-grow flex-col">
        <h1 className="m-4 text-2xl font-bold">Select activities</h1>
        <div className="flex w-full justify-center">
          <div className="flex w-[95%] flex-wrap">
            {activities.map((activity, idx) => (
              <ActivityCard
                key={`select-activity-${idx}`}
                activity={activity}
                userActivities={userActivities}
                setUserActivities={setUserActivities}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <SiteButton onClick={() => handleSave()}>Save</SiteButton>
      </div>
    </div>
  );
};

const Activities = () => {
  const { userData } = useAuth();
  const activities = userData.activities;
  const [showAddActivity, setShowAddActivity] = useState(false);

  return (
    <section className="w-[680px]">
      <div className="">
        <h1 className="my-2 text-xl font-semibold">My Activities</h1>
        <SiteButton
          onClick={(e) => {
            setShowAddActivity(true);
          }}
        >
          Add Activities
        </SiteButton>
      </div>
      {showAddActivity && <AddActivity show={setShowAddActivity} />}
      <div className="mt-2 flex flex-wrap gap-4">
        {activities?.map((activity) => (
          <ActivityCard key={`activity-${activity.id}`} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default Activities;
