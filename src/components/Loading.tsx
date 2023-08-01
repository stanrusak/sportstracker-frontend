const Loading = ({ message = "Loading...", color = "primary" }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        preserveAspectRatio="xMidYMid"
        // style="margin:auto;background:0 0;display:block;shape-rendering:auto"
        viewBox="0 0 100 100"
        className="stroke-current text-accent"
      >
        <circle
          cx="50"
          cy="50"
          r="25"
          fill="none"
          //   stroke="#4996a2"
          strokeDasharray="117.80972450961724 41.269908169872416"
          strokeWidth="6"
        >
          <animateTransform
            attributeName="transform"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 50 50;360 50 50"
          />
        </circle>
      </svg>
      <h1 className={`text-xl font-semibold text-${color}`}>{message}</h1>
    </div>
  );
};

export default Loading;
