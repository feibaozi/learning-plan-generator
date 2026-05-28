param(
    [string]$PlanDir = ""
)

if (-not $PlanDir) {
    $PlanDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}

$script:errors = 0
$script:warnings = 0
$script:ok = 0

function Check-Result {
    param([string]$File, [string]$Check, [bool]$Pass, [string]$Detail = "")
    if ($Pass) {
        Write-Host "  OK  $Check" -ForegroundColor Green
        $script:ok++
    } else {
        Write-Host "  FAIL $Check" -ForegroundColor Red
        if ($Detail) { Write-Host "       $Detail" -ForegroundColor Yellow }
        $script:errors++
    }
}

function Warn-Result {
    param([string]$File, [string]$Check, [string]$Detail = "")
    Write-Host "  WARN $Check" -ForegroundColor Yellow
    if ($Detail) { Write-Host "       $Detail" -ForegroundColor DarkYellow }
    $script:warnings++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deep Dive HTML Template Validator" -ForegroundColor Cyan
Write-Host "  Scanning: $PlanDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$deepDiveFiles = Get-ChildItem -Path $PlanDir -Filter "p*_*.html" | Sort-Object Name
$planFiles = Get-ChildItem -Path $PlanDir -Filter "*_learning.html" | Sort-Object Name

if ($deepDiveFiles.Count -eq 0) {
    Write-Host "No deep dive HTML files found in $PlanDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "--- Deep Dive Files ($($deepDiveFiles.Count)) ---" -ForegroundColor White
Write-Host ""

foreach ($f in $deepDiveFiles) {
    Write-Host "[$($f.Name)]" -ForegroundColor White
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    if (-not $content) { $content = "" }
    $head = (Get-Content $f.FullName -TotalCount 20) -join "`n"

    Check-Result -File $f.Name -Check "has </html> closing tag" -Pass ($content -match '</html>')

    $hasInlineStyle = $head -match '<style>'
    if ($hasInlineStyle) {
        $hasRootVars = $content -match ':root\s*\{'
        Check-Result -File $f.Name -Check "inline <style> with :root{} variables" -Pass $hasRootVars
    }

    $hasContentArea = $content -match 'content-area'
    $hasContainer = $content -match 'class="container"'
    $hasFluidLayout = $content -match 'max-width.*calc\(100%'
    Check-Result -File $f.Name -Check "fluid layout (content-area + container)" -Pass ($hasContentArea -and $hasContainer)

    if (-not $hasFluidLayout -and $hasInlineStyle) {
        Warn-Result -File $f.Name -Check "may use fixed-width layout causing whitespace" -Detail "Should use max-width: calc(100% - 48px) for fluid layout"
    }

    $hasResponsive1024 = $content -match '1024px'
    $hasResponsive768 = $content -match '768px'
    Check-Result -File $f.Name -Check "responsive breakpoints (1024px + 768px)" -Pass ($hasResponsive1024 -and $hasResponsive768)

    $hasEchartsResize = $content -match 'resize.*charts|charts.*resize|\.resize\(\)'
    Check-Result -File $f.Name -Check "ECharts auto-resize on window resize" -Pass $hasEchartsResize

    $hasVersionTag = $head -match 'template-version'
    if (-not $hasVersionTag) {
        Warn-Result -File $f.Name -Check "missing <!-- template-version --> tag" -Detail "Project rules require version tag in HTML header"
    }

    $hasMetaCharset = $head -match 'charset="UTF-8"'
    Check-Result -File $f.Name -Check '<meta charset="UTF-8"> in <head>' -Pass $hasMetaCharset

    $hasViewport = $head -match 'viewport'
    Check-Result -File $f.Name -Check '<meta name="viewport"> present' -Pass $hasViewport

    $size = [math]::Round($f.Length / 1KB, 1)
    $lineCount = (Get-Content $f.FullName | Measure-Object -Line).Lines
    if ($size -lt 10 -or $lineCount -lt 50) {
        Warn-Result -File $f.Name -Check "file seems too small (${size}KB, ${lineCount} lines)" -Detail "May be truncated or empty shell"
    }

    Write-Host ""
}

if ($planFiles.Count -gt 0) {
    Write-Host "--- Plan Files ($($planFiles.Count)) ---" -ForegroundColor White
    Write-Host ""
    foreach ($f in $planFiles) {
        Write-Host "[$($f.Name)]" -ForegroundColor White
        $content = Get-Content $f.FullName -Raw -Encoding UTF8
        if (-not $content) { $content = "" }

        $deepDiveRefs = [regex]::Matches($content, "html_file:'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
        foreach ($ref in $deepDiveRefs) {
            $refPath = Join-Path $PlanDir $ref
            Check-Result -File $f.Name -Check "deep_dive html_file '$ref' exists" -Pass (Test-Path $refPath)
        }

        $noneStatus = [regex]::Matches($content, "status:'none'") | ForEach-Object { $_.Value }
        if ($noneStatus.Count -gt 0) {
            Warn-Result -File $f.Name -Check "$($noneStatus.Count) KP(s) with deep_dive status:'none'" -Detail "These KPs have no deep dive material generated yet"
        }
        Write-Host ""
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary: OK=$script:ok  WARN=$script:warnings  FAIL=$script:errors" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($script:errors -gt 0) {
    Write-Host "ACTION REQUIRED: Fix FAIL items above before deploying." -ForegroundColor Red
    exit 1
} else {
    Write-Host "All critical checks passed." -ForegroundColor Green
    exit 0
}
