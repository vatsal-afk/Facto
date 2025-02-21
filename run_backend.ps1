# Ensure the script exits immediately if a command fails
$ErrorActionPreference = "Stop"

# Navigate to the virtual environment directory and activate it
Write-Host "Activating virtual environment..."
. .\streaming\venv\Scripts\Activate.ps1

# Navigate to the backend directory (if necessary)
Set-Location -Path (Join-Path (Get-Location) "backend")

# Run the Python scripts concurrently
Write-Host "Running bills-conventions.py..."
$process1 = Start-Process python .\bills-conventions.py

Write-Host "Running graph-analysis.py..."
$process2 = Start-Process python .\graph-analysis.py

Write-Host "Running reddit-posts.py..."
$process3 = Start-Process python .\reddit-posts.py

# Navigate back to the streaming directory
Set-Location -Path (Join-Path (Get-Location) "..\streaming")

Write-Host "Running server.js..."
$process4 = Start-Process node .\server.js

Write-Host "Running app.py..."
$process5 = Start-Process python .\app.py

# Wait for all processes to complete
Write-Host "Waiting for all processes to finish..."
$allProcesses = @($process1, $process2, $process3, $process4, $process5)
$allProcesses | ForEach-Object { $_.WaitForExit() }

Write-Host "All scripts executed successfully!"

# Deactivate the virtual environment
Deactivate
