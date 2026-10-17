@echo off
chcp 65001 >nul
echo === CHAY THU: chi quet va xuat bao cao, KHONG dung vao file nao ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0LocTrung.ps1" -Root "Y:\"
pause
