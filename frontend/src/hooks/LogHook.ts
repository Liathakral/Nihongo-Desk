// LogHook.ts
import { useLogs } from "../context/LogsContext"

export function useJobLogs() {
  const { loadJob } = useLogs()

  async function connectLogs(jobId: string) {
    if (!jobId) return
    localStorage.setItem("lastJobId", jobId)
    await loadJob(jobId)
  }

  return { connectLogs }
}