@echo off
chcp 65001 >nul
echo ========================================
echo   Vercel 部署脚本
echo ========================================
echo.

echo 步骤1: 检查Vercel CLI是否安装...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI未安装，正在安装...
    npm install -g vercel
) else (
    echo ✓ Vercel CLI已安装
)
echo.

echo 步骤2: 登录Vercel账号...
echo 如果浏览器打开，请在浏览器中完成登录
vercel login
echo.

echo 步骤3: 设置环境变量...
echo.
echo 请输入你的DeepSeek API Key:
set /p DEEPSEEK_KEY=
echo.

echo 正在设置环境变量...
vercel env add DEEPSEEK_API_KEY production
echo %DEEPSEEK_KEY%

vercel env add DEEPSEEK_API_URL production
echo https://api.deepseek.com/v1

echo.
echo 是否需要设置高德地图API Key? (y/n)
set /p AMAP_CHOICE=
if /i "%AMAP_CHOICE%"=="y" (
    echo 请输入你的高德地图API Key:
    set /p AMAP_KEY=
    vercel env add NEXT_PUBLIC_AMAP_KEY production
    echo %AMAP_KEY%
)
echo.

echo 步骤4: 部署到生产环境...
vercel --prod
echo.

echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 你的应用已部署到: https://lvyou4.vercel.app
echo.
pause
