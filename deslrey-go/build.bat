@echo off
setlocal
echo ==========================================
echo   Building deslrey-go...
echo ==========================================

:: Check if go is installed
where go >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Go is not installed. Please install Go first.
    pause
    exit /b 1
)

:: Run build commands
echo Running go build...
go build -o deslrey-go main.go
if %ERRORLEVEL% neq 0 (
    echo [ERROR] go build failed.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] deslrey-go build completed.
echo ==========================================
pause
