# Giai phong cac cong dev thuong dung (Next / Nest). Chay: powershell -ExecutionPolicy Bypass -File scripts/kill-dev-ports.ps1
$ErrorActionPreference = "SilentlyContinue"
$ports = @(3000, 3001, 3002, 4000)
$seen = [System.Collections.Generic.HashSet[int]]::new()

foreach ($prt in $ports) {
  Get-NetTCPConnection -LocalPort $prt -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    [void]$seen.Add($_.OwningProcess)
  }
}

if ($seen.Count -eq 0) {
  Write-Host "Khong co process LISTENING tren cac cong: $($ports -join ', ')."
  exit 0
}

Write-Host "Dang tat PID: $($seen -join ', ')"
foreach ($procId in $seen) {
  try {
    Stop-Process -Id $procId -Force
    Write-Host "  OK stopped PID $procId"
  }
  catch {
    Write-Host "  Khong stop duoc PID ${procId}: $_"
  }
}
