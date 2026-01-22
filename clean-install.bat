@echo off
echo ========================================
echo 清理并重新安装依赖
echo ========================================
echo.

echo [1/4] 关闭可能占用文件的进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM Code.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] 删除 node_modules 和 package-lock.json...
if exist node_modules (
    echo 正在删除 node_modules...
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo 第一次删除失败,等待 3 秒后重试...
        timeout /t 3 /nobreak >nul
        rmdir /s /q node_modules 2>nul
    )
)

if exist package-lock.json (
    del /f /q package-lock.json
)

echo [3/4] 清理 npm 缓存...
call npm cache clean --force

echo [4/4] 重新安装依赖...
call npm install

echo.
echo ========================================
echo 安装完成!
echo ========================================
pause
