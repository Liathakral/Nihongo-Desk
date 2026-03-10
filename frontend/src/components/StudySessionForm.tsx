
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
    
    <div className="  flex items-center justify-center  w-full  ">
 <div className="
     
    w-[50%]
      rounded-3xl
      shadow-md
      border border-[#ece9e1]
      p-8 
      text-center
    ">     
     
      <div className="text-6xl font-bold text-avocado-smoothie mb-8 tracking-wide">
        {formatTime()}
      </div>

      

      {/* Time bucket */}
      <div className="mb-6 text-left">
        <label className="text-sm text-gray-500 mb-1 block">
          Time of day
        </label>

        <select
          className="
          w-full
          border border-gray-200
          rounded-xl
          cursor-pointer
          p-3
          bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-savory-sage
          "
          value={timeBucket}
          onChange={(e) => setTimeBucket(e.target.value)}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>

      {/* Buttons */}

      {!isRunning ? (
        <button
          onClick={handleStart}
          className="
          w-full
          bg-avocado-smoothie
          text-white
          py-3
          rounded-xl
          text-lg
          font-semibold
          hover:opacity-90
          transition
          cursor-pointer
          "
        >
          Start Study Session
        </button>
      ) : (
        <button
          onClick={handleEnd}
          className="
          w-full
          bg-rose-500
          text-white
          py-3
          rounded-xl
          text-lg
          font-semibold
          hover:opacity-90
          transition
          cursor-pointer
          "
        >
          End Session
        </button>
      )}
    </div>
    </div>
  );
}
