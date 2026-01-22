@echo off
chcp 65001 >nul
echo ========================================
echo   Vercel 部署脚本
echo ========================================
echo.

echo [1/4] 检查 Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo 安装失败！请手动运行: npm install -g vercel
        pause
        exit /b 1
    )
) else (
    echo ✓ Vercel CLI 已安装
)
echo.

echo [2/4] 登录 Vercel...
echo 请在浏览器中完成登录...
vercel login
if %errorlevel% neq 0 (
    echo 登录失败！
    pause
    exit /b 1
)
echo ✓ 登录成功
echo.

echo [3/4] 部署项目...
echo 首次部署会询问一些问题，按照提示操作即可
echo.
vercel
if %errorlevel% neq 0 (
    echo 部署失败！
    pause
    exit /b 1
)
echo ✓ 部署成功
echo.

echo [4/4] 添加环境变量...
echo.
echo 现在需要添加环境变量
echo.
echo ----------------------------------------
echo 变量1: DEEPSEEK_API_KEY (必需)
echo ----------------------------------------
set /p DEEPSEEK_KEY="请输入你的 DeepSeek API Key: "
if not "%DEEPSEEK_KEY%"=="" (
    echo %DEEPSEEK_KEY% | vercel env add DEEPSEEK_API_KEY production
    echo %DEEPSEEK_KEY% | vercel env add DEEPSEEK_API_KEY preview
    echo ✓ DEEPSEEK_API_KEY 已添加
) else (
    echo ⚠ 跳过 DEEPSEEK_API_KEY
)
echo.

echo ----------------------------------------
echo 变量2: NEXT_PUBLIC_AMAP_KEY (可选)
echo ----------------------------------------
set /p AMAP_KEY="请输入你的高德地图 Key (直接回车跳过): "
if not "%AMAP_KEY%"=="" (
    echo %AMAP_KEY% | vercel env add NEXT_PUBLIC_AMAP_KEY production
    echo %AMAP_KEY% | vercel env add NEXT_PUBLIC_AMAP_KEY preview
    echo ✓ NEXT_PUBLIC_AMAP_KEY 已添加
) else (
    echo ⚠ 跳过 NEXT_PUBLIC_AMAP_KEY (地图功能将不可用)
)
echo.

echo ========================================
echo 环境变量添加完成！
echo 现在需要重新部署以应用环境变量
echo ========================================
echo.
choice /C YN /M "是否立即重新部署到生产环境"
if %errorlevel%==1 (
    echo.
    echo 正在部署到生产环境...
    vercel --prod
    echo.
    echo ========================================
    echo   🎉 部署完成！
    echo ========================================
    echo.
    echo 你的应用已经上线！
    echo 访问 Vercel 仪表板查看你的项目: https://vercel.com/dashboard
    echo.
) else (
    echo.
    echo 跳过生产部署
    echo 你可以稍后运行: vercel --prod
    echo.
)

pause
