# Simple chat helper: starts server if needed and runs interactive REPL
# Run this in a PowerShell terminal from the project root: .\chat.ps1

# Activate virtualenv
& .\.venv\Scripts\Activate.ps1

# Start uvicorn in background, restarting anything already on port 8000
$portUsed = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portUsed) {
    Write-Host "Restarting existing server on port 8000..."
    $existingPid = $portUsed.OwningProcess
    if ($existingPid) { Stop-Process -Id $existingPid -Force }
    Start-Sleep -Seconds 1
}
Write-Host "Starting server in background..."
Start-Process -FilePath .\.venv\Scripts\python.exe -ArgumentList '-m','uvicorn','app:app','--host','127.0.0.1','--port','8000' -WindowStyle Hidden
Start-Sleep -Seconds 2
# wait for /health
for ($i=0; $i -lt 15; $i++) {
    try {
        $h = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/health' -Method GET -ErrorAction Stop
        Write-Host "Server ready: $($h.message)"
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

# Initial bot prompt (ask the user a question)
try {
    $initial = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/chat' -Method POST -ContentType 'application/json' -Body (@{question='hello'} | ConvertTo-Json)
    Write-Host "chatbot:`n$($initial.answer)`n"
} catch {
    Write-Host "chatbot:`n(I couldn't reach the server to get an initial prompt.)`n"
}

# Interactive loop: show 'you:' prompt, send to /chat, print 'chatbot:' reply
while ($true) {
    $user = Read-Host "you"
    if ($user -match '^(exit|quit|bye)$') {
        Write-Host "chatbot:`nGoodbye!`n"
        break
    }
    try {
        $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/chat' -Method POST -ContentType 'application/json' -Body (@{question=$user} | ConvertTo-Json)
        Write-Host "chatbot:`n$($resp.answer)`n"
    } catch {
        Write-Host "chatbot:`n(There was an error contacting the server. Make sure it's running.)`n"
    }
}
