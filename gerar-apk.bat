@echo off
chcp 65001 > nul
echo.
echo =========================================
echo    GERADOR DE APK - REMEDIO JA
echo =========================================
echo.

echo [1/3] Verificando projeto...
if not exist "app.json" (
    echo ❌ ERRO: app.json não encontrado!
    pause
    exit /b 1
)
echo ✅ Projeto encontrado!

echo.
echo [2/3] Gerando bundle Android...
call npx expo export --platform android

if %errorlevel% neq 0 (
    echo ❌ Erro ao gerar bundle
    pause
    exit /b 1
)

echo ✅ Bundle gerado com sucesso!
echo.
echo [3/3] APK gerado em: ./dist/
echo.
echo =========================================
echo    COMO INSTALAR NO CELULAR
echo =========================================
echo.
echo OPÇÃO 1 - TESTE RÁPIDO (Recomendado):
echo 1. Instale o 'Expo Go' no seu celular
echo 2. Execute: npm start
echo 3. Escaneie o QR Code
echo.
echo OPÇÃO 2 - APK INSTALÁVEL:
echo 1. Acesse: https://expo.dev/
echo 2. Faça login com: joelalveslima
echo 3. Vá em 'Projects' > 'remedio-ja'
echo 4. Clique em 'Builds'
echo 5. 'Create Build' > Android > APK
echo 6. Aguarde e baixe o APK
echo.
echo OPÇÃO 3 - BUILD LOCAL:
echo 1. Instale Android Studio
echo 2. Execute: npx expo run:android
echo.
echo =========================================
echo    STATUS: APK PRONTO PARA TESTE!
echo =========================================
echo.
pause
