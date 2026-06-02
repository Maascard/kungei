# Публикация сайта Kungei на Vercel.
# Перед запуском: 1) заполните DATABASE_URL/DIRECT_URL в .env (строки Neon Postgres),
#                 2) войдите в Vercel (см. инструкцию).
# Запуск:  powershell -ExecutionPolicy Bypass -File .\deploy.ps1

$ErrorActionPreference = "Stop"
$env:Path = "$env:ProgramFiles\nodejs;$env:APPDATA\npm;" + $env:Path

# Vercel вызываем по полному пути к .cmd — надёжно, без проблем с PATH и политикой скриптов
$vercel = "$env:APPDATA\npm\vercel.cmd"
if (-not (Test-Path $vercel)) { $vercel = "vercel" }

# Проверка входа в Vercel
$who = (& $vercel whoami) 2>$null
if (-not $who) {
  Write-Host "Сначала войдите в Vercel:  & `"$env:APPDATA\npm\vercel.cmd`" login" -ForegroundColor Yellow
  exit 1
}
Write-Host "Вход в Vercel выполнен как: $who" -ForegroundColor Green

# Читаем .env в словарь
$envVars = @{}
Get-Content ".env" | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
    $idx = $line.IndexOf("=")
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim().Trim('"')
    $envVars[$key] = $val
  }
}

if (-not $envVars["DATABASE_URL"] -or $envVars["DATABASE_URL"] -like "*user:password@localhost*") {
  Write-Host "Заполните DATABASE_URL в .env строкой подключения Neon Postgres." -ForegroundColor Red
  exit 1
}

# Создаём/привязываем проект
Write-Host "`nСоздаём проект на Vercel..." -ForegroundColor Cyan
& $vercel link --yes | Out-Null

# Переменные, которые переносим в production (пустые пропускаем)
$keys = @(
  "DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD",
  "SITE_URL", "ANTHROPIC_API_KEY", "CHATBOT_MODEL",
  "WHATSAPP_VERIFY_TOKEN", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_APP_SECRET", "WHATSAPP_GRAPH_VERSION", "BLOB_READ_WRITE_TOKEN"
)

Write-Host "Переносим переменные окружения..." -ForegroundColor Cyan
foreach ($k in $keys) {
  $v = $envVars[$k]
  if ($v) {
    # Удаляем старое значение (если было) и добавляем новое
    (& $vercel env rm $k production -y) 2>$null | Out-Null
    $v | & $vercel env add $k production 2>$null | Out-Null
    Write-Host "  + $k"
  }
}

# Подключаем GitHub-репозиторий для автодеплоя при git push (не критично, если не выйдет)
Write-Host "Подключаем GitHub для автоматических обновлений..." -ForegroundColor Cyan
(& $vercel git connect) 2>$null

# Публикуем
Write-Host "`nПубликуем сайт (production)..." -ForegroundColor Cyan
& $vercel --prod

Write-Host "`nГотово! Сайт опубликован. Адрес показан выше." -ForegroundColor Green
Write-Host "Теперь после 'git push' сайт будет обновляться автоматически." -ForegroundColor Green
Write-Host "Админка: <адрес>/admin   (логин/пароль — из .env)" -ForegroundColor Green
