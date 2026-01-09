@echo off
echo ==========================================
echo CONFIGURANDO GITHUB PARA: erpAN-JoaquinJuncos
echo ==========================================

REM 1. Iniciar Repositorio
git init

REM 2. Agregar Archivos
git add .

REM 3. Guardar Cambios
git commit -m "ERP Version 1.0 - Lista para Despegue"

REM 4. Renombrar Rama
git branch -M main

REM 5. Conectar con GitHub (Eliminamos origin por si ya existia)
git remote remove origin 2>nul
git remote add origin https://github.com/erpAN-JoaquinJuncos/gestion-erp.git

echo.
echo ==========================================
echo LISTO! El repositorio local esta configurado.
echo.
echo Para subir los archivos a internet, ejecuta este comando:
echo.
echo git push -u origin main
echo.
echo (Si te pide clave, usa tu navegador o Personal Access Token)
echo ==========================================
pause
