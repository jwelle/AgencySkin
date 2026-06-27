$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$extensionRoot = Join-Path $repoRoot "extension"
$distRoot = Join-Path $repoRoot "dist"
$stagingRoot = Join-Path $distRoot "cleanview-extension"
$zipPath = Join-Path $distRoot "cleanview-chrome-v1.zip"

if (-not (Test-Path -LiteralPath (Join-Path $extensionRoot "manifest.json"))) {
  throw "Could not find extension/manifest.json."
}

New-Item -ItemType Directory -Force -Path $distRoot | Out-Null

$expectedPrefix = $repoRoot.TrimEnd("\") + "\"
$stagingFullPath = [System.IO.Path]::GetFullPath($stagingRoot)

if (-not $stagingFullPath.StartsWith($expectedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to clean staging path outside repo: $stagingFullPath"
}

if (Test-Path -LiteralPath $stagingRoot) {
  Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $stagingRoot | Out-Null

Copy-Item -LiteralPath (Join-Path $extensionRoot "manifest.json") -Destination $stagingRoot
Get-ChildItem -LiteralPath $extensionRoot -File | Where-Object { $_.Extension -in ".html", ".css", ".js" } | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $stagingRoot
}
Copy-Item -LiteralPath (Join-Path $extensionRoot "assets") -Destination (Join-Path $stagingRoot "assets") -Recurse

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $zipPath -Force

Write-Host "Packaged CleanView extension:"
Write-Host $zipPath
