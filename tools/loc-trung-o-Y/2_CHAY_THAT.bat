@echo off
chcp 65001 >nul
echo === CHAY THAT: chuyen ban trung vao Y:\_TRUNG_LAP_CHO_JEN (khong xoa file nao) ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0LocTrung.ps1" -Root "Y:\" -Execute
pause
