@echo off
echo ========================================
echo   Microfinance Application Starter
echo ========================================
echo.
echo Starting backend server...
echo.

cd backend
start cmd /k "set JAVA_HOME=C:\Program Files\Java\jdk-17.0.1&& mvnw.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak

echo.
echo Opening web application...
cd ..\web
start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "index.html"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:8081
echo H2 Console: http://localhost:8081/h2-console
echo.
echo Login Credentials:
echo   Admin: admin / admin123
echo   Branch: branch1 / branch123
echo.
echo Press any key to exit...
pause
