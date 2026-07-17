param(
    [string]$SourceDir = "panoramas",
    [string]$OutputDir = "panoramas_optimized",
    [int]$Quality = 82,
    [int]$MaxLongEdge = 6000
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
    [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" } |
        Select-Object -First 1
}

function Save-Jpeg {
    param(
        [System.Drawing.Image]$Image,
        [string]$Path,
        [System.Drawing.Imaging.ImageCodecInfo]$Encoder,
        [int]$Quality
    )

    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [int64]$Quality
    )

    $Image.Save($Path, $Encoder, $encoderParams)
    $encoderParams.Dispose()
}

$sourcePath = Resolve-Path $SourceDir
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$outputPath = Resolve-Path $OutputDir
$jpegEncoder = Get-JpegEncoder

Get-ChildItem -Path $sourcePath -Filter *.jpg | ForEach-Object {
    $inputFile = $_
    $outputFile = Join-Path $outputPath $inputFile.Name
    $originalSize = $inputFile.Length

    $sourceImage = [System.Drawing.Image]::FromFile($inputFile.FullName)

    try {
        $longEdge = [Math]::Max($sourceImage.Width, $sourceImage.Height)
        $scale = if ($longEdge -gt $MaxLongEdge) { $MaxLongEdge / $longEdge } else { 1 }
        $targetWidth = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
        $targetHeight = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))

        $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)

        try {
            $bitmap.SetResolution($sourceImage.HorizontalResolution, $sourceImage.VerticalResolution)

            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)
            }
            finally {
                $graphics.Dispose()
            }

            Save-Jpeg -Image $bitmap -Path $outputFile -Encoder $jpegEncoder -Quality $Quality
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }

    $newSize = (Get-Item $outputFile).Length

    [pscustomobject]@{
        File = $inputFile.Name
        OriginalMB = [Math]::Round($originalSize / 1MB, 2)
        OptimizedMB = [Math]::Round($newSize / 1MB, 2)
        SavedPercent = [Math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
    }
} | Format-Table -AutoSize
