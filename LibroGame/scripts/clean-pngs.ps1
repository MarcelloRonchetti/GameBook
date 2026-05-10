# scripts/clean-pngs.ps1
# Ripulisce tutti i PNG in assets/ ri-salvandoli con .NET Bitmap.
# Strippa metadata (profili colore ICC, EXIF, info di salvataggio) che
# fanno fallire AAPT durante la build APK Android con errore generico
# "AAPT: file failed to compile".
#
# Idempotente: si puo' lanciare quante volte vuoi, non danneggia i file.
# Lanciare prima di ogni build APK quando si aggiungono nuove immagini.
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\clean-pngs.ps1
#   oppure: npm run clean-pngs

Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetsRoot = Join-Path (Split-Path -Parent $scriptDir) "assets"

if (-not (Test-Path $assetsRoot)) {
    Write-Host "ERRORE: cartella assets non trovata in $assetsRoot" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem -Path $assetsRoot -Recurse -Filter "*.png"
$total = $files.Count
$cleaned = 0
$skipped = 0
$failed = 0

Write-Host "Pulizia PNG in $assetsRoot ($total file)..." -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $w = $img.Width
        $h = $img.Height
        $newBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.DrawImage($img, 0, 0, $w, $h)
        $g.Dispose()
        $img.Dispose()

        $tmp = $file.FullName + ".tmp"
        $newBmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()
        Move-Item -Force $tmp $file.FullName

        $rel = $file.FullName.Substring($assetsRoot.Length + 1)
        Write-Host "  OK  $rel ($($w)x$($h))" -ForegroundColor Green
        $cleaned++
    } catch {
        Write-Host "  KO  $($file.Name): $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Risultato: $cleaned puliti, $failed falliti su $total totali" -ForegroundColor Cyan
if ($failed -gt 0) { exit 1 }
