"use client"

import { useLogs } from "../../context/LogsContext"
import { useEffect, useRef } from "react"

export default function Logger() {

  const { logs } = useLogs()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])
  const progress = logs.length
    ? logs[logs.length - 1]?.progress ?? 0
    : 0

  return (

    <div className=" border border-gray-700 rounded-xl p-9 shadow-lg  w-full overflow-y-auto font-mono text-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-500 font-bold">Job Console</h2>

        <div className="flex gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"/>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"/>
          <span className="w-3 h-3 bg-green-500 rounded-full"/>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded mb-4 h-2 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Logs */}
      <div className="space-y-1">

        {logs.map((log, i) => {

        
          return (
              <div key={i} className="flex gap-4 font-mono text-sm">

    <span className="text-gray-500 w-20">
      {new Date(log.timestamp).toLocaleTimeString()}
    </span>

    <span className={`w-16 font-semibold`}>
      {log.level}
    </span>

    <span className="text-gray-300">
      {log.message}
    </span>

  </div>
          )
        })}

        <div ref={bottomRef}></div>

      </div>

    </div>
  )
}