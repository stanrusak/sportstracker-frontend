export interface MuscleType {
  id: number;
  name: string;
  area: string;
}

export interface ActivityType {
  id: number;
  name: string;
  description: string;
}

export interface ExerciseType {
  id: number;
  name: string;
  variation: string;
  muscle_groups: MuscleType[];
  activities: ActivityType[];
}

interface SessionType {
  id: number;
  user_id: number;
  activity_id: number;
  date: string;
  session_data: object;
  activity?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  activities: ActivityType[];
  exercises: ExerciseType[];
  sessions: SessionType[];
  data: {};
  time_created: string;
  time_updated: string;
}
