@echo off
rem Usage: scripts\run.bat [load|stress]   (needs jmeter on PATH)
setlocal
set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=load
if "%PROFILE%"=="load"   (set THREADS=5  & set RAMPUP=10 & set DURATION=60)
if "%PROFILE%"=="stress" (set THREADS=30 & set RAMPUP=30 & set DURATION=120)
if exist results\%PROFILE%.jtl del results\%PROFILE%.jtl
if exist results\dashboard\%PROFILE% rmdir /s /q results\dashboard\%PROFILE%
if not exist results\dashboard mkdir results\dashboard
jmeter -n -t test-plans\load.jmx -Jthreads=%THREADS% -Jrampup=%RAMPUP% -Jduration=%DURATION% -l results\%PROFILE%.jtl -e -o results\dashboard\%PROFILE%
echo JMeter dashboard: results\dashboard\%PROFILE%\index.html
