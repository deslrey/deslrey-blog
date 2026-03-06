@echo off
setlocal
echo ==========================================
echo    Building deslrey-go for Linux...
echo ==========================================

:: 检查 Go 是否安装
where go >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Go is not installed.
    pause
    exit /b 1
)

:: --- 关键修改点：设置环境变量进行交叉编译 ---
set GOOS=linux
set GOARCH=amd64
set CGO_ENABLED=0

echo Running go build for Linux (amd64)...
go build -o deslrey-go main.go

if %ERRORLEVEL% neq 0 (
    echo [ERROR] go build failed.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Linux version of deslrey-go build completed.
echo ==========================================
pause