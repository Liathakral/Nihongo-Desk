
import { useState, useEffect, useRef } from "react";
import api from "../api/client";
interface Props {
  onSessionCreated?: (id: number) => void;
}

export default function StudySessionForm({
  onSessionCreated,
}: Props) {
const [isRunning, setIsRunning] = useState(false);
const [seconds, setSeconds] = useState(0);
const [startTime, setStartTime] = useState<Date | null>(null);
const [skillType, setSkillType] = useState("reading");
const [timeBucket, setTimeBucket] = useState("morning");
const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setStartTime(new Date());
    setSeconds(0);
    setIsRunning(true);
  };

  const handleEnd = async () => {
    if (!startTime) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(seconds / 60);

    setIsRunning(false);

    const res= await api.post("/sessions/", {
      skill_type: skillType,
      started_at: startTime,
      ended_at: endTime,
      duration_minutes: durationMinutes,
      time_of_day_bucket: timeBucket ,
    });
    const sessionId = res.data.id;
    console.log("SESSION RESPONSE:", res.data);
    console.log("Calling onSessionCreated with:", sessionId);
    if (onSessionCreated) {
  onSessionCreated(sessionId);
}
    alert("Session saved!");
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white p-6  rounded-2xl border border-oat-latte shadow-sm w-4/6 text-center">
      <div className="text-4xl font-semibold text-savory-sage mb-6">
        {formatTime()}
      </div>
       <select
        className="border border-oat-latte p-2 text-black rounded-lg mb-4 w-full"
        value={skillType}
        onChange={(e) => setSkillType(e.target.value)}

      >
        <option value="reading">Reading</option>
        <option value="grammar">Grammar</option>
        <option value="vocab">Vocabulary</option>
         <option value="listening">Listening</option>
      </select>
         
       <select
        className="border border-oat-latte p-2 text-black rounded-lg mb-4 w-full"
        value={timeBucket}
        onChange={(e) => setTimeBucket(e.target.value)}

      >
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
         <option value="night">Night</option>
  
      </select>
     
      {!isRunning ? (
        <button
          onClick={handleStart}
          className="bg-savory-sage text-white px-6 py-2 rounded-xl"
        >
          Start Session
                 

        </button>
      ) : (
        <button
          onClick={handleEnd}
          className="bg-blush-beet text-white px-6 py-2 rounded-xl"
        >
          End Session
        </button>
      )}
    </div>
  );
}

// function getTimeBucket(date: Date) {
//   const hour = date.getHours();

//   if (hour < 12) return "morning";
//   if (hour < 17) return "afternoon";
//   if (hour < 21) return "evening";
//   return "night";
// }
