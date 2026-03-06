@echo off
echo ========================================
echo Quick Git Commit and Push
echo ========================================
echo.

REM Add all changes
echo Adding all changes...
git add .
echo.

REM Prompt for commit message
set /p message="Enter commit message: "
echo.

REM Commit with message
echo Committing changes...
git commit -m "%message%"
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Done! Your changes are now on GitHub.
echo ========================================
pause
