<#
.SYNOPSIS
  Deep Dive Material Regression Validation Script
.DESCRIPTION
  Checks all _intermediate.html and _deep.html files for:
  1. {{RUNTIME}} placeholder residuals
  2. initPage function existence
  3. rel="preconnect" residuals (file:// compatibility)
  4. activeCharts declared BEFORE savedTheme (variable ordering)
#>

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $ScriptDir

$PassCount = 0
$FailCount = 0
$Failures = @()

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Deep Dive Validation Suite" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# ---- Check 1: {{RUNTIME}} placeholder ----
Write-Host "[Check 1] {{RUNTIME}} placeholder residuals" -ForegroundColor Yellow
$runtimeFiles = Select-String -Path "*_intermediate.html","*_deep.html" -Pattern '\{\{RUNTIME\}\}' -SimpleMatch -List

if (-not $runtimeFiles) {
    Write-Host "  PASS - 0 files with {{RUNTIME}}" -ForegroundColor Green
    $PassCount++
} else {
    Write-Host "  FAIL - files with {{RUNTIME}}:" -ForegroundColor Red
    foreach ($f in $runtimeFiles) {
        Write-Host "    - $($f.Filename)" -ForegroundColor Red
        $Failures += "$($f.Filename): RUNTIME residual"
    }
    $FailCount++
}

# ---- Check 2: initPage function existence ----
Write-Host "[Check 2] initPage function presence" -ForegroundColor Yellow
$allHtmlFiles = @(Get-ChildItem "*_intermediate.html","*_deep.html")
$missingInitPage = @()

foreach ($file in $allHtmlFiles) {
    $hasInitPage = Select-String -Path $file.FullName -Pattern 'function initPage' -Quiet
    if (-not $hasInitPage) {
        $missingInitPage += $file.Name
    }
}

if ($missingInitPage.Count -eq 0) {
    $n = $allHtmlFiles.Count
    Write-Host "  PASS - ${n}/${n} files have initPage" -ForegroundColor Green
    $PassCount++
} else {
    Write-Host "  FAIL - missing initPage:" -ForegroundColor Red
    foreach ($f in $missingInitPage) {
        Write-Host "    - $f" -ForegroundColor Red
        $Failures += "${f}: missing initPage"
    }
    $FailCount++
}

# ---- Check 3: rel="preconnect" residuals ----
Write-Host "[Check 3] rel=preconnect residuals (file:// compat)" -ForegroundColor Yellow
$preconnectFiles = Select-String -Path "*_intermediate.html","*_deep.html","ml_learning.html" -Pattern 'rel="preconnect"' -SimpleMatch -List

if (-not $preconnectFiles) {
    Write-Host "  PASS - 0 files with preconnect" -ForegroundColor Green
    $PassCount++
} else {
    Write-Host "  FAIL - preconnect found:" -ForegroundColor Red
    foreach ($f in $preconnectFiles) {
        Write-Host "    - $($f.Filename)" -ForegroundColor Red
        $Failures += "$($f.Filename): preconnect residual"
    }
    $FailCount++
}

# ---- Check 4: activeCharts BEFORE savedTheme ----
# Correct order: var activeCharts = {}; ... var savedTheme = ... applyTheme(savedTheme);
Write-Host "[Check 4] activeCharts before savedTheme init" -ForegroundColor Yellow
$badOrderFiles = @()

foreach ($file in $allHtmlFiles) {
    $lines = Get-Content -Path $file.FullName
    $activeChartsLine = -1
    $savedThemeLine = -1
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($activeChartsLine -eq -1 -and $lines[$i] -match '^\s*var activeCharts\s*=') {
            $activeChartsLine = $i
        }
        if ($savedThemeLine -eq -1 -and $lines[$i] -match '^\s*var savedTheme\s*=') {
            $savedThemeLine = $i
        }
    }
    
    # activeCharts must exist, and if savedTheme exists it must come after activeCharts
    if ($activeChartsLine -ge 0 -and $savedThemeLine -ge 0 -and $activeChartsLine -gt $savedThemeLine) {
        $a = $activeChartsLine + 1
        $s = $savedThemeLine + 1
        $badOrderFiles += "$($file.Name) (activeCharts at L${a}, savedTheme at L${s})"
    }
}

if ($badOrderFiles.Count -eq 0) {
    $n = $allHtmlFiles.Count
    Write-Host "  PASS - ${n} files correct variable order" -ForegroundColor Green
    $PassCount++
} else {
    Write-Host "  FAIL - activeCharts AFTER savedTheme:" -ForegroundColor Red
    foreach ($f in $badOrderFiles) {
        Write-Host "    - $f" -ForegroundColor Red
        $Failures += $f
    }
    $FailCount++
}

# ---- Check 5: {{PHASE_LABEL}} placeholder check ----
Write-Host "[Check 5] {{PHASE_LABEL}} placeholder (optional)" -ForegroundColor Yellow
$placeholderFiles = Select-String -Path "*_intermediate.html","*_deep.html" -Pattern '\{\{PHASE_LABEL\}\}' -SimpleMatch -List

if (-not $placeholderFiles) {
    Write-Host "  PASS - 0 files with PHASE_LABEL" -ForegroundColor Green
    $PassCount++
} else {
    Write-Host "  WARN - PHASE_LABEL found (expected in template):" -ForegroundColor Yellow
    foreach ($f in $placeholderFiles) {
        Write-Host "    - $($f.Filename)" -ForegroundColor Yellow
    }
}

# ---- Summary ----
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Validation Summary" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  HTML files scanned: $($allHtmlFiles.Count)" -ForegroundColor White
Write-Host "  PASSED: $PassCount" -ForegroundColor Green
Write-Host "  FAILED: $FailCount" -ForegroundColor Red

if ($FailCount -eq 0) {
    Write-Host ""
    Write-Host "  All checks passed! Deep dive materials are clean." -ForegroundColor Green
    Write-Host ""
    Pop-Location
    exit 0
} else {
    Write-Host ""
    Write-Host "  Issues found ($FailCount):" -ForegroundColor Red
    foreach ($f in $Failures) {
        Write-Host "    * $f" -ForegroundColor Red
    }
    Write-Host ""
    Pop-Location
    exit 1
}
