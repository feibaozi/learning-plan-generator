$ErrorActionPreference = 'Stop'
$srcBase = 'C:\Users\hexi\Desktop\skills'
$srcSkills = Join-Path $srcBase ([char]0x5B66) + ([char]0x4E60) + ([char]0x8D44) + ([char]0x6599) + '\.trae\skills'
$dstClaude = Join-Path $srcBase ([char]0x5B66) + ([char]0x4E60) + ([char]0x8D44) + ([char]0x6599) + '\.claude\skills'
$dstTraecn = 'C:\Users\hexi\.trae-cn\skills'

Write-Host "=== Skill Sync Tool ==="
Write-Host "Source: $srcSkills"
Write-Host ""

$targets = @(
    @{ Name = '.claude'; Path = $dstClaude },
    @{ Name = '.trae-cn'; Path = $dstTraecn }
)

foreach ($t in $targets) {
    Write-Host "Syncing to $($t.Name)..."
    xcopy $srcSkills $t.Path /E /Y /I /Q | Out-Null
    if ($LASTEXITCODE -le 1) {
        Write-Host "  OK"
    } else {
        Write-Host "  FAILED (exit code: $LASTEXITCODE)"
    }
}

Write-Host ""
Write-Host "=== Verification ==="
$checkFiles = @(
    'smart-learning-materials\SKILL.md',
    'smart-learning-materials\templates\web-mode-a\index.html'
)
foreach ($f in $checkFiles) {
    $sp = Join-Path $srcSkills $f
    $cp = Join-Path $dstClaude $f
    $tp = Join-Path $dstTraecn $f
    $sh = (Get-FileHash $sp -Algorithm MD5 -ErrorAction SilentlyContinue).Hash
    $ch = (Get-FileHash $cp -Algorithm MD5 -ErrorAction SilentlyContinue).Hash
    $th = (Get-FileHash $tp -Algorithm MD5 -ErrorAction SilentlyContinue).Hash
    $mc = if ($sh -eq $ch) { "OK" } else { "MISMATCH" }
    $mt = if ($sh -eq $th) { "OK" } else { "MISMATCH" }
    Write-Host "  $f : .claude=$mc .trae-cn=$mt"
}
Write-Host ""
Write-Host "Done."
