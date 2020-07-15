ECHO INSIDE OF CLONEREPO
if not exist "myProjects" (mkdir "myProjects")
cd myProjects
if not exist "%3" (mkdir "%3")
cd %3
git clone https://github.com/%1/%2