@ECHO OFF

WHERE browser-sync
IF %ERRORLEVEL% NEQ 0 npm i -g browser-sync

WHERE bower
IF %ERRORLEVEL% NEQ 0 npm i -g bower

pause