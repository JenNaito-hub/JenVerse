#Requires -Version 5.1
<#
  LocTrung.ps1 - Rà soát, phân loại và lọc file trùng trên ổ chung (mặc định Y:\)

  - Chạy thử (mặc định): chỉ quét và xuất báo cáo, KHÔNG đụng vào file nào.
  - Chạy thật (-Execute): CHUYỂN (không xóa) các bản trùng vào Y:\_TRUNG_LAP_CHO_JEN\,
    giữ nguyên cấu trúc thư mục cũ để Jen xem lại rồi tự xóa.
  - Thư mục Job năm 2025 / 2026: không bao giờ bị di chuyển.
  - Nhầm thì chạy HoanTac.ps1 với file NhatKy_DaChuyen.csv để trả file về chỗ cũ.
#>
[CmdletBinding()]
param(
    [string]  $Root          = 'Y:\',
    [switch]  $Execute,
    [int]     $MinSizeKB     = 50,
    [string]  $JobFolder     = 'Job',
    [string[]]$ProtectYears  = @('2025', '2026'),
    [string]  $DupFolderName = '_TRUNG_LAP_CHO_JEN'
)

$ErrorActionPreference = 'Stop'
$Sep = [string][IO.Path]::DirectorySeparatorChar
if (-not $Root.EndsWith($Sep)) { $Root += $Sep }
if (-not (Test-Path -LiteralPath $Root)) { throw "Không thấy ổ/thư mục $Root" }

$started   = Get-Date
$stamp     = $started.ToString('yyyyMMdd_HHmm')
$mode      = if ($Execute) { 'CHAY-THAT' } else { 'CHAY-THU' }
$DupRoot   = Join-Path $Root $DupFolderName
$ReportDir = Join-Path $DupRoot "_BAOCAO_${stamp}_$mode"
New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null

$ActKeep = 'GIỮ LẠI'
$ActMove = 'CHUYỂN RA'

# File rác hệ thống / thumbnail của NAS, Mac - bỏ qua
$SkipNames = @('thumbs.db', 'desktop.ini', '.ds_store')
$SkipDirRx = '[\\/](\$RECYCLE\.BIN|#recycle|@eaDir|#snapshot|System Volume Information)([\\/]|$)'
$YearRx    = '(?<!\d)(19|20)\d{2}(?!\d)'

$Cat = @{}
function Add-Cat([string]$exts, [string]$name) { foreach ($e in $exts -split ' ') { $Cat[".$e"] = $name } }
Add-Cat 'jpg jpeg png heic heif gif bmp webp tif tiff'            'Ảnh'
Add-Cat 'cr2 cr3 nef arw dng raf orf rw2 raw'                     'Ảnh RAW'
Add-Cat 'mp4 mov mxf avi mkv mts m2ts wmv r3d braw m4v 3gp'      'Video'
Add-Cat 'mp3 wav aac m4a flac aif aiff'                          'Âm thanh'
Add-Cat 'psd psb ai indd eps prproj aep drp xd fig sketch'       'File thiết kế / dựng'
Add-Cat 'pdf doc docx xls xlsx ppt pptx txt csv key pages numbers' 'Tài liệu'
Add-Cat 'zip rar 7z tar gz'                                      'File nén'
Add-Cat 'ttf otf ttc woff woff2'                                 'Font'
Add-Cat 'cube 3dl look xmp lrtemplate'                           'LUT / Preset'

function Format-GB([double]$bytes) { [math]::Round($bytes / 1GB, 2) }

# ---------------------------------------------------------------- 1. Quét
Write-Host "[1/4] Đang quét $Root ... (ổ mạng lớn có thể mất vài chục phút)" -ForegroundColor Cyan
$files = New-Object System.Collections.Generic.List[object]
$scanErr = $null
$count = 0
Get-ChildItem -LiteralPath $Root -Recurse -File -Force -ErrorAction SilentlyContinue -ErrorVariable scanErr |
    ForEach-Object {
        $p = $_.FullName
        if ($p -match $SkipDirRx) { return }
        if ($p.StartsWith($DupRoot + $Sep, [StringComparison]::OrdinalIgnoreCase)) { return }
        $n = $_.Name.ToLowerInvariant()
        if ($SkipNames -contains $n -or $n.StartsWith('._') -or $n.StartsWith('~$')) { return }

        $rel = $p.Substring($Root.Length)
        $top = if ($rel.Contains($Sep)) { $rel.Split($Sep)[0] } else { '(file ở gốc ổ)' }
        $ext = $_.Extension.ToLowerInvariant()
        $kind = if ($Cat.ContainsKey($ext)) { $Cat[$ext] } else { 'Khác' }
        $files.Add([pscustomobject]@{
            Path = $p; Rel = $rel; Top = $top; Ext = $ext; Cat = $kind
            Size = $_.Length; Modified = $_.LastWriteTime
        })
        $count++
        if ($count % 2000 -eq 0) { Write-Progress -Activity 'Đang quét' -Status "$count file - $top" }
    }
Write-Progress -Activity 'Đang quét' -Completed
$totalBytes = ($files | Measure-Object Size -Sum).Sum
Write-Host ("    {0:N0} file, {1} GB" -f $files.Count, (Format-GB $totalBytes))

# Báo cáo phân loại
$files | Group-Object Top | ForEach-Object {
    $s = ($_.Group | Measure-Object Size -Sum).Sum
    [pscustomobject]@{ 'Thư mục' = $_.Name; 'Số file' = $_.Count; 'Dung lượng (GB)' = Format-GB $s; '_b' = $s }
} | Sort-Object _b -Descending | Select-Object * -ExcludeProperty _b |
    Export-Csv (Join-Path $ReportDir '1_DungLuong_TheoThuMuc.csv') -NoTypeInformation -Encoding UTF8 -UseCulture

$files | Group-Object Cat | ForEach-Object {
    $s = ($_.Group | Measure-Object Size -Sum).Sum
    $exts = ($_.Group | Group-Object Ext | Sort-Object Count -Descending | Select-Object -First 8 | ForEach-Object { $_.Name }) -join ' '
    [pscustomobject]@{ 'Loại' = $_.Name; 'Số file' = $_.Count; 'Dung lượng (GB)' = Format-GB $s; 'Đuôi file chính' = $exts; '_b' = $s }
} | Sort-Object _b -Descending | Select-Object * -ExcludeProperty _b |
    Export-Csv (Join-Path $ReportDir '2_DungLuong_TheoLoaiFile.csv') -NoTypeInformation -Encoding UTF8 -UseCulture

# ---------------------------------------------------------------- 2. Lọc theo dung lượng
Write-Host "[2/4] Lọc ứng viên trùng theo dung lượng (bỏ qua file < $MinSizeKB KB)..." -ForegroundColor Cyan
$minBytes = [long]$MinSizeKB * 1KB
$bySize = @{}
foreach ($f in $files) {
    if ($f.Size -lt $minBytes) { continue }
    if (-not $bySize.ContainsKey($f.Size)) { $bySize[$f.Size] = New-Object System.Collections.Generic.List[object] }
    $bySize[$f.Size].Add($f)
}
$sizeGroups = @($bySize.Values | Where-Object { $_.Count -gt 1 })
$candCount = ($sizeGroups | Measure-Object Count -Sum).Sum
Write-Host ("    {0:N0} file có dung lượng trùng nhau, cần so nội dung" -f $candCount)

# ---------------------------------------------------------------- 3. So nội dung (hash)
function Get-QuickHash([string]$Path, [long]$Size) {
    $chunk = 65536
    $md5 = [System.Security.Cryptography.MD5]::Create()
    $fs = [System.IO.File]::Open($Path, 'Open', 'Read', 'ReadWrite')
    try {
        $buf = New-Object byte[] ([int][math]::Min($chunk, $Size))
        $r = $fs.Read($buf, 0, $buf.Length)
        [void]$md5.TransformBlock($buf, 0, $r, $null, 0)
        if ($Size -gt 2 * $chunk) {
            [void]$fs.Seek(-$chunk, [System.IO.SeekOrigin]::End)
            $r = $fs.Read($buf, 0, $chunk)
            [void]$md5.TransformBlock($buf, 0, $r, $null, 0)
        }
        [void]$md5.TransformFinalBlock((New-Object byte[] 0), 0, 0)
        return [BitConverter]::ToString($md5.Hash)
    } finally { $fs.Dispose(); $md5.Dispose() }
}

Write-Host '[3/4] So nội dung file (đầu/cuối file trước, sau đó toàn bộ file)...' -ForegroundColor Cyan
$hashErrors = New-Object System.Collections.Generic.List[object]
$dupGroups  = New-Object System.Collections.Generic.List[object]
$done = 0
foreach ($sg in $sizeGroups) {
    $byQuick = @{}
    foreach ($f in $sg) {
        $done++
        if ($done % 200 -eq 0) { Write-Progress -Activity 'So nội dung' -Status "$done / $candCount" -PercentComplete ([math]::Min(100, 100 * $done / $candCount)) }
        try { $q = Get-QuickHash $f.Path $f.Size }
        catch { $hashErrors.Add([pscustomobject]@{ 'Đường dẫn' = $f.Path; 'Lỗi' = $_.Exception.Message }); continue }
        if (-not $byQuick.ContainsKey($q)) { $byQuick[$q] = New-Object System.Collections.Generic.List[object] }
        $byQuick[$q].Add($f)
    }
    foreach ($qg in $byQuick.Values) {
        if ($qg.Count -lt 2) { continue }
        $byFull = @{}
        foreach ($f in $qg) {
            try { $h = (Get-FileHash -LiteralPath $f.Path -Algorithm MD5).Hash }
            catch { $hashErrors.Add([pscustomobject]@{ 'Đường dẫn' = $f.Path; 'Lỗi' = $_.Exception.Message }); continue }
            if (-not $byFull.ContainsKey($h)) { $byFull[$h] = New-Object System.Collections.Generic.List[object] }
            $byFull[$h].Add($f)
        }
        foreach ($fg in $byFull.Values) { if ($fg.Count -gt 1) { $dupGroups.Add($fg) } }
    }
}
Write-Progress -Activity 'So nội dung' -Completed

# ---------------------------------------------------------------- 4. Lập kế hoạch
# Job 2025/2026: năm lấy từ tên thư mục bên trong Job (thư mục ngoài cùng có số năm).
# Nếu tên thư mục không có năm: giữ nguyên khi ngày sửa của file, hoặc ngày tạo/sửa
# của thư mục job (cấp ngay dưới Job), rơi vào 2025/2026 - thà giữ nhầm còn hơn chuyển nhầm.
$dirCache = @{}
function Get-Protection($f) {
    $parts = $f.Rel.Split($Sep)
    if ($parts.Count -lt 2 -or $parts[0] -ine $JobFolder) { return $null }
    if ($parts.Count -gt 2) {
        foreach ($d in $parts[1..($parts.Count - 2)]) {
            $m = [regex]::Match($d, $YearRx)
            if ($m.Success) {
                if ($ProtectYears -contains $m.Value) { return "Job $($m.Value) (theo tên thư mục)" }
                return $null
            }
        }
    }
    if ($ProtectYears -contains [string]$f.Modified.Year) { return "Job $($f.Modified.Year) (theo ngày sửa file)" }
    if ($parts.Count -gt 2) {
        $jobDir = Join-Path $Root (Join-Path $parts[0] $parts[1])
        if (-not $dirCache.ContainsKey($jobDir)) {
            $di = Get-Item -LiteralPath $jobDir -Force -ErrorAction SilentlyContinue
            $dirCache[$jobDir] = if ($di) { @([string]$di.CreationTime.Year, [string]$di.LastWriteTime.Year) } else { @() }
        }
        foreach ($y in $dirCache[$jobDir]) {
            if ($ProtectYears -contains $y) { return "Job $y (theo ngày của thư mục job)" }
        }
    }
    return $null
}

Write-Host '[4/4] Lập danh sách giữ / chuyển...' -ForegroundColor Cyan
$plan = New-Object System.Collections.Generic.List[object]
$gNo = 0
foreach ($g in ($dupGroups | Sort-Object { $_[0].Size * ($_.Count - 1) } -Descending)) {
    $gNo++
    $prot = @{}
    foreach ($f in $g) { $prot[$f.Path] = Get-Protection $f }
    $protected = @($g | Where-Object { $prot[$_.Path] })
    $keep = if ($protected.Count -gt 0) { $protected } else {
        @($g | Sort-Object @{ Expression = 'Modified'; Descending = $true }, @{ Expression = { $_.Path.Length } } | Select-Object -First 1)
    }
    $keepPaths = @($keep | ForEach-Object { $_.Path })
    foreach ($f in ($g | Sort-Object { $keepPaths -notcontains $_.Path }, Path)) {
        $isKeep = $keepPaths -contains $f.Path
        $reason = if ($prot[$f.Path]) { "Giữ nguyên - $($prot[$f.Path])" }
                  elseif ($isKeep)     { 'Bản giữ lại (mới nhất của nhóm)' }
                  else                 { "Trùng với: $($keepPaths[0])" }
        $plan.Add([pscustomobject]@{
            'Nhóm'            = $gNo
            'Hành động'       = if ($isKeep) { $ActKeep } else { $ActMove }
            'Lý do'           = $reason
            'Thư mục gốc'     = $f.Top
            'Đường dẫn'       = $f.Path
            'Dung lượng (MB)' = [math]::Round($f.Size / 1MB, 2)
            'Ngày sửa'        = $f.Modified.ToString('yyyy-MM-dd HH:mm')
            'Đường dẫn mới'   = ''
            'Trạng thái'      = if ($isKeep) { '' } elseif ($Execute) { 'Chưa chuyển' } else { 'Chạy thử - chưa chuyển' }
            '_size'           = $f.Size
            '_rel'            = $f.Rel
            '_keep'           = $keepPaths[0]
        })
    }
}

$toMove     = @($plan | Where-Object { $_.'Hành động' -eq $ActMove })
$moveBytes  = ($toMove | Measure-Object _size -Sum).Sum
$protCount  = @($plan | Where-Object { $_.'Lý do' -like 'Giữ nguyên*' }).Count

# ---------------------------------------------------------------- Chạy thật: chuyển file
$moved = 0; $moveFail = 0
if ($Execute -and $toMove.Count -gt 0) {
    Write-Host ''
    Write-Host ("Sẽ CHUYỂN {0:N0} file trùng ({1} GB) vào {2}" -f $toMove.Count, (Format-GB $moveBytes), $DupRoot) -ForegroundColor Yellow
    Write-Host 'Không xóa file nào. Job 2025/2026 không bị đụng tới.' -ForegroundColor Yellow
    $ans = Read-Host 'Gõ DONG Y để bắt đầu (gõ khác để hủy)'
    if ($ans -ne 'DONG Y') {
        Write-Host 'Đã hủy, không chuyển file nào.' -ForegroundColor Red
        foreach ($r in $toMove) { $r.'Trạng thái' = 'Đã hủy - chưa chuyển' }
    } else {
        $i = 0
        foreach ($r in $toMove) {
            $i++
            Write-Progress -Activity 'Đang chuyển file trùng' -Status "$i / $($toMove.Count)" -PercentComplete (100 * $i / $toMove.Count)
            $src = $r.'Đường dẫn'
            try {
                # Kiểm tra lại trước khi chuyển: bản giữ lại vẫn còn, file nguồn không đổi
                if (-not (Test-Path -LiteralPath $r._keep)) { throw 'Bản giữ lại không còn - bỏ qua cho an toàn' }
                $cur = Get-Item -LiteralPath $src -Force
                if ($cur.Length -ne $r._size) { throw 'File đã thay đổi từ lúc quét - bỏ qua' }
                $dest = Join-Path $DupRoot $r._rel
                $dir = Split-Path $dest -Parent
                if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
                $k = 1
                while (Test-Path -LiteralPath $dest) {
                    $dest = Join-Path $dir ("{0}_{1}{2}" -f [IO.Path]::GetFileNameWithoutExtension($src), $k, [IO.Path]::GetExtension($src))
                    $k++
                }
                Move-Item -LiteralPath $src -Destination $dest
                $r.'Đường dẫn mới' = $dest
                $r.'Trạng thái' = 'Đã chuyển'
                $moved++
            } catch {
                $r.'Trạng thái' = 'Lỗi: ' + $_.Exception.Message
                $moveFail++
            }
        }
        Write-Progress -Activity 'Đang chuyển file trùng' -Completed
    }
}

# ---------------------------------------------------------------- Xuất báo cáo
$planFile = Join-Path $ReportDir $(if ($Execute) { 'NhatKy_DaChuyen.csv' } else { '3_DanhSach_FileTrung.csv' })
$plan | Select-Object * -ExcludeProperty _size, _rel, _keep |
    Export-Csv $planFile -NoTypeInformation -Encoding UTF8 -UseCulture

$toMove | Group-Object 'Thư mục gốc' | ForEach-Object {
    $s = ($_.Group | Measure-Object _size -Sum).Sum
    [pscustomobject]@{ 'Thư mục' = $_.Name; 'Số bản trùng' = $_.Count; 'Giải phóng được (GB)' = Format-GB $s; '_b' = $s }
} | Sort-Object _b -Descending | Select-Object * -ExcludeProperty _b |
    Export-Csv (Join-Path $ReportDir '4_Trung_TheoThuMuc.csv') -NoTypeInformation -Encoding UTF8 -UseCulture

$errRows = New-Object System.Collections.Generic.List[object]
foreach ($e in @($scanErr)) { if ($e) { $errRows.Add([pscustomobject]@{ 'Đường dẫn' = [string]$e.TargetObject; 'Lỗi' = $e.Exception.Message }) } }
foreach ($e in $hashErrors) { $errRows.Add($e) }
if ($errRows.Count -gt 0) {
    $errRows | Export-Csv (Join-Path $ReportDir '5_Loi_KhongDocDuoc.csv') -NoTypeInformation -Encoding UTF8 -UseCulture
}

$elapsed = (Get-Date) - $started
$summary = @"
BÁO CÁO LỌC TRÙNG - $Root
Thời điểm: $($started.ToString('dd/MM/yyyy HH:mm'))   Chế độ: $mode   Thời gian chạy: $([int]$elapsed.TotalMinutes) phút

TỔNG QUAN Ổ
  Tổng số file đã quét : $('{0:N0}' -f $files.Count)
  Tổng dung lượng      : $(Format-GB $totalBytes) GB

FILE TRÙNG (cùng nội dung 100%, chỉ xét file >= $MinSizeKB KB)
  Số nhóm trùng        : $('{0:N0}' -f $dupGroups.Count)
  Bản trùng thừa       : $('{0:N0}' -f $toMove.Count) file
  Giải phóng được      : $(Format-GB $moveBytes) GB
  Giữ nguyên Job $($ProtectYears -join '/') : $('{0:N0}' -f $protCount) file (không đụng tới)

$(if ($Execute) { "ĐÃ CHUYỂN: $moved file   LỖI: $moveFail file`n  -> Các bản trùng nằm ở: $DupRoot`n  -> Xem lại, nếu ổn thì xóa thư mục đó (nhớ dọn cả thùng rác #recycle của NAS).`n  -> Muốn trả lại: chạy 3_HOAN_TAC.bat và chọn file NhatKy_DaChuyen.csv" }
  else { "Đây là CHẠY THỬ - chưa chuyển file nào.`n  -> Mở 3_DanhSach_FileTrung.csv bằng Excel để xem từng file.`n  -> Ổn thì chạy 2_CHAY_THAT.bat" })

Lỗi không đọc được   : $($errRows.Count) file (xem 5_Loi_KhongDocDuoc.csv nếu có) - các file này được để nguyên.

CÁC FILE BÁO CÁO
  1_DungLuong_TheoThuMuc.csv   - thư mục nào chiếm nhiều dung lượng
  2_DungLuong_TheoLoaiFile.csv - ảnh / video / RAW / thiết kế... chiếm bao nhiêu
  $(Split-Path $planFile -Leaf) - chi tiết từng nhóm trùng: bản nào giữ, bản nào chuyển
  4_Trung_TheoThuMuc.csv       - thư mục nào có nhiều bản trùng nhất
"@
$summary | Out-File (Join-Path $ReportDir '0_TONG_QUAN.txt') -Encoding UTF8

Write-Host ''
Write-Host $summary -ForegroundColor Green
Write-Host "Báo cáo nằm ở: $ReportDir" -ForegroundColor Green
try { Invoke-Item $ReportDir } catch { }
