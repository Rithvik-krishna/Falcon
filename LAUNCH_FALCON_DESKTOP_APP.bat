@echo off
title Falcon Native Desktop Client
echo ============================================================
echo   🦅 LAUNCHING FALCON NATIVE DESKTOP APPLICATION...        
echo ============================================================

cd /d "%~dp0desktop-agent"
start "" cmd /c "cargo run"

cd /d "%~dp0desktop-app"
npx electron .

