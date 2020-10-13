@echo off

IF EXIST credentials.json (
    IF EXIST node_modules (
        npm start
    ) ELSE (
        npm install
        npm start
    )
) ELSE (
    echo Daniel does not want to talk to you.
    echo.
    echo Missing credentials.json!
    echo.
    pause
)