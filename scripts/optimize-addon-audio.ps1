param(
    [Parameter(Mandatory = $true)]
    [string]$InputDir,

    [Parameter(Mandatory = $true)]
    [string]$OutputDir,

    [string]$Ffmpeg = "C:\ffmpeg\bin\ffmpeg.exe",

    [switch]$RemoveSource
)

$ErrorActionPreference = "Stop"
$inputPath = [IO.Path]::GetFullPath($InputDir)
$outputPath = [IO.Path]::GetFullPath($OutputDir)

if (-not (Test-Path -LiteralPath $Ffmpeg -PathType Leaf)) {
    throw "FFmpeg was not found at $Ffmpeg"
}

$files = @(Get-ChildItem -LiteralPath $inputPath -Filter "*.wav" -File | Sort-Object Name)
if ($files.Count -ne 44) {
    throw "Expected 44 rendered WAV files in $inputPath; found $($files.Count)."
}

New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

foreach ($file in $files) {
    $destination = Join-Path $outputPath ($file.BaseName + ".mp3")
    & $Ffmpeg -hide_banner -loglevel error -y -i $file.FullName -codec:a libmp3lame -b:a 112k -ar 44100 $destination
    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg failed while optimizing $($file.Name)."
    }
    Write-Output "Optimized $($file.Name)"
}

if ($RemoveSource) {
    foreach ($file in $files) {
        Remove-Item -LiteralPath $file.FullName -Force
    }
    Write-Output "Removed 44 source WAV files after successful conversion."
}
