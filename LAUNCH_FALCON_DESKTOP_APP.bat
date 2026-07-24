@echo off
title Falcon Native Desktop Client
echo ============================================================
echo   🦅 LAUNCHING FALCON NATIVE RUST DESKTOP EXECUTABLE...    
echo ============================================================

start "" "%~dp0desktop-agent\target\debug\falcon-desktop-agent.exe"

