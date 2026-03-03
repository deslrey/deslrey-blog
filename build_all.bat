@echo off
echo ==========================================
echo   Building All Projects...
echo ==========================================

cd deslrey-admin
call build.bat
cd ..

cd deslrey-go
call build.bat
cd ..

cd deslrey-web
call build.bat
cd ..

echo.
echo ==========================================
echo   All builds finished!
echo ==========================================
pause
