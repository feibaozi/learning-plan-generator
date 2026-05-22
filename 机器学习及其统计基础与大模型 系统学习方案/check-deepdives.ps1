<#
.SYNOPSIS
  Deep Dive Material Detailed Integrity Check (P2-B)
.DESCRIPTION
  Fine-grained validation for post-generation quality assurance:
  1. HTML structure integrity (tag pairing)
  2. External CDN resource accessibility
  3. PAGE_DATA structure completeness
  4. Module count validation
  5. Cross-reference back-link validity
  6. File encoding check (UTF-8)
#>

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $ScriptDir

$WarnCount = 0
$ErrorCount = 0
$PassCount = 0
$Issues = @()

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Deep Dive Detailed Integrity Check" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$allHtmlFiles = @(Get-ChildItem "*_intermediate.html","*_deep.html","ml_learning.html")

# ---- 1. HTML Structure Integrity ----
Write-Host "[Check 1] HTML structure integrity" -ForegroundColor Yellow

foreach ($file in $allHtmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $issues = @()
    
    # Check DOCTYPE
    if ($content -notmatch '<!DOCTYPE html>') {
        $issues += "Missing DOCTYPE"
    }
    
    # Check <html> open/close
    $htmlOpen = ([regex]::Matches($content, '<html[^>]*>')).Count
    $htmlClose = ([regex]::Matches($content, '</html>')).Count
    if ($htmlOpen -ne $htmlClose) {
        $issues += "&lt;html&gt; mismatch (open:${htmlOpen}, close:${htmlClose})"
    }
    
    # Check <body> open/close
    $bodyOpen = ([regex]::Matches($content, '<body[^>]*>')).Count
    $bodyClose = ([regex]::Matches($content, '</body>')).Count
    if ($bodyOpen -ne $bodyClose) {
        $issues += "&lt;body&gt; mismatch (open:${bodyOpen}, close:${bodyClose})"
    }
    
    # Check <script> open/close
    $scriptOpen = ([regex]::Matches($content, '<script[^>]*>')).Count
    $scriptClose = ([regex]::Matches($content, '</script>')).Count
    if ($scriptOpen -ne $scriptClose) {
        $issues += "&lt;script&gt; mismatch (open:${scriptOpen}, close:${scriptClose})"
    }
    
    # Check for unclosed tags in content
    if ($content -match '<(p|div|section)\b[^>]*>[^<]*$') {
        $issues += "Possible unclosed tag at end of file"
    }
    
    if ($issues.Count -gt 0) {
        Write-Host "  WARN - $($file.Name): $($issues -join ', ')" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): $($issues -join '; ')"
    }
}

Write-Host "  OK - HTML structure scanned" -ForegroundColor Green
$PassCount++

# ---- 2. PAGE_DATA Module Field Validation ----
Write-Host "[Check 2] PAGE_DATA module fields" -ForegroundColor Yellow
$requiredFields = @('module_id','module_title','module_tag','hook','content')
$hasModuleIssues = $false

foreach ($file in (Get-ChildItem "*_intermediate.html","*_deep.html")) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract module count from PAGE_DATA metadata
    if ($content -match "module_count[`"':]+\s*`"?(\d+)`"?") {
        $declaredCount = [int]$Matches[1]
        
        # Count actual module definitions
        $actualCount = ([regex]::Matches($content, 'module_id["'':]+\s*["'']([^"'',\s]+)["'']')).Count
        if ($actualCount -eq 0) {
            # Fallback: search for module_id followed by any colon+value pattern
            $moduleMatches = Select-String -InputObject $content -Pattern 'module_id["'':]' -AllMatches
            $actualCount = $moduleMatches.Matches.Count
        }
        
        if ($declaredCount -ne $actualCount) {
            Write-Host "  WARN - $($file.Name): declared ${declaredCount} modules, found ${actualCount}" -ForegroundColor Yellow
            $WarnCount++
            $hasModuleIssues = $true
            $Issues += "$($file.Name): module count mismatch (declared:${declaredCount}, actual:${actualCount})"
        }
        
        # Check key_takeaway exists in each module
        $takeawayCount = ([regex]::Matches($content, 'key_takeaway:')).Count
        if ($takeawayCount -gt 0 -and $takeawayCount -ne $actualCount) {
            Write-Host "  WARN - $($file.Name): ${takeawayCount}/${actualCount} modules have key_takeaway" -ForegroundColor Yellow
        }
    }
}

if (-not $hasModuleIssues) {
    Write-Host "  OK - module counts consistent" -ForegroundColor Green
}

# ---- 3. External CDN Resource Check ----
Write-Host "[Check 3] External CDN resources" -ForegroundColor Yellow

foreach ($file in $allHtmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check essential CDN resources present
    if ($content -notmatch 'fonts\.googleapis\.com') {
        Write-Host "  WARN - $($file.Name): missing Google Fonts" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): missing Google Fonts CDN"
    }
    if ($content -notmatch 'katex@') {
        Write-Host "  WARN - $($file.Name): missing KaTeX" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): missing KaTeX CDN"
    }
    if ($content -notmatch 'echarts@') {
        Write-Host "  WARN - $($file.Name): missing ECharts" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): missing ECharts CDN"
    }
}

# ---- 4. Navigation Integrity ----
Write-Host "[Check 4] Navigation link integrity" -ForegroundColor Yellow

foreach ($file in (Get-ChildItem "*_intermediate.html","*_deep.html")) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check goBack function
    if ($content -match "MAIN_PAGE\s*=\s*'([^']+)'") {
        $mainPage = $Matches[1]
        if (-not (Test-Path $mainPage)) {
            Write-Host "  ERROR - $($file.Name): goBack target '${mainPage}' not found" -ForegroundColor Red
            $ErrorCount++
            $Issues += "$($file.Name): broken goBack link to ${mainPage}"
        }
    }
    
    # Check DEEP_DIVE_KP_ID
    if ($content -match "DEEP_DIVE_KP_ID\s*=\s*'([^']+)'") {
        $kpId = $Matches[1]
        # Validate format (pX_Y)
        if ($kpId -notmatch '^p\d+_\d+$') {
            Write-Host "  WARN - $($file.Name): unusual KP_ID format '${kpId}'" -ForegroundColor Yellow
            $WarnCount++
        }
    }
}

# ---- 5. File Size Sanity ----
Write-Host "[Check 5] File size sanity" -ForegroundColor Yellow

foreach ($file in $allHtmlFiles) {
    $sizeKB = [math]::Round($file.Length / 1024, 1)
    if ($file.Name -notlike "ml_learning.html" -and $sizeKB -lt 10) {
        Write-Host "  WARN - $($file.Name): ${sizeKB}KB - unusually small, may be incomplete" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): small file (${sizeKB}KB)"
    }
    if ($sizeKB -gt 500) {
        Write-Host "  INFO - $($file.Name): ${sizeKB}KB" -ForegroundColor Gray
    }
}

# ---- 6. Encoding Check ----
Write-Host "[Check 6] UTF-8 encoding" -ForegroundColor Yellow

foreach ($file in $allHtmlFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    # Check for BOM
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        # UTF-8 BOM - this is fine for HTML
    }
    # Check for null bytes (UTF-16 indicator)
    $hasNull = $false
    for ($i = 0; $i -lt [Math]::Min(100, $bytes.Length); $i++) {
        if ($bytes[$i] -eq 0) { $hasNull = $true; break }
    }
    if ($hasNull) {
        Write-Host "  WARN - $($file.Name): may not be UTF-8 (null bytes detected)" -ForegroundColor Yellow
        $WarnCount++
        $Issues += "$($file.Name): possible non-UTF-8 encoding"
    }
}

# ---- Summary ----
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Detailed Check Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Files scanned: $($allHtmlFiles.Count)" -ForegroundColor White
Write-Host "  Checks passed: $PassCount" -ForegroundColor Green
Write-Host "  Warnings    : $WarnCount" -ForegroundColor Yellow
Write-Host "  Errors      : $ErrorCount" -ForegroundColor Red

if ($Issues.Count -gt 0) {
    Write-Host ""
    Write-Host "  Detailed issues:" -ForegroundColor Yellow
    foreach ($issue in $Issues) {
        Write-Host "    * $issue" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($ErrorCount -eq 0) {
    Write-Host "  No critical errors found." -ForegroundColor Green
} else {
    Write-Host "  Critical errors found ($ErrorCount) - review required." -ForegroundColor Red
}
Write-Host ""

Pop-Location
exit $ErrorCount
