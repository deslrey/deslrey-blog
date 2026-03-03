@echo off
setlocal
echo ==========================================
echo   Building deslrey-admin...
echo ==========================================

:: Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] pnpm is not installed. Please install pnpm first.
    pause
    exit /b 1
)

:: Run build commands
call pnpm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] pnpm install failed.
    pause
    exit /b 1
)

call pnpm build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] pnpm build failed.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] deslrey-admin build completed.
echo ==========================================
pause
