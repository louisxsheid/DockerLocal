REM Find Dockerfiles in chosen repository
set projectFolder=%1%
set %1%FILE=*[dD]ocker*

REM Folder path WILL change in production
find %CD%\myProjects\"%projectFolder%" -name "%FILE%" -type f