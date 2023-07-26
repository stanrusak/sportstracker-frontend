import Auth from "../components/Auth";
import splash from "../assets/splash.png";

const LandingPage = () => {
  return (
    <>
      <div className="flex h-full w-full items-center justify-center gap-8">
        <div className="flex w-[450px] flex-col gap-2">
          <h1 className="bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-6xl font-extrabold text-transparent">
            Sports tracker
          </h1>
          <h2 className="text-xl font-semibold">
            Ensure consistent and balanced training. Track your workout
            sessions. Monitor your progress with tests*. Benefit from a personal
            AI trainer leveraging the power of GPT-4*.
          </h2>
          <button
            onClick={() => (window.location.href = "#signup")}
            className="mt-8 h-[40px] w-[200px] rounded-xl bg-gradient-to-r from-purple-600 to-red-600 font-bold text-white shadow-sm"
          >
            Sign up now
          </button>
          <span className="text-xs">* Not yet implemented</span>
        </div>
        <img className="w-[800px]" src={splash} />
      </div>
      <Auth />
    </>
  );
};

export default LandingPage;
