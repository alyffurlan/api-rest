@echo off
setlocal

REM Check if Node.js is installed
where node >nul 2>&1

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERRO: Node.js não está instalado ou não está acessível no PATH.
    echo.
    echo Instale o Node.js do website oficial ou mude a variável do PATH:
    echo https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

REM Run the application from the project root
node --env-file=config\.env controller\index.mjs

REM Keep window open if launched by double-click
if %ERRORLEVEL% neq 0 (
    echo.
    echo Application exited with error code %ERRORLEVEL%.
    pause
)

endlocal