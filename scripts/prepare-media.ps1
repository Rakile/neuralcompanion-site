param(
    [Parameter(Mandatory = $true)]
    [string]$NcRoot,
    [string]$Ffmpeg = "C:\ffmpeg\bin\ffmpeg.exe"
)

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$addonOutput = Join-Path $siteRoot "public\images\addons"
$productOutput = Join-Path $siteRoot "public\images\product"

if (-not (Test-Path -LiteralPath $NcRoot -PathType Container)) {
    throw "Neural Companion root was not found: $NcRoot"
}
if (-not (Test-Path -LiteralPath $Ffmpeg -PathType Leaf)) {
    throw "FFmpeg was not found: $Ffmpeg"
}

$iconMap = [ordered]@{
    "ai-presence-mode" = "ui_icons\side_tabs\ai_presence.png"
    "audio-story-mode" = "ui_icons\side_tabs\story_visuals.png"
    "buddy-chat" = "ui_icons\side_tabs\budy_chat.png"
    "conversation-replay" = "ui_icons\side_tabs\chat_player.png"
    "companion-orb-overlay" = "ui_icons\side_tabs\companion_orb.png"
    "corsair-visual-instrument" = "ui_icons\side_tabs\key_led.png"
    "discord-voice-bridge" = "ui_icons\side_tabs\discord_chatt.png"
    "hotkeys" = "ui_icons\side_tabs\hotkeys.png"
    "nc-identity-relay" = "ui_icons\side_tabs\artifacts.png"
    "main-chat-remote" = "ui_icons\side_tabs\desktop_bridge.png"
    "multi-persona-roleplay" = "ui_icons\side_tabs\mp_story_mode.png"
    "musetalk-avatar" = "ui_icons\side_tabs\musetalk.png"
    "musetalk-preprocess" = "ui_icons\side_tabs\musetalk.png"
    "document-memory" = "addons\rag_context\ui\icons\RAG.png"
    "scenic-avatar" = "ui_icons\side_tabs\scenic.png"
    "spotify-sense" = "ui_icons\side_tabs\spotisense.png"
    "vam-avatar" = "ui_icons\side_tabs\vam.png"
    "visual-reply" = "ui_icons\side_tabs\visuals.png"
    "visual-story-settings" = "ui_icons\side_tabs\story_visuals.png"
    "vseeface-avatar" = "ui_icons\side_tabs\vseeface.png"
}

foreach ($entry in $iconMap.GetEnumerator()) {
    $source = Join-Path $NcRoot $entry.Value
    $directory = Join-Path $addonOutput $entry.Key
    $destination = Join-Path $directory "icon.png"
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        throw "Official addon icon was not found: $source"
    }
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
}

$captureRoot = Join-Path $siteRoot "public\media\addons\screenshots"
$screenshotMap = [ordered]@{
    "ai-presence-mode" = "ai-presence.png"
    "audio-story-mode" = "story-visuals.png"
    "buddy-chat" = "buddy-chat.png"
    "companion-orb-overlay" = "companion-orb.png"
    "discord-voice-bridge" = "discord-chat.png"
    "multi-persona-roleplay" = "multi-persona-story-mode.png"
    "musetalk-avatar" = "musetalk.png"
    "scenic-avatar" = "scenic.png"
    "visual-reply" = "visuals.png"
    "visual-story-settings" = "story-visuals.png"
    "vseeface-avatar" = "vseeface.png"
}

foreach ($entry in $screenshotMap.GetEnumerator()) {
    $source = Join-Path $captureRoot $entry.Value
    $directory = Join-Path $addonOutput $entry.Key
    $destination = Join-Path $directory "overview.webp"
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        throw "Captured addon screenshot was not found: $source"
    }
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    & $Ffmpeg -hide_banner -loglevel error -y -i $source -vf "scale='min(1800,iw)':-2" -c:v libwebp -quality 82 $destination
    if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed for $source" }
}

New-Item -ItemType Directory -Path $productOutput -Force | Out-Null
Get-ChildItem -LiteralPath (Join-Path $siteRoot "public\media\screenshots") -Filter "*.png" | ForEach-Object {
    $destination = Join-Path $productOutput ($_.BaseName + ".webp")
    & $Ffmpeg -hide_banner -loglevel error -y -i $_.FullName -vf "scale='min(1800,iw)':-2" -c:v libwebp -quality 82 $destination
    if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed for $($_.FullName)" }
}

Write-Output "Prepared $($iconMap.Count) official icons, $($screenshotMap.Count) addon screenshots, and product screenshots."
