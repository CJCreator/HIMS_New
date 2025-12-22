@echo off
echo ========================================
echo HIMS Test Runner
echo ========================================
echo.
echo Select test type:
echo 1. Run all tests
echo 2. Run with UI
echo 3. Run with coverage
echo 4. Run specific test
echo 5. Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo Running all tests...
    call npm test
) else if "%choice%"=="2" (
    echo Running tests with UI...
    call npm run test:ui
) else if "%choice%"=="3" (
    echo Running tests with coverage...
    call npm run test:coverage
) else if "%choice%"=="4" (
    set /p testfile="Enter test file name: "
    echo Running %testfile%...
    call npm test -- %testfile%
) else if "%choice%"=="5" (
    exit
) else (
    echo Invalid choice
)

echo.
pause
