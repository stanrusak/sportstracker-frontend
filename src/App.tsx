import { Navbar } from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./utils/auth";
import Dashboard from "./pages/Dashboard";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  const { token } = useAuth();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="h-screen w-screen overflow-x-hidden ">
        <Navbar />
        {token ? <Dashboard /> : <LandingPage />}
      </div>
    </LocalizationProvider>
  );
};

export default App;
