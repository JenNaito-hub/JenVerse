@echo off
chcp 65001 >nul
echo === HOAN TAC: tra file da chuyen ve cho cu ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0HoanTac.ps1"
pause
