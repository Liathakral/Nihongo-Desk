// LogsContext.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const BASE_URL = "https://nihongo-desk-production.up.railway.app"

interface LogEntry {
  timestamp: string
  message: string
  level: string
  progress?: number | null
}

interface LogsContextType {
  logs: LogEntry[]
  addLog: (log: LogEntry) => void
  clearLogs: () => void
  loadJob:(jobid:string)=>void
}

const LogsContext = createContext<LogsContextType | null>(null)

let eventSource: EventSource | null = null
let connectedJobId: string | null = null

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  function addLog(log: LogEntry) {
    setLogs(prev => [...prev, log])
  }

  function clearLogs() {
    setLogs([])
  }

  async function loadJob(jobId: string) {
    if (!jobId) return
    if (connectedJobId === jobId) return

    connectedJobId = jobId
    eventSource?.close()
    eventSource = null
    setLogs([])

    // Fetch history
    try {
      const res = await fetch(`${BASE_URL}/logs/${jobId}/history`, {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        data.logs?.forEach((log: LogEntry) => {
          setLogs(prev => [...prev, log])
        })
      }
    } catch (e) {
      console.error("History fetch failed:", e)
    }

    // Open SSE
    eventSource = new EventSource(`${BASE_URL}/logs/${jobId}`, {
      withCredentials: true,
    })
    eventSource.addEventListener("log", (event) => {
      try {
        const log: LogEntry = JSON.parse(event.data)
        setLogs(prev => [...prev, log])
      } catch {}
    })
    eventSource.onerror = () => {
      eventSource?.close()
      eventSource = null
      connectedJobId = null
    }
  }

  // ✅ Auto-restore on app boot — runs before any page mounts
  useEffect(() => {
    const savedJobId = localStorage.getItem("lastJobId")
    if (savedJobId) loadJob(savedJobId)
  }, [])

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs, loadJob }}>
      {children}
    </LogsContext.Provider>
  )
}

export function useLogs() {
  const ctx = useContext(LogsContext)
  if (!ctx) throw new Error("useLogs must be used inside LogsProvider")
  return ctx
}