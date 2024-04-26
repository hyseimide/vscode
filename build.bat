@echo off

:: Step 1:Run 'yarn install' in /vscode
cd /d "%~dp0"
:: %~dp0: .../vscode dir path
yarn install

:: Step 2:Run 'yarn gulp vscode-win32-x64' in /vscode
yarn gulp vscode-win32-x64

:: Step 3:Run 'yarn gulp vscode-win32-x64-inno-updater' in /vscode
yarn gulp vscode-win32-x64-inno-updater

:: Step 4:Process extensions
cd /d "%~dp0\extensions"

for %%f in (*.vsix) do (
	ren "%%f" "%%~nf.zip"
	powershell -noprofile -command "Expand-Archive -Path %%~nf.zip -DestinationPath %%~nf"
	del "%%~nf.zip"
	del "%%~nf\[Content_Types].xml"
	del "%%~nf\extension.vsixmanifest"
	ren "%%~nf\extension" "%%~nf"
	if exist "%~dp0\..\VSCode-win32-x64\resources\app\extensions\%%~nf" (
    	rmdir /S /Q "%~dp0\..\VSCode-win32-x64\resources\app\extensions\%%~nf"
	)
	move  "%%~nf\%%~nf" "%~dp0\..\VSCode-win32-x64\resources\app\extensions\" > nul
	rmdir "%%~nf"
)

:: Step 5:Run yarn gulp vscode-win32-x64-user-setup' in /vscode
cd /d "%~dp0"
yarn gulp vscode-win32-x64-user-setup

:: The system automatically exits after the package is complete. You need to manually perform this operation
:: Step 6 Rename VSCodeSetup.exe to HyseimIDE.exe
ren "%~dp0\.build\win32-x64\user-setup\VSCodeSetup.exe" "HyseimIDE.exe"

:: Pause to keep the window open for viewing results
pause
