@ECHO OFF

SET task=%1


IF "%1"=="--prod" (
    SET NODE_ENV=production
    SET task=default
) else (
    IF "%2"=="--prod" (
        SET NODE_ENV=production
    ) else (
        SET NODE_ENV=developement
    )
)


IF "%task%"=="" (
    SET task=default
)


echo %NODE_ENV%
echo %task%

.\node_modules\.bin\gulp %task%
