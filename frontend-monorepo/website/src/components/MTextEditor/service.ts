// service.ts

const serviceApiBase = import.meta.env.VITE_APP_SERVICE_V2_ABS_API_URL

/**
 * Initiates code execution via API and returns execution info.
 * @param language The programming language (e.g., 'python', 'js')
 * @param code The code to execute
 * @param isStatic Whether the code is static (affects execution mode)
 * @returns Promise<{ execution_id: string, status: string, message: string }>
 */
export async function executeCode(
  language: string,
  code: string,
  isStatic: boolean,
): Promise<{ execution_id: string; status: string; message: string }> {
  // Replace with your real API endpoint
  const response = await fetch(`${serviceApiBase}/api/v1/executions/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, is_static: isStatic }),
  })
  if (!response.ok) throw new Error('Failed to start code execution')
  return await response.json()
}

/**
 * Waits for code execution to complete and returns the result.
 * @param execution_id The ID of the execution to wait for
 * @param intervalMs Polling interval in ms
 * @returns Promise<{ status: string, message: string, output?: string }>
 */
export async function readCodeStatus(
  execution_id: string,
): Promise<{ status: string; message: string; output?: string }> {
  const response = await fetch(`${serviceApiBase}/api/v1/executions/status/${execution_id}`)
  if (!response.ok) throw new Error('Failed to start code execution')
  return await response.json()
}
