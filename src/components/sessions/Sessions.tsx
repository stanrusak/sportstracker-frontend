import { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { getProtectedData } from "../../utils/api";
import CreateSession from "./NewSession";
import { SiteButton } from "../layout/Layout";

interface SessionType {
  id: number;
  user_id: number;
  activity_id: number;
  date: string;
  session_data: object;
}

const Sessions = () => {
  const { token, setToken } = useAuth();
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [showCreateNewSession, setShowCreateNewSession] = useState(false);

  const getSessions = async (token: string | null) => {
    try {
      const data = await getProtectedData<SessionType[]>("sessions", token);
      setSessions(data);
    } catch (error) {
      // clear token if expired
      if (error instanceof Error && error.message === "401: Unauthorized") {
        setToken(null);
        localStorage.removeItem("token");
      } else {
        console.log("Error in getSessions:", error);
      }
    }
  };

  useEffect(() => {
    getSessions(token);
  }, []);
  return (
    <section>
      <div className="">
        <h1 className="w-[800px] text-xl font-semibold">Sessions</h1>
        <SiteButton onClick={() => setShowCreateNewSession(true)}>
          New Training Session
        </SiteButton>
      </div>
      {showCreateNewSession && <CreateSession show={setShowCreateNewSession} />}
      <div>
        {sessions.map((session) => (
          <div key={session.id}>
            <h2>Session {session.id}</h2>
            <span>Activity: {session.activity_id}</span>
            <span>Data: {session.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sessions;
