@echo off
echo ========================================
echo Installing HIMS Testing Dependencies
echo ========================================
echo.

echo Installing Vitest and Testing Libraries...
call npm install --save-dev vitest @vitest/ui @vitest/coverage-v8

echo.
echo Installing React Testing Library...
call npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

echo.
echo Installing JSDOM...
call npm install --save-dev jsdom

echo.
echo Installing Happy DOM (alternative)...
call npm install --save-dev happy-dom

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm test
echo 2. Run: npm run test:ui (for UI)
echo 3. Run: npm run test:coverage (for coverage)
echo.
echo See TESTING_GUIDE.md for more information
echo.
pause
