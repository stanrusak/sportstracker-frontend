import React, { useEffect, useState } from "react";
import { getProtectedData } from "../utils/api";
import { useAuth } from "../utils/auth";
import { ResponsiveLine } from "@nivo/line";
import { styleTheme } from "../../styles";
import Loading from "../components/Loading";

interface ExerciseStats {
  [key: string]: { x: string; y: number }[];
}

interface ExerciseData {
  name: string;
  variation: string;
  data: ExerciseStats;
}

const theme = {
  text: {
    fontSize: 11,
    fill: "#fb5b5b",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  axis: {
    legend: {
      text: {
        fontSize: 12,
        fill: styleTheme.colors.primary,
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 14,
        fill: styleTheme.colors.primary,
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: "#e24949",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    text: {
      fontSize: 11,
      fill: styleTheme.colors.primary,
      outlineWidth: 0,
      outlineColor: "transparent",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#333333",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    container: {
      background: "#292929",
      fontSize: 12,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const ChartCard = ({ exercise, metric }) => {
  if (!exercise) return undefined;
  const data =
    metric === "weight"
      ? [
          {
            id: "Max Weight",
            data: exercise.data.max_weight,
          },
          {
            id: "Average Weight",
            data: exercise.data.avg_weight,
          },
        ]
      : [
          {
            id: "Total Volume",
            data: exercise.data.volume,
          },
          {
            id: "Average Volume",
            data: exercise.data.avg_volume,
          },
        ];
  return (
    <div className="relative h-[350px] w-[500px] rounded-xl bg-bgsecondary p-4  shadow-md transition-all duration-300 hover:scale-105">
      <div className="absolute">
        <h2 className="text-xl">{exercise.name}</h2>
        <h3>{exercise.variation}</h3>
      </div>
      <ResponsiveLine
        theme={theme}
        data={data}
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Time",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: metric === "weight" ? "Weight (kg)" : "Volume (kg)",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        lineWidth={5}
        pointSize={9}
        pointColor={{ from: "color", modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        // enableArea={true}
        useMesh={true}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: -5,
            translateY: -45,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

const Statistics = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ExerciseData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const response = await getProtectedData<ExerciseData[]>(
        "sessions/stats",
        token,
      );
      // console.log(response);
      setData(response);
    };
    getData();
  }, []);

  return (
    <div className="">
      {isLoading ? (
        <Loading message="Loading stats..." />
      ) : (
        <div className="flex">
          <div className="mx-5 h-[700px]">
            <h2 className="text-2xl font-semibold">Exercise</h2>
            <div className="scrollbar h-[650px] overflow-auto">
              {data.map((exercise, idx) => (
                <div
                  onClick={() => setSelectedExercise(idx)}
                  className={`${
                    idx === selectedExercise
                      ? "border-accent"
                      : "border-transparent"
                  } m-2 w-[200px] cursor-pointer rounded-xl border-2 bg-bgsecondary p-2 shadow-xl hover:scale-105`}
                >
                  <h4>{exercise.name}</h4>
                  <h5>{exercise.variation}</h5>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-[700px] flex-col gap-2">
            <ChartCard exercise={data[selectedExercise]} metric="weight" />
            <ChartCard exercise={data[selectedExercise]} metric="volume" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
