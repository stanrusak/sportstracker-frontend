import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./utils/auth";

const App = () => {
  const { token } = useAuth();

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/users/")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="h-screen w-screen overflow-x-hidden ">
      <Navbar />
      {token ? (
        <p className="mx-auto mt-[100px]">Hello I am a token</p>
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

export default App;
