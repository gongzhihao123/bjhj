rem package start
set contextName=course
echo %contextName% package start...
call rd /s /q dist
call rd /s /q %contextName%
call git pull
call npm run build 
echo %contextName% package end...
call xcopy .\dist\static\* . /S
rem package end
rem 生成init.json开始...
echo generate init.json start...
echo %~dp0
@echo off
rem 指定存放文件的目录
set folderName1=%~dp0%contextName%\css
set folderName2=%~dp0%contextName%\js
rem 定义css和js变量名称
set appCssName=
set manifestJsName=
set vendorJSName=
set appJSName=
rem 获取文件名
for /f "delims=\" %%a in ('dir /b /a-d /o-d "%folderName1%\app.*.css"') do (
  echo %%a
  set appCssName=%%a
  CALL :manifest
)
GOTO :EOF
:manifest
for /f "delims=\" %%m in ('dir /b /a-d /o-d "%folderName2%\manifest.*.js"') do (
  echo %%m
  set manifestJsName=%%m
  call :vendor
)
GOTO :EOF
:vendor
for /f "delims=\" %%m in ('dir /b /a-d /o-d "%folderName2%\vendor.*.js"') do (
  echo %%m
  set vendorJSName=%%m
  call :app
)
GOTO :EOF
:app
for /f "delims=\" %%n in ('dir /b /a-d /o-d "%folderName2%\app.*.js"') do (
  echo %%n
  set appJSName=%%n
  goto :outer
)
:outer
echo write init.json start...
rem 写入文件名
set jsonFileName=%~dp0%contextName%\init.json
echo { > %jsonFileName%
echo     "appCss": "%appCssName%", >> %jsonFileName% 
echo     "manifestJs": "%manifestJsName%", >> %jsonFileName%
echo     "vendorJs": "%vendorJSName%", >> %jsonFileName%
echo     "appJS": "%appJSName%" >> %jsonFileName%
echo } >> %jsonFileName%
echo write init.json end...
echo generate init.json end...
rem 生成init.json结束
echo success!
pause;