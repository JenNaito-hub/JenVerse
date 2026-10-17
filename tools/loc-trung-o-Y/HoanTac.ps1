#Requires -Version 5.1
<#
  HoanTac.ps1 - Trả các file đã chuyển về đúng chỗ cũ, dựa trên NhatKy_DaChuyen.csv
#>
param([string]$LogCsv)

$ErrorActionPreference = 'Stop'
if (-not $LogCsv) {
    Add-Type -AssemblyName System.Windows.Forms
    $dlg = New-Object System.Windows.Forms.OpenFileDialog
    $dlg.Title  = 'Chọn file NhatKy_DaChuyen.csv'
    $dlg.Filter = 'NhatKy_DaChuyen.csv|NhatKy_DaChuyen.csv|CSV|*.csv'
    if ($dlg.ShowDialog() -ne 'OK') { Write-Host 'Đã hủy.'; return }
    $LogCsv = $dlg.FileName
}

$rows = @(Import-Csv -LiteralPath $LogCsv -Encoding UTF8 -UseCulture | Where-Object { $_.'Trạng thái' -eq 'Đã chuyển' })
Write-Host "Có $($rows.Count) file sẽ được trả về chỗ cũ." -ForegroundColor Yellow
if ((Read-Host 'Gõ DONG Y để bắt đầu') -ne 'DONG Y') { Write-Host 'Đã hủy.'; return }

$ok = 0; $fail = 0
foreach ($r in $rows) {
    $src = $r.'Đường dẫn mới'; $dest = $r.'Đường dẫn'
    try {
        if (Test-Path -LiteralPath $dest) { throw 'Chỗ cũ đã có file cùng tên' }
        $dir = Split-Path $dest -Parent
        if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Move-Item -LiteralPath $src -Destination $dest
        $ok++
    } catch {
        Write-Host "Lỗi: $src -> $($_.Exception.Message)" -ForegroundColor Red
        $fail++
    }
}
Write-Host "Xong: trả về $ok file, lỗi $fail file." -ForegroundColor Green
