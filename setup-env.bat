@echo off
echo ========================================
echo 智旅App 2.0 - 环境变量配置
echo ========================================
echo.

cd /d %~dp0

echo 正在创建 .env.local 文件...
echo.

(
echo # 高德地图 API Key (必需^)
echo # 获取地址: https://lbs.amap.com/
echo NEXT_PUBLIC_AMAP_KEY=a0bec27f2df79f2a3684013ebfe42961
echo.
echo # DeepSeek API Configuration (用于AI行程生成^)
echo # 获取地址: https://platform.deepseek.com/
echo DEEPSEEK_API_KEY=sk-c210843ae9364a82a760aa061fbff3f7
echo DEEPSEEK_API_URL=https://api.deepseek.com/v1
) > .env.local

echo ✓ 环境变量配置完成!
echo.
echo 配置内容:
echo - 高德地图API Key: 已配置
echo - DeepSeek API Key: 已配置
echo.
echo 现在可以运行 test.bat 启动项目了!
echo.

pause
