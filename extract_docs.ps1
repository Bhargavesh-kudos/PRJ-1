Add-Type -AssemblyName System.IO.Compression.FileSystem

function Dump-Docx($docxPath, $outPath) {
    if (Test-Path $docxPath) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $docxPath))
        $entry = $zip.GetEntry('word/document.xml')
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $zip.Dispose()
        
        $xml = [xml]$xmlContent
        $paragraphs = $xml.document.body.p | ForEach-Object { $_.InnerText }
        $text = $paragraphs -join "`r`n"
        [System.IO.File]::WriteAllText($outPath, $text, [System.Text.Encoding]::UTF8)
    }
}

Dump-Docx "PRJ-1 Project(SRS).docx" "extracted_srs.txt"
Dump-Docx "PRJ-1 Project(Feasability study).docx" "extracted_feasibility.txt"
Dump-Docx "Planning - Feature Identification(prj1).docx" "extracted_planning.txt"
Write-Host "Extracted successfully"
