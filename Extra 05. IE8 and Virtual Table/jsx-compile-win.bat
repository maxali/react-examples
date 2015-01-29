@echo off

set buildDir=build
if not exist %buildDir% (mkdir %buildDir%)

jsx --watch --extension jsx ./src ./build

if ERRORLEVEL 1 (
echo. 
echo Script uses React Tools.
echo Install: npm install -g react-tools
)
