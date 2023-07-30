import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./utils/auth";

import Sidebar from "./components/sidebar/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  const { token, setUserData } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    setUserData({ activities: [1, 2], exercises: [1, 3, 4] });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="h-screen w-screen overflow-y-auto bg-bgprimary-default text-primary">
        <Navbar />
        {token ? (
          <div className="flex h-full w-full overflow-x-hidden pt-navbar">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="ml-6 flex h-full flex-col px-[100px]">
              <h1 className="mt-6 text-4xl font-extrabold leading-relaxed">
                {activePage}
              </h1>
              <div className="flex gap-4">
                {activePage === "Dashboard" && <Dashboard />}
              </div>
            </div>
          </div>
        ) : (
          <LandingPage />
        )}
      </div>
    </LocalizationProvider>
  );
};

export default App;
