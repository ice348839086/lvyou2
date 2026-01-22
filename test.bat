@echo off
echo ========================================
echo 智旅App 2.0 - 启动测试
echo ========================================
echo.

cd /d %~dp0

echo [1/3] 检查依赖安装...
if not exist "node_modules\next" (
    echo 依赖未安装,正在安装...
    call npm install
    if errorlevel 1 (
        echo 安装失败!
        pause
        exit /b 1
    )
) else (
    echo 依赖已安装 ✓
)
echo.

echo [2/3] 检查环境变量...
if not exist ".env.local" (
    echo 警告: 未找到 .env.local 文件
    echo 地图功能需要配置高德地图API Key
    echo.
    echo 创建示例配置文件...
    (
        echo # 高德地图API Key (必需^)
        echo NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
        echo.
        echo # DeepSeek API Key (可选,用于AI功能^)
        echo DEEPSEEK_API_KEY=your_deepseek_key_here
        echo DEEPSEEK_API_URL=https://api.deepseek.com/v1
    ) > .env.local
    echo 已创建 .env.local 文件,请编辑并填入你的API Key
    echo.
) else (
    echo 环境变量配置已存在 ✓
)
echo.

echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo 服务器启动中...
echo 访问: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

call npm run dev

pause
