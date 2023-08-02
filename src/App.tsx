import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./utils/auth";

import Sidebar from "./components/sidebar/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "./components/Loading";
import { UnauthorizedError, getProtectedData } from "./utils/api";

// const Message = ({ message }) => (
//   <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 bg-slate-500">
//     {message}
//   </div>
// );

const App = () => {
  const { token, setToken, setUserData } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLloadingMessage] = useState("Loading user data...");

  useEffect(() => {
    const fetchUserData = async () => {
      // TODO: fetch sequentially for now, later do asyncronously
      try {
        var data = await getProtectedData("users/me/data", token);
        setLloadingMessage("Loading session data...");
        var sessions = await getProtectedData("sessions/", token);
      } catch (error) {
        // clear token if expired
        if (error instanceof UnauthorizedError) {
          setToken(null);
          localStorage.removeItem("token");
        } else {
          console.log("Error in fetchUserData", error);
        }
      }

      data["sessions"] = sessions;
      setUserData(data);
      setIsLoading(false);
    };

    // fetch user data and login automatically if token cookie on device
    // TODO: decode token to see if is expired
    if (token) fetchUserData();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="h-screen w-screen overflow-y-auto bg-bgprimary text-primary">
        <Navbar />
        {/* {message && <Message message={message} />} */}
        {token ? (
          isLoading ? (
            <Loading message={loadingMessage} />
          ) : (
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
          )
        ) : (
          <LandingPage />
        )}
      </div>
    </LocalizationProvider>
  );
};

export default App;
