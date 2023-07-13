import { useState } from "react";
import Auth from "../components/Auth";
import splash from "../assets/splash.png";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <>
      <div className="w-full h-full flex justify-center items-center gap-8    ">
        <div className="w-[450px] flex flex-col gap-2">
          <h1 className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">
            Sports tracker
          </h1>
          <h2 className="text-xl font-semibold">
            Ensure consistent and balanced training. Track your progress with
            tests. Benefit from a personal AI trainer leveraging the power of
            GPT-4.
          </h2>
          <button
            onClick={() => setShowAuth(true)}
            className="w-[200px] h-[40px] mt-8 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-bold text-white shadow-sm"
          >
            Sign up now
          </button>
        </div>
        <img src={splash} />
      </div>
      {/* {showAuth && <Auth />} */}
    </>
  );
};

export default LandingPage;
