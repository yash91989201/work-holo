@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "ROOT_DIR=%%~fI"

if defined NO_COLOR (
  set "COLOR_RESET="
  set "COLOR_RED="
  set "COLOR_GREEN="
  set "COLOR_YELLOW="
  set "COLOR_BLUE="
) else (
  for /f %%A in ('echo prompt $E^| cmd') do set "ESC=%%A"
  set "COLOR_RESET=!ESC![0m"
  set "COLOR_RED=!ESC![31m"
  set "COLOR_GREEN=!ESC![32m"
  set "COLOR_YELLOW=!ESC![33m"
  set "COLOR_BLUE=!ESC![34m"
)

set "START_WAS_INTERRUPTED=false"
set "VAPID_PUBLIC_KEY="
set "VAPID_PRIVATE_KEY="
set "DEV_S3_ACCESS_KEY=GuzpNFteD5xLQ_aoBlUvyw"
set "DEV_S3_SECRET_KEY=zmvR18mhKg3hDlKfdtfp_g"
set "DEV_S3_ENDPOINT=http://127.0.0.1:9000"
set "DEV_SMTP_USER=dev-smtp-user"
set "DEV_SMTP_PASS=dev-smtp-pass"
set "TYPE_WATCHER_PID="

set "ENV_SERVER=apps\server\.env"
set "ENV_WEB=apps\web\.env"
set "ENV_WWW=apps\www\.env"
set "ENV_NOTIFICATION=workers\notification\.env"
set "ENV_SEARCH=workers\message-search\.env"
set "ENV_READ_RECEIPT=workers\read-receipt\.env"

set "CORE_SERVICES=postgres electric dragonfly rabbitmq opensearch rustfs soketi imgproxy"
set "DOCTOR_PORTS=5432 5003 6379 5672 9200 9000 6001 8080"

set "COMPOSE_IS_V2=0"

set "CMD=%~1"
if "%CMD%"=="" goto :cmd_help
if /I "%CMD%"=="--help" goto :cmd_help
if /I "%CMD%"=="-h" goto :cmd_help

shift

if /I "%CMD%"=="init" goto :cmd_init
if /I "%CMD%"=="start" goto :cmd_start
if /I "%CMD%"=="stop-services" goto :cmd_stop
if /I "%CMD%"=="reset-services" goto :cmd_reset_services
if /I "%CMD%"=="update-packages" goto :cmd_update_packages
if /I "%CMD%"=="doctor" goto :cmd_doctor
if /I "%CMD%"=="status" goto :cmd_status
if /I "%CMD%"=="logs" goto :cmd_logs
if /I "%CMD%"=="seed" goto :cmd_seed

call :log_error "Unknown command: %CMD%"
call :cmd_help
exit /b 1

:log_info
echo %COLOR_BLUE%[INFO]%COLOR_RESET% %*
exit /b 0

:log_success
echo %COLOR_GREEN%[OK]%COLOR_RESET% %*
exit /b 0

:log_warn
echo %COLOR_YELLOW%[WARN]%COLOR_RESET% %*
exit /b 0

:log_error
echo %COLOR_RED%[ERROR]%COLOR_RESET% %* 1>&2
exit /b 0

:require_root
if exist "%ROOT_DIR%\package.json" exit /b 0
call :log_error "Run from repository root: %ROOT_DIR%"
exit /b 1

:check_command
where "%~1" >nul 2>nul
if %ERRORLEVEL%==0 exit /b 0
call :log_error "Missing command: %~1"
exit /b 1

:detect_docker_compose
docker compose version >nul 2>nul
if %ERRORLEVEL%==0 (
  set "COMPOSE_IS_V2=1"
  exit /b 0
)

docker-compose --version >nul 2>nul
if %ERRORLEVEL%==0 (
  set "COMPOSE_IS_V2=0"
  exit /b 0
)

call :log_error "Neither 'docker compose' nor 'docker-compose' is available"
exit /b 1

:docker_compose
if "%COMPOSE_IS_V2%"=="1" (
  docker compose %*
) else (
  docker-compose %*
)
exit /b %ERRORLEVEL%

:check_deps
call :check_command bun || exit /b 1
call :check_command docker || exit /b 1
call :detect_docker_compose || exit /b 1
exit /b 0

:generate_better_auth_secret
set "_SECRET="
for /f "usebackq delims=" %%S in (`npx --yes auth secret 2^>nul`) do (
  if not defined _SECRET set "_SECRET=%%S"
)
if not defined _SECRET (
  for /f "usebackq delims=" %%S in (`bunx auth secret 2^>nul`) do (
    if not defined _SECRET set "_SECRET=%%S"
  )
)
if not defined _SECRET (
  for /f "usebackq delims=" %%S in (`openssl rand -base64 32 2^>nul`) do (
    if not defined _SECRET set "_SECRET=%%S"
  )
)
if not defined _SECRET (
  call :log_error "Failed to generate BETTER_AUTH_SECRET"
  exit /b 1
)
set "%~1=%_SECRET%"
exit /b 0

:generate_vapid_keys
set "VAPID_PUBLIC_KEY="
set "VAPID_PRIVATE_KEY="
set "_VAPID_FILE=%TEMP%\work-holo-vapid-%RANDOM%%RANDOM%.json"

bunx web-push generate-vapid-keys --json >"%_VAPID_FILE%" 2>nul
if not %ERRORLEVEL%==0 (
  call :log_warn "web-push generate-vapid-keys unavailable; VAPID fields will be empty"
  if exist "%_VAPID_FILE%" del /f /q "%_VAPID_FILE%" >nul 2>nul
  exit /b 0
)

for %%I in ("%_VAPID_FILE%") do if %%~zI EQU 0 (
  call :log_warn "web-push output empty; VAPID fields will be empty"
  del /f /q "%_VAPID_FILE%" >nul 2>nul
  exit /b 0
)

for /f "usebackq delims=" %%P in (`type "%_VAPID_FILE%" ^| bun -e "const fs=require('node:fs');const s=fs.readFileSync(0,'utf8');try{const j=JSON.parse(s);process.stdout.write(j.publicKey??'')}catch{process.stdout.write('')}"`) do (
  set "VAPID_PUBLIC_KEY=%%P"
)

for /f "usebackq delims=" %%P in (`type "%_VAPID_FILE%" ^| bun -e "const fs=require('node:fs');const s=fs.readFileSync(0,'utf8');try{const j=JSON.parse(s);process.stdout.write(j.privateKey??'')}catch{process.stdout.write('')}"`) do (
  set "VAPID_PRIVATE_KEY=%%P"
)

del /f /q "%_VAPID_FILE%" >nul 2>nul

if not defined VAPID_PUBLIC_KEY (
  call :log_warn "web-push keys parse failed; VAPID fields will be empty"
  set "VAPID_PUBLIC_KEY="
  set "VAPID_PRIVATE_KEY="
  exit /b 0
)
if not defined VAPID_PRIVATE_KEY (
  call :log_warn "web-push keys parse failed; VAPID fields will be empty"
  set "VAPID_PUBLIC_KEY="
  set "VAPID_PRIVATE_KEY="
  exit /b 0
)

call :log_success "VAPID keys generated"
exit /b 0

:ensure_parent_dir
for %%I in ("%~1") do if not exist "%%~dpI" mkdir "%%~dpI"
exit /b 0

:env_value_is_empty
setlocal EnableDelayedExpansion
set "VALUE=%~1"
set "IS_EMPTY=0"
if not defined VALUE set "IS_EMPTY=1"
set "VALUE=!VALUE: =!"
set "VALUE=!VALUE:"=!"
set "VALUE=!VALUE:'=!"
if not defined VALUE set "IS_EMPTY=1"
endlocal & set "%~2=%IS_EMPTY%"
exit /b 0

:ensure_env_default
setlocal EnableDelayedExpansion
set "TARGET=%~1"
set "ENV_KEY=%~2"
set "ENV_VALUE=%~3"
set "TMP_FILE=%TEMP%\work-holo-env-%RANDOM%%RANDOM%.tmp"
set "FOUND=0"
set "CHANGED=0"
break > "!TMP_FILE!"

for /f "usebackq delims=" %%L in ("!TARGET!") do (
  set "LINE=%%L"
  set "LINE_KEY="
  set "LINE_VALUE="
  for /f "tokens=1* delims==" %%A in ("!LINE!") do (
    set "LINE_KEY=%%A"
    set "LINE_VALUE=%%B"
  )

  if /I "!LINE_KEY!"=="!ENV_KEY!" (
    set "FOUND=1"
    call :env_value_is_empty "!LINE_VALUE!" CURRENT_EMPTY
    if "!CURRENT_EMPTY!"=="1" (
      call :env_value_is_empty "!ENV_VALUE!" DEFAULT_EMPTY
      if "!DEFAULT_EMPTY!"=="1" (
        >>"!TMP_FILE!" echo(!LINE!
      ) else (
        >>"!TMP_FILE!" echo(!ENV_KEY!=!ENV_VALUE!
        set "CHANGED=1"
      )
    ) else (
      >>"!TMP_FILE!" echo(!LINE!
    )
  ) else (
    >>"!TMP_FILE!" echo(!LINE!
  )
)

if "!FOUND!"=="0" (
  >>"!TMP_FILE!" echo(!ENV_KEY!=!ENV_VALUE!
  set "CHANGED=1"
)

if "!CHANGED!"=="1" (
  move /y "!TMP_FILE!" "!TARGET!" >nul
  endlocal & set "%~4=1"
  exit /b 0
) else (
  del /f /q "!TMP_FILE!" >nul 2>nul
)

endlocal
exit /b 0

:ensure_env_csv_contains
setlocal EnableDelayedExpansion
set "TARGET=%~1"
set "ENV_KEY=%~2"
set "ENV_VALUE=%~3"
set "PS_EXIT="
powershell -NoProfile -Command "$path = '%TARGET%'; $key = '%ENV_KEY%'; $value = '%ENV_VALUE%'; if (-not (Test-Path -LiteralPath $path)) { exit 1 }; $lines = Get-Content -LiteralPath $path; $found = $false; $changed = $false; $result = New-Object System.Collections.Generic.List[string]; foreach ($line in $lines) { if ($line -like ($key + '=*')) { $found = $true; $current = $line.Substring($key.Length + 1).Trim(); if ([string]::IsNullOrWhiteSpace($current) -or $current -eq '""' -or $current -eq '''''') { $next = $value } else { $items = @(); foreach ($item in ($current -split ',')) { $trimmed = $item.Trim(); if (-not [string]::IsNullOrWhiteSpace($trimmed)) { $items += $trimmed } }; if ($items -notcontains $value) { $items += $value }; $next = [string]::Join(',', $items) }; if ($next -ne $current) { $changed = $true }; $result.Add($key + '=' + $next) } else { $result.Add($line) } }; if (-not $found) { $result.Add($key + '=' + $value); $changed = $true }; if ($changed) { Set-Content -LiteralPath $path -Value $result -Encoding utf8NoBOM; exit 0 }; exit 2"
set "PS_EXIT=%ERRORLEVEL%"
if "%PS_EXIT%"=="0" (
  endlocal & set "%~4=1"
  exit /b 0
)
if "%PS_EXIT%"=="2" (
  endlocal
  exit /b 0
)
endlocal
exit /b 1


:write_env_server
set "TARGET=%ROOT_DIR%\%ENV_SERVER%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo BETTER_AUTH_SECRET=%~1
    echo BETTER_AUTH_URL=http://localhost:3000
    echo CORS_ORIGIN=http://localhost:3001,http://localhost:5100
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    echo REDIS_URL=redis://localhost:6379
    echo RABBITMQ_URL=amqp://admin:admin@localhost:5672
    echo ENV=development
    echo PORT=3000
    echo S3_ACCESS_KEY=%DEV_S3_ACCESS_KEY%
    echo S3_SECRET_KEY=%DEV_S3_SECRET_KEY%
    echo S3_ENDPOINT=%DEV_S3_ENDPOINT%
    echo WEB_URL=http://localhost:3001
    echo ELECTRIC_URL=http://localhost:5003
    echo ELECTRIC_SECRET=dev-electric-secret
    echo VAPID_PUBLIC_KEY=%VAPID_PUBLIC_KEY%
    echo VAPID_PRIVATE_KEY=%VAPID_PRIVATE_KEY%
    echo VAPID_SUBJECT=mailto:dev@localhost
    echo PUSHER_APP_ID=work-holo
    echo PUSHER_APP_KEY=work-holo-key
    echo PUSHER_APP_SECRET=work-holo-secret-must-be-32-chars
    echo PUSHER_HOST=localhost
    echo PUSHER_PORT=6001
    echo CASBIN_ENFORCE=false
    echo OPENSEARCH_URL=http://localhost:9200
  ) > "%TARGET%"
  call :log_success "Created %ENV_SERVER%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "BETTER_AUTH_SECRET" "%~1" ENV_CHANGED
call :ensure_env_default "%TARGET%" "BETTER_AUTH_URL" "http://localhost:3000" ENV_CHANGED
call :ensure_env_default "%TARGET%" "CORS_ORIGIN" "http://localhost:3001,http://localhost:5100" ENV_CHANGED
call :ensure_env_default "%TARGET%" "DATABASE_URL" "postgresql://postgres:postgres@localhost:5432/postgres" ENV_CHANGED
call :ensure_env_default "%TARGET%" "REDIS_URL" "redis://localhost:6379" ENV_CHANGED
call :ensure_env_default "%TARGET%" "RABBITMQ_URL" "amqp://admin:admin@localhost:5672" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ENV" "development" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PORT" "3000" ENV_CHANGED
call :ensure_env_default "%TARGET%" "S3_ACCESS_KEY" "%DEV_S3_ACCESS_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "S3_SECRET_KEY" "%DEV_S3_SECRET_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "S3_ENDPOINT" "%DEV_S3_ENDPOINT%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "WEB_URL" "http://localhost:3001" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ELECTRIC_URL" "http://localhost:5003" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ELECTRIC_SECRET" "dev-electric-secret" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PUBLIC_KEY" "%VAPID_PUBLIC_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PRIVATE_KEY" "%VAPID_PRIVATE_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_SUBJECT" "mailto:dev@localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_ID" "work-holo" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_KEY" "work-holo-key" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_SECRET" "work-holo-secret-must-be-32-chars" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_HOST" "localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_PORT" "6001" ENV_CHANGED
call :ensure_env_default "%TARGET%" "CASBIN_ENFORCE" "false" ENV_CHANGED
call :ensure_env_default "%TARGET%" "OPENSEARCH_URL" "http://localhost:9200" ENV_CHANGED
call :ensure_env_csv_contains "%TARGET%" "CORS_ORIGIN" "http://localhost:5100" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_SERVER%"
) else (
  call :log_warn "Keeping existing file: %ENV_SERVER%"
)
exit /b 0

:write_env_web
set "TARGET=%ROOT_DIR%\%ENV_WEB%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo VITE_ENV=development
    echo VITE_IMAGE_TRANSFORMATION_URL=http://localhost:8080
    echo VITE_SERVER_URL=http://localhost:3000
    echo VITE_WEB_URL=http://localhost:3001
    echo VAPID_PUBLIC_KEY=%VAPID_PUBLIC_KEY%
    echo VAPID_PRIVATE_KEY=%VAPID_PRIVATE_KEY%
    echo VAPID_SUBJECT=mailto:dev@localhost
    echo VITE_PUSHER_KEY=work-holo-key
    echo VITE_PUSHER_HOST=localhost
    echo VITE_PUSHER_PORT=6001
  ) > "%TARGET%"
  call :log_success "Created %ENV_WEB%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "VITE_ENV" "development" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_IMAGE_TRANSFORMATION_URL" "http://localhost:8080" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_SERVER_URL" "http://localhost:3000" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_WEB_URL" "http://localhost:3001" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PUBLIC_KEY" "%VAPID_PUBLIC_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PRIVATE_KEY" "%VAPID_PRIVATE_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_SUBJECT" "mailto:dev@localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_PUSHER_KEY" "work-holo-key" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_PUSHER_HOST" "localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_PUSHER_PORT" "6001" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_WEB%"
) else (
  call :log_warn "Keeping existing file: %ENV_WEB%"
)
exit /b 0

:write_env_www
set "TARGET=%ROOT_DIR%\%ENV_WWW%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo VITE_ENV=development
    echo VITE_WWW_URL=http://localhost:5100
    echo VITE_SERVER_URL=http://localhost:3000
    echo VITE_IMAGE_TRANSFORMATION_URL=http://localhost:8080
  ) > "%TARGET%"
  call :log_success "Created %ENV_WWW%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "VITE_ENV" "development" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_WWW_URL" "http://localhost:5100" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_SERVER_URL" "http://localhost:3000" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VITE_IMAGE_TRANSFORMATION_URL" "http://localhost:8080" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_WWW%"
 ) else (
  call :log_warn "Keeping existing file: %ENV_WWW%"
 )
exit /b 0


:write_env_notification
set "TARGET=%ROOT_DIR%\%ENV_NOTIFICATION%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    echo RABBITMQ_URL=amqp://admin:admin@localhost:5672
    echo PUSHER_APP_ID=work-holo
    echo PUSHER_APP_KEY=work-holo-key
    echo PUSHER_APP_SECRET=work-holo-secret-must-be-32-chars
    echo PUSHER_HOST=localhost
    echo PUSHER_PORT=6001
    echo VAPID_PUBLIC_KEY=%VAPID_PUBLIC_KEY%
    echo VAPID_PRIVATE_KEY=%VAPID_PRIVATE_KEY%
    echo VAPID_SUBJECT=mailto:dev@localhost
    echo SMTP_HOST=localhost
    echo SMTP_PORT=1025
    echo SMTP_USER=%DEV_SMTP_USER%
    echo SMTP_PASS=%DEV_SMTP_PASS%
    echo SMTP_FROM=dev@work-holo.local
    echo ENV=development
  ) > "%TARGET%"
  call :log_success "Created %ENV_NOTIFICATION%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "DATABASE_URL" "postgresql://postgres:postgres@localhost:5432/postgres" ENV_CHANGED
call :ensure_env_default "%TARGET%" "RABBITMQ_URL" "amqp://admin:admin@localhost:5672" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_ID" "work-holo" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_KEY" "work-holo-key" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_APP_SECRET" "work-holo-secret-must-be-32-chars" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_HOST" "localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "PUSHER_PORT" "6001" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PUBLIC_KEY" "%VAPID_PUBLIC_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_PRIVATE_KEY" "%VAPID_PRIVATE_KEY%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "VAPID_SUBJECT" "mailto:dev@localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "SMTP_HOST" "localhost" ENV_CHANGED
call :ensure_env_default "%TARGET%" "SMTP_PORT" "1025" ENV_CHANGED
call :ensure_env_default "%TARGET%" "SMTP_USER" "%DEV_SMTP_USER%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "SMTP_PASS" "%DEV_SMTP_PASS%" ENV_CHANGED
call :ensure_env_default "%TARGET%" "SMTP_FROM" "dev@work-holo.local" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ENV" "development" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_NOTIFICATION%"
) else (
  call :log_warn "Keeping existing file: %ENV_NOTIFICATION%"
)
exit /b 0

:write_env_search
set "TARGET=%ROOT_DIR%\%ENV_SEARCH%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    echo RABBITMQ_URL=amqp://admin:admin@localhost:5672
    echo OPENSEARCH_URL=http://localhost:9200
    echo ENV=development
  ) > "%TARGET%"
  call :log_success "Created %ENV_SEARCH%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "DATABASE_URL" "postgresql://postgres:postgres@localhost:5432/postgres" ENV_CHANGED
call :ensure_env_default "%TARGET%" "RABBITMQ_URL" "amqp://admin:admin@localhost:5672" ENV_CHANGED
call :ensure_env_default "%TARGET%" "OPENSEARCH_URL" "http://localhost:9200" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ENV" "development" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_SEARCH%"
) else (
  call :log_warn "Keeping existing file: %ENV_SEARCH%"
)
exit /b 0

:write_env_read_receipt
set "TARGET=%ROOT_DIR%\%ENV_READ_RECEIPT%"
call :ensure_parent_dir "%TARGET%"
if not exist "%TARGET%" (
  (
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
    echo RABBITMQ_URL=amqp://admin:admin@localhost:5672
    echo ENV=development
  ) > "%TARGET%"
  call :log_success "Created %ENV_READ_RECEIPT%"
  exit /b 0
)
set "ENV_CHANGED=0"
call :ensure_env_default "%TARGET%" "DATABASE_URL" "postgresql://postgres:postgres@localhost:5432/postgres" ENV_CHANGED
call :ensure_env_default "%TARGET%" "RABBITMQ_URL" "amqp://admin:admin@localhost:5672" ENV_CHANGED
call :ensure_env_default "%TARGET%" "ENV" "development" ENV_CHANGED
if "%ENV_CHANGED%"=="1" (
  call :log_success "Backfilled missing env values in %ENV_READ_RECEIPT%"
) else (
  call :log_warn "Keeping existing file: %ENV_READ_RECEIPT%"
)
exit /b 0

:create_env_files
call :generate_better_auth_secret SECRET || exit /b 1
call :generate_vapid_keys
call :write_env_server "%SECRET%" || exit /b 1
call :write_env_web || exit /b 1
call :write_env_www || exit /b 1
call :write_env_notification || exit /b 1
call :write_env_search || exit /b 1
call :write_env_read_receipt || exit /b 1
exit /b 0

:compose_up
call :docker_compose up -d
exit /b %ERRORLEVEL%

:compose_down
call :docker_compose down
exit /b %ERRORLEVEL%

:compose_stop
call :docker_compose stop
exit /b %ERRORLEVEL%

:get_service_id
set "%~2="
if "%COMPOSE_IS_V2%"=="1" (
  for /f "usebackq delims=" %%I in (`docker compose ps -q %~1 2^>nul`) do (
    if not defined _sid set "_sid=%%I"
  )
) else (
  for /f "usebackq delims=" %%I in (`docker-compose ps -q %~1 2^>nul`) do (
    if not defined _sid set "_sid=%%I"
  )
)
if defined _sid set "%~2=%_sid%"
set "_sid="
exit /b 0

:wait_healthy
set /a TIMEOUT=180
set /a POLL_INTERVAL=3
set /a ELAPSED=0

call :log_info "Waiting for all Docker services"

:wait_healthy_loop
if %ELAPSED% GEQ %TIMEOUT% (
  call :log_error "Services not ready after %TIMEOUT%s"
  exit /b 1
)

set /a READY_COUNT=0
set /a TOTAL_COUNT=0
for %%S in (%CORE_SERVICES%) do (
  set /a TOTAL_COUNT+=1
  set "SERVICE_ID="
  if "%COMPOSE_IS_V2%"=="1" (
    for /f "usebackq delims=" %%I in (`docker compose ps -q %%S 2^>nul`) do (
      if not defined SERVICE_ID set "SERVICE_ID=%%I"
    )
  ) else (
    for /f "usebackq delims=" %%I in (`docker-compose ps -q %%S 2^>nul`) do (
      if not defined SERVICE_ID set "SERVICE_ID=%%I"
    )
  )

  if defined SERVICE_ID (
    set "STATE="
    for /f "usebackq delims=" %%T in (`docker inspect --format "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" "!SERVICE_ID!" 2^>nul`) do (
      set "STATE=%%T"
    )
    if /I "!STATE!"=="healthy" set /a READY_COUNT+=1
    if /I "!STATE!"=="running" set /a READY_COUNT+=1
  )
)

if !READY_COUNT! EQU !TOTAL_COUNT! (
  call :log_success "All services ready: !READY_COUNT!/!TOTAL_COUNT!"
  exit /b 0
)

call :log_info "Services ready: !READY_COUNT!/!TOTAL_COUNT!"
timeout /t %POLL_INTERVAL% /nobreak >nul
set /a ELAPSED+=POLL_INTERVAL
goto :wait_healthy_loop

:migrate_database
pushd "%ROOT_DIR%\packages\db" >nul
bun run db:migrate
set "RC=%ERRORLEVEL%"
popd >nul
exit /b %RC%

:cmd_seed
bun run --cwd apps/seeder src/index.ts %*
exit /b %ERRORLEVEL%

:cmd_bootstrap_dev_workspace
bun run --cwd apps/seeder seed:dev-bootstrap
exit /b %ERRORLEVEL%

:step_to_var
set "_STEP_KEY=%~1"
set "_STEP_KEY=%_STEP_KEY:-=_%"
set "%~2=%_STEP_KEY%"
set "_STEP_KEY="
exit /b 0

:get_init_step_deps
call :step_to_var "%~1" STEP_KEY
call set "_STEP_DEPS_VALUE=%%STEP_DEPS_%STEP_KEY%%%"
set "%~2=%_STEP_DEPS_VALUE%"
set "_STEP_DEPS_VALUE="
set "STEP_KEY="
exit /b 0

:is_valid_init_step
if /I "%~1"=="check-deps" exit /b 0
if /I "%~1"=="deps-install" exit /b 0
if /I "%~1"=="create-env" exit /b 0
if /I "%~1"=="start-compose" exit /b 0
if /I "%~1"=="wait-healthy" exit /b 0
if /I "%~1"=="migrate" exit /b 0
if /I "%~1"=="seed" exit /b 0
if /I "%~1"=="bootstrap-dev-workspace" exit /b 0
exit /b 1

:mark_skip_step
call :step_to_var "%~1" STEP_KEY
call set "_SKIP_EXISTS=%%SKIP_SET_%STEP_KEY%%%"
if not defined _SKIP_EXISTS (
  set "SKIP_SET_%STEP_KEY%=1"
  if defined SKIP_STEPS (
    set "SKIP_STEPS=!SKIP_STEPS!, %~1"
  ) else (
    set "SKIP_STEPS=%~1"
  )
)
set "_SKIP_EXISTS="
set "STEP_KEY="
exit /b 0

:is_step_skipped
call :step_to_var "%~1" STEP_KEY
call set "_SKIP_MARK=%%SKIP_SET_%STEP_KEY%%%"
set "STEP_KEY="
if defined _SKIP_MARK (
  set "_SKIP_MARK="
  exit /b 0
)
set "_SKIP_MARK="
exit /b 1

:add_skip_steps_from_value
set "RAW_SKIP=%~1"
if not defined RAW_SKIP exit /b 0
set "TOKENIZED_SKIP=%RAW_SKIP:,= %"
for %%T in (!TOKENIZED_SKIP!) do (
  set "CANDIDATE_STEP=%%~T"
  if defined CANDIDATE_STEP (
    call :is_valid_init_step "!CANDIDATE_STEP!"
    if not !ERRORLEVEL! EQU 0 (
      call :log_error "Unknown step '!CANDIDATE_STEP!'. Available steps: %INIT_STEP_LIST%"
      exit /b 1
    )
    call :mark_skip_step "!CANDIDATE_STEP!"
  )
)
set "RAW_SKIP="
set "TOKENIZED_SKIP="
set "CANDIDATE_STEP="
exit /b 0

:collect_downstream_steps
set "ROOT_STEP=%~1"
set "DOWNSTREAM_STEPS="

for %%S in (%INIT_STEPS%) do (
  call :step_to_var "%%S" STEP_KEY
  set "AFFECTED_!STEP_KEY!="
)

call :step_to_var "%ROOT_STEP%" ROOT_KEY
set "AFFECTED_%ROOT_KEY%=1"

:collect_downstream_pass
set "COLLECT_CHANGED=0"
for %%S in (%INIT_STEPS%) do (
  call :step_to_var "%%S" STEP_KEY
  call set "CURRENT_AFFECTED=%%AFFECTED_!STEP_KEY!%%"
  if not defined CURRENT_AFFECTED (
    call :get_init_step_deps "%%S" STEP_DEPS_VALUE
    if defined STEP_DEPS_VALUE (
      for %%D in (!STEP_DEPS_VALUE!) do (
        call :step_to_var "%%D" DEP_KEY
        call set "DEP_AFFECTED=%%AFFECTED_!DEP_KEY!%%"
        if defined DEP_AFFECTED (
          set "AFFECTED_!STEP_KEY!=1"
          set "COLLECT_CHANGED=1"
        )
      )
    )
  )
)

if "!COLLECT_CHANGED!"=="1" goto :collect_downstream_pass

for %%S in (%INIT_STEPS%) do (
  if /I not "%%S"=="%ROOT_STEP%" (
    call :step_to_var "%%S" STEP_KEY
    call set "CURRENT_AFFECTED=%%AFFECTED_!STEP_KEY!%%"
    if defined CURRENT_AFFECTED (
      call :is_step_skipped "%%S"
      if not !ERRORLEVEL! EQU 0 (
        if defined DOWNSTREAM_STEPS (
          set "DOWNSTREAM_STEPS=!DOWNSTREAM_STEPS!, %%S"
        ) else (
          set "DOWNSTREAM_STEPS=%%S"
        )
      )
    )
  )
)

set "%~2=%DOWNSTREAM_STEPS%"
set "ROOT_STEP="
set "ROOT_KEY="
set "STEP_KEY="
set "STEP_DEPS_VALUE="
set "DEP_KEY="
set "DEP_AFFECTED="
set "CURRENT_AFFECTED="
set "COLLECT_CHANGED="
set "DOWNSTREAM_STEPS="
exit /b 0

:validate_skip_dependencies
set "HAS_CONFLICT=false"
if not defined SKIP_STEPS exit /b 0

for %%S in (%INIT_STEPS%) do (
  call :is_step_skipped "%%S"
  if !ERRORLEVEL! EQU 0 (
    call :collect_downstream_steps "%%S" ORPHANED_STEPS
    if defined ORPHANED_STEPS (
      call :log_error "Cannot skip '%%S': the following steps depend on it (directly or transitively): !ORPHANED_STEPS!"
      call :log_error "To skip '%%S', also include in --skip-steps: !ORPHANED_STEPS!"
      set "HAS_CONFLICT=true"
    )
  )
)

if /I "%HAS_CONFLICT%"=="true" exit /b 1
exit /b 0

:init_list_steps
echo Available init steps:
set /a STEP_INDEX=0
for %%S in (%INIT_STEPS%) do (
  set /a STEP_INDEX+=1
  call :get_init_step_deps "%%S" STEP_DEPS_VALUE
  if defined STEP_DEPS_VALUE (
    set "STEP_DEPS_DISPLAY=!STEP_DEPS_VALUE: =, !"
    echo   !STEP_INDEX!. %%S ^(depends: !STEP_DEPS_DISPLAY!^)
  ) else (
    echo   !STEP_INDEX!. %%S ^(no dependencies^)
  )
)
set "STEP_INDEX="
set "STEP_DEPS_VALUE="
set "STEP_DEPS_DISPLAY="
exit /b 0

:run_init_step
if /I "%~1"=="check-deps" (
  call :check_deps
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="deps-install" (
  pushd "%ROOT_DIR%" >nul
  bun install
  set "RC=%ERRORLEVEL%"
  popd >nul
  exit /b %RC%
)
if /I "%~1"=="create-env" (
  call :create_env_files
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="start-compose" (
  call :compose_up
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="wait-healthy" (
  call :wait_healthy
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="migrate" (
  call :migrate_database
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="seed" (
  call :cmd_seed
  exit /b %ERRORLEVEL%
)
if /I "%~1"=="bootstrap-dev-workspace" (
  call :cmd_bootstrap_dev_workspace
  exit /b %ERRORLEVEL%
)
call :log_error "Unknown init step: %~1"
exit /b 1

:cmd_init
set "INIT_STEPS=check-deps deps-install create-env start-compose wait-healthy migrate seed bootstrap-dev-workspace"
set "INIT_STEP_LIST=check-deps, deps-install, create-env, start-compose, wait-healthy, migrate, seed, bootstrap-dev-workspace"
set "STEP_DEPS_check_deps="
set "STEP_DEPS_deps_install="
set "STEP_DEPS_create_env="
set "STEP_DEPS_start_compose=check-deps"
set "STEP_DEPS_wait_healthy=start-compose"
set "STEP_DEPS_migrate=wait-healthy"
set "STEP_DEPS_seed=migrate"
set "STEP_DEPS_bootstrap_dev_workspace=seed"

set "SKIP_STEPS="
for %%S in (%INIT_STEPS%) do (
  call :step_to_var "%%S" STEP_KEY
  set "SKIP_SET_!STEP_KEY!="
)
set "STEP_KEY="
set "LIST_STEPS=false"
for %%A in (%*) do (
  if /I "%%~A"=="--list-steps" set "LIST_STEPS=true"
)

:parse_init_args
if "%~1"=="" goto :init_args_done
if /I "%~1"=="--list-steps" (
  set "LIST_STEPS=true"
  shift
  goto :parse_init_args
)
if /I "%~1"=="--skip-steps" (
  if "%~2"=="" (
    call :log_error "Missing value for --skip-steps"
    exit /b 1
  )
  if /I not "%LIST_STEPS%"=="true" (
    call :add_skip_steps_from_value "%~2" || exit /b 1
  )
  shift
  shift
  goto :parse_init_args
)
set "ARG=%~1"
if /I "!ARG:~0,13!"=="--skip-steps=" (
  if /I not "%LIST_STEPS%"=="true" (
    set "SKIP_VALUE=!ARG:~13!"
    call :add_skip_steps_from_value "!SKIP_VALUE!" || exit /b 1
  )
  shift
  goto :parse_init_args
)
call :log_error "Unknown option: %~1"
call :cmd_help
exit /b 1

:init_args_done
if /I "%LIST_STEPS%"=="true" (
  call :init_list_steps
  exit /b %ERRORLEVEL%
)

call :validate_skip_dependencies || exit /b 1

call :require_root || exit /b 1

for %%S in (%INIT_STEPS%) do (
  call :is_step_skipped "%%S"
  if !ERRORLEVEL! EQU 0 (
    call :log_warn "Skipping step: %%S"
  ) else (
    call :log_info "Running step: %%S"
    call :run_init_step "%%S" || exit /b 1
  )
)

set "START_NOW="
set /p START_NOW="Start development processes now? [y/N] "
if /I "%START_NOW%"=="y" (
  call :cmd_start
  exit /b %ERRORLEVEL%
)
call :log_success "Init completed"
exit /b 0

:cmd_start
call :require_root || exit /b 1
call :check_deps || exit /b 1

set "DOCKER_ONLY=false"
set "DEV_ONLY=false"
set "RUN_VALUES="
set "TURBO_FILTERS="

:parse_start_args
if "%~1"=="" goto :start_args_done
if /I "%~1"=="--docker-only" (
  set "DOCKER_ONLY=true"
  shift
  goto :parse_start_args
)
if /I "%~1"=="--dev-only" (
  set "DEV_ONLY=true"
  shift
  goto :parse_start_args
)
if /I "%~1"=="--run" (
  if "%~2"=="" (
    call :log_error "Missing value for --run"
    call :log_error "Example: scripts\dev.cmd start --run web,read-receipt,message-indexer"
    call :log_error "See README.md for full --run target list and usage details"
    exit /b 1
  )
  if defined RUN_VALUES (
    set "RUN_VALUES=!RUN_VALUES!,%~2"
  ) else (
    set "RUN_VALUES=%~2"
  )
  shift
  shift
  goto :parse_start_args
)
set "ARG=%~1"
if /I "!ARG:~0,6!"=="--run=" (
  set "RUN_ARG=!ARG:~6!"
  if defined RUN_VALUES (
    set "RUN_VALUES=!RUN_VALUES!,!RUN_ARG!"
  ) else (
    set "RUN_VALUES=!RUN_ARG!"
  )
  set "RUN_ARG="
  shift
  goto :parse_start_args
)
call :log_error "Unknown option: %~1"
call :cmd_help
exit /b 1

:start_args_done
if defined RUN_VALUES (
  set "RUN_VALUES=!RUN_VALUES:,= !"
  for %%T in (!RUN_VALUES!) do (
    if /I "%%~T"=="all" (
      rem no filter
    ) else if /I "%%~T"=="web" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F web"
    ) else if /I "%%~T"=="www" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F www"
    ) else if /I "%%~T"=="server" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F server"
    ) else if /I "%%~T"=="read-receipt" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F read-receipt"
    ) else if /I "%%~T"=="message-search" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F message-search"
    ) else if /I "%%~T"=="message-indexer" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F message-search"
    ) else if /I "%%~T"=="notification" (
      set "TURBO_FILTERS=!TURBO_FILTERS! -F @work-holo/notification-worker"
    ) else (
      call :log_error "Unknown run target '%%~T'. Allowed: all, web, www, server, read-receipt, message-search, message-indexer, notification"
      call :log_error "See README.md for full --run target list and usage details"
      exit /b 1
    )
  )
)

if "%DOCKER_ONLY%"=="true" if "%DEV_ONLY%"=="true" (
  call :log_error "Cannot use both --docker-only and --dev-only"
  exit /b 1
)

if "%DOCKER_ONLY%"=="true" if defined TURBO_FILTERS (
  call :log_error "--run cannot be used with --docker-only"
  exit /b 1
)

if "%DOCKER_ONLY%"=="true" (
  call :compose_up || exit /b 1
  call :wait_healthy || exit /b 1
  call :log_success "Docker services started"
  exit /b 0
)

if "%DEV_ONLY%"=="true" (
  set /a RUNNING_COUNT=0
  for %%S in (%CORE_SERVICES%) do (
    set "SERVICE_ID="
    if "%COMPOSE_IS_V2%"=="1" (
      for /f "usebackq delims=" %%I in (`docker compose ps -q %%S 2^>nul`) do (
        if not defined SERVICE_ID set "SERVICE_ID=%%I"
      )
    ) else (
      for /f "usebackq delims=" %%I in (`docker-compose ps -q %%S 2^>nul`) do (
        if not defined SERVICE_ID set "SERVICE_ID=%%I"
      )
    )
    if defined SERVICE_ID (
      set "STATE="
      for /f "usebackq delims=" %%A in (`docker inspect --format "{{.State.Status}}" "!SERVICE_ID!" 2^>nul`) do (
        set "STATE=%%A"
      )
      if /I "!STATE!"=="running" set /a RUNNING_COUNT+=1
    )
  )

  if !RUNNING_COUNT! EQU 0 (
    call :log_info "No Docker services running. Starting services first..."
    call :compose_up || exit /b 1
    call :wait_healthy || exit /b 1
  ) else if !RUNNING_COUNT! LSS 8 (
    call :log_warn "Only !RUNNING_COUNT!/8 services are running. Some features may not work."
  )

  call :log_info "Starting dev server (with TUI)"
  pushd "%ROOT_DIR%" >nul
  call :start_type_watchers
  if defined TURBO_FILTERS (
    bun run dev -- !TURBO_FILTERS!
  ) else (
    bun dev
  )
  set "RC=%ERRORLEVEL%"
  call :stop_type_watcher
  popd >nul
  exit /b %RC%
)

call :compose_up || exit /b 1
call :wait_healthy || exit /b 1
set "START_WAS_INTERRUPTED=false"
pushd "%ROOT_DIR%" >nul
set "TURBO_UI=0"
call :start_type_watchers
if defined TURBO_FILTERS (
  bun run dev -- !TURBO_FILTERS!
) else (
  bun dev
)
set "RC=%ERRORLEVEL%"
call :stop_type_watcher
popd >nul
if "%RC%"=="130" set "START_WAS_INTERRUPTED=true"
if "%RC%"=="3221225786" set "START_WAS_INTERRUPTED=true"
if /I "%START_WAS_INTERRUPTED%"=="true" (
  call :handle_interrupt
  exit /b 0
)
if not %RC%==0 call :log_warn "bun dev exited with code %RC%"
exit /b %RC%

:stop_type_watcher
powershell -NoProfile -Command "Get-Process -Name bun -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*generate:types:watch*' } | Stop-Process -Force -ErrorAction SilentlyContinue" >nul 2>nul
exit /b 0

:start_type_watchers
set "TYPE_GEN_STARTED="
if not defined RUN_VALUES (
  call :log_info "Starting type watcher: apps\web"
  start /b cmd /c "cd /d %ROOT_DIR%\apps\web && bun run generate:types:watch"
  call :log_info "Starting type watcher: packages\api"
  start /b cmd /c "cd /d %ROOT_DIR%\packages\api && bun run generate:types:watch"
  call :log_info "Starting type watcher: packages\db"
  start /b cmd /c "cd /d %ROOT_DIR%\packages\db && bun run generate:types:watch"
  exit /b 0
)
for %%T in (!RUN_VALUES!) do (
  if /I "%%~T"=="all" (
    call :log_info "Starting type watcher: apps\web"
    start /b cmd /c "cd /d %ROOT_DIR%\apps\web && bun run generate:types:watch"
    call :log_info "Starting type watcher: packages\api"
    start /b cmd /c "cd /d %ROOT_DIR%\packages\api && bun run generate:types:watch"
    call :log_info "Starting type watcher: packages\db"
    start /b cmd /c "cd /d %ROOT_DIR%\packages\db && bun run generate:types:watch"
  ) else if /I "%%~T"=="web" (
    call :log_info "Starting type watcher: apps\web"
    start /b cmd /c "cd /d %ROOT_DIR%\apps\web && bun run generate:types:watch"
  ) else if /I "%%~T"=="server" (
    call :log_info "Starting type watcher: packages\api"
    start /b cmd /c "cd /d %ROOT_DIR%\packages\api && bun run generate:types:watch"
    call :log_info "Starting type watcher: packages\db"
    start /b cmd /c "cd /d %ROOT_DIR%\packages\db && bun run generate:types:watch"
  )
)
exit /b 0

:handle_interrupt
echo.
choice /C YN /N /T 5 /D Y /M "Stopping docker services in 5s... Press N to keep running"
if %ERRORLEVEL%==2 (
  call :log_warn "Keeping services running"
  exit /b 0
)
call :cmd_stop
exit /b %ERRORLEVEL%

:cmd_stop
call :require_root || exit /b 1
call :check_deps || exit /b 1
call :compose_stop
exit /b %ERRORLEVEL%

:cmd_reset_services
call :require_root || exit /b 1
call :check_deps || exit /b 1

set "RESET_INIT_ARGS="

:parse_reset_services_args
if "%~1"=="" goto :reset_services_args_done
if /I "%~1"=="--skip-init-steps" (
  if "%~2"=="" (
    call :log_error "Missing value for --skip-init-steps"
    exit /b 1
  )
  if "%~2"=="""" (
    call :log_error "Empty value for --skip-init-steps"
    exit /b 1
  )
  set "RESET_INIT_ARGS=!RESET_INIT_ARGS! --skip-steps ""%~2"""
  shift
  shift
  goto :parse_reset_services_args
)
set "ARG=%~1"
if /I "!ARG:~0,18!"=="--skip-init-steps=" (
  set "SKIP_INIT_VALUE=!ARG:~18!"
  if not defined SKIP_INIT_VALUE (
    call :log_error "Empty value for --skip-init-steps"
    exit /b 1
  )
  set "RESET_INIT_ARGS=!RESET_INIT_ARGS! --skip-steps ""!SKIP_INIT_VALUE!"""
  set "SKIP_INIT_VALUE="
  shift
  goto :parse_reset_services_args
)
call :log_error "Unknown option: %~1"
call :cmd_help
exit /b 1

:reset_services_args_done
call :log_warn "This will run down --volumes --remove-orphans"
set "ANSWER="
set /p ANSWER="Continue? [y/N] "
if /I not "%ANSWER%"=="y" (
  call :log_info "Cancelled"
  exit /b 0
)
call :docker_compose down --volumes --remove-orphans || exit /b 1
call :cmd_init %RESET_INIT_ARGS%
exit /b %ERRORLEVEL%

:cmd_update_packages
call :require_root || exit /b 1
call :check_deps || exit /b 1

call :log_info "Updating root packages"
pushd "%ROOT_DIR%" >nul
bun update --latest
if not %ERRORLEVEL%==0 (
  popd >nul
  exit /b 1
)
popd >nul

for %%P in (apps packages workers) do (
  if exist "%ROOT_DIR%\%%P" (
    for /d %%D in ("%ROOT_DIR%\%%P\*") do (
      if exist "%%~fD\package.json" (
        call :log_info "Updating %%~fD"
        pushd "%%~fD" >nul
        bun update --latest
        if not !ERRORLEVEL!==0 (
          popd >nul
          exit /b 1
        )
        popd >nul
      )
    )
  )
)

call :log_info "Cleaning up node_modules and lock files"
for %%P in (apps packages workers) do (
  if exist "%ROOT_DIR%\%%P" (
    for /d %%D in ("%ROOT_DIR%\%%P\*") do (
      if exist "%%~fD\package.json" (
        if exist "%%~fD\node_modules" (
          call :log_info "Removing %%~fD\node_modules"
          rmdir /s /q "%%~fD\node_modules"
        )
      )
    )
  )
)

if exist "%ROOT_DIR%\bun.lock" (
  call :log_info "Removing bun.lock"
  del /f /q "%ROOT_DIR%\bun.lock"
)

pushd "%ROOT_DIR%" >nul
bun install
set "RC=%ERRORLEVEL%"
popd >nul
if not %RC%==0 exit /b %RC%

call :log_success "Package updates completed"
exit /b 0

:check_env_exists
if exist "%ROOT_DIR%\%~1" (
  call :log_success "Found %~1"
  exit /b 0
)
call :log_error "Missing %~1"
exit /b 1

:check_service_running
set "SERVICE=%~1"
set "SERVICE_ID="

if "%COMPOSE_IS_V2%"=="1" (
  for /f "usebackq delims=" %%I in (`docker compose ps -q %SERVICE% 2^>nul`) do (
    if not defined SERVICE_ID set "SERVICE_ID=%%I"
  )
) else (
  for /f "usebackq delims=" %%I in (`docker-compose ps -q %SERVICE% 2^>nul`) do (
    if not defined SERVICE_ID set "SERVICE_ID=%%I"
  )
)

if not defined SERVICE_ID (
  call :log_error "Service not running: %SERVICE%"
  exit /b 1
)

set "STATE="
for /f "usebackq delims=" %%A in (`docker inspect --format "{{.State.Status}}" "%SERVICE_ID%" 2^>nul`) do set "STATE=%%A"

if /I "%STATE%"=="running" (
  call :log_success "Service running: %SERVICE%"
  exit /b 0
)

call :log_error "Service status '%STATE%': %SERVICE%"
exit /b 1

:check_port
powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1', %~1); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>nul
if %ERRORLEVEL%==0 (
  call :log_success "Port open: %~1"
  exit /b 0
)
call :log_error "Port closed: %~1"
exit /b 1

:cmd_doctor
call :require_root || exit /b 1
set /a FAILED=0

call :check_deps || set /a FAILED=1
call :check_env_exists "%ENV_SERVER%" || set /a FAILED=1
call :check_env_exists "%ENV_WEB%" || set /a FAILED=1
call :check_env_exists "%ENV_WWW%" || set /a FAILED=1
call :check_env_exists "%ENV_NOTIFICATION%" || set /a FAILED=1
call :check_env_exists "%ENV_SEARCH%" || set /a FAILED=1
call :check_env_exists "%ENV_READ_RECEIPT%" || set /a FAILED=1

for %%S in (%CORE_SERVICES%) do (
  call :check_service_running %%S || set /a FAILED=1
)

for %%P in (%DOCTOR_PORTS%) do (
  call :check_port %%P || set /a FAILED=1
)

if %FAILED% EQU 0 (
  call :log_success "Doctor passed"
  exit /b 0
)
call :log_error "Doctor found issues"
exit /b 1

:cmd_status
call :require_root || exit /b 1
call :check_deps || exit /b 1

call :log_info "Docker Services"
set /a RUNNING=0
set /a TOTAL=0

for %%S in (%CORE_SERVICES%) do (
  set /a TOTAL+=1
  set "SERVICE_ID="

  if "%COMPOSE_IS_V2%"=="1" (
    for /f "usebackq delims=" %%I in (`docker compose ps -q %%S 2^>nul`) do (
      if not defined SERVICE_ID set "SERVICE_ID=%%I"
    )
  ) else (
    for /f "usebackq delims=" %%I in (`docker-compose ps -q %%S 2^>nul`) do (
      if not defined SERVICE_ID set "SERVICE_ID=%%I"
    )
  )

  if defined SERVICE_ID (
    set "STATE="
    set "HEALTH="
    for /f "usebackq delims=" %%A in (`docker inspect --format "{{.State.Status}}" "!SERVICE_ID!" 2^>nul`) do set "STATE=%%A"
    for /f "usebackq delims=" %%A in (`docker inspect --format "{{if .State.Health}}{{.State.Health.Status}}{{else}}no health check{{end}}" "!SERVICE_ID!" 2^>nul`) do set "HEALTH=%%A"

    if /I "!STATE!"=="running" (
      echo   + %%S running ^(!HEALTH!^)
      set /a RUNNING+=1
    ) else (
      echo   - %%S !STATE!
    )
  ) else (
    echo   - %%S not running
  )
)

echo.
call :log_info "Ports"
for %%P in (%DOCTOR_PORTS%) do (
  powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1', %%P); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>nul
  if !ERRORLEVEL! EQU 0 (
    echo   + %%P open
  ) else (
    echo   - %%P closed
  )
)

echo.
call :log_info "Environment Files"
call :check_env_exists "%ENV_SERVER%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_SERVER%
) else (
  echo   - %ENV_SERVER%
)
call :check_env_exists "%ENV_WEB%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_WEB%
) else (
  echo   - %ENV_WEB%
)
call :check_env_exists "%ENV_WWW%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_WWW%
 ) else (
  echo   - %ENV_WWW%
 )
call :check_env_exists "%ENV_NOTIFICATION%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_NOTIFICATION%
) else (
  echo   - %ENV_NOTIFICATION%
)
call :check_env_exists "%ENV_SEARCH%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_SEARCH%
) else (
  echo   - %ENV_SEARCH%
)
call :check_env_exists "%ENV_READ_RECEIPT%" >nul 2>nul
if %ERRORLEVEL%==0 (
  echo   + %ENV_READ_RECEIPT%
) else (
  echo   - %ENV_READ_RECEIPT%
)

echo.
if %RUNNING% EQU %TOTAL% (
  call :log_success "All %TOTAL% services running"
) else (
  call :log_warn "%RUNNING%/%TOTAL% services running"
)
exit /b 0

:cmd_logs
call :require_root || exit /b 1
call :check_deps || exit /b 1
if "%~1"=="" (
  call :docker_compose logs -f
) else (
  call :docker_compose logs -f %~1
)
exit /b %ERRORLEVEL%

:cmd_help
echo work-holo development workflow manager
echo.
echo Usage:
echo   scripts\dev.cmd ^<command^> [options]
echo   scripts\dev.cmd --help
echo   scripts\dev.cmd -h
echo.
echo Commands:
echo   init [--skip-steps step1,step2] [--list-steps]
echo   start
echo   stop-services
echo   reset-services [--skip-init-steps step1,step2]
echo   update-packages
echo   doctor
echo   status
echo   logs [service]
echo   seed [--only=X]
echo.
echo Command behavior:
echo   status
echo     - show docker service status
echo     - show port status
echo     - show env file status
echo   init
echo     - steps run in order: check-deps, deps-install, create-env, start-compose, wait-healthy, migrate, seed, bootstrap-dev-workspace
echo     - use --skip-steps to skip specific steps ^(comma-separated^)
echo     - dependency validation only enforces init step ordering/runtime prerequisites
echo     - deps-install can be skipped when dependencies were installed manually beforehand
echo     - skipping a step that later init steps still depend on will error unless you also skip dependents
echo     - use --list-steps to show available steps and dependencies
echo     - prompt to start dev
echo.
echo   start [--docker-only] [--dev-only] [--run target1,target2]
echo     Default: docker compose up -d, wait healthy, bun dev
echo     --docker-only: start only docker services
echo     --dev-only: start only dev server ^(with TUI^), auto-start services if needed
echo     --run: run only selected targets via turbo filters
echo            allowed: all, web, www, server, read-receipt, message-search, message-indexer, notification
echo            example: scripts\dev.cmd start --run web,read-receipt,message-indexer
echo     Type generators (web, api, db) run automatically in watch mode alongside dev.
echo     Ctrl+C prompt: Docker services will stop in 5s. Press 'n' to keep them running...
echo.
echo   stop-services
echo     - docker compose stop
echo.
echo   reset-services
echo     - confirm
echo     - docker compose down --volumes --remove-orphans
echo     - rerun init after teardown
echo     - use --skip-init-steps to forward skip lists to the init --skip-steps
echo.
echo   update-packages
echo     - for each folder in apps/* packages/* workers/* with package.json
echo       run bun update --latest
echo     - remove all node_modules folders
echo     - remove bun.lock
echo     - bun install at root
echo.
echo   doctor
echo     - check deps
echo     - check env files
echo     - check services
echo     - check ports: 5432,5003,6379,5672,9200,9000,6001,8080
echo.
echo   logs [service]
echo     - docker compose logs -f [service]
echo.
echo   seed [--only=X]
echo     - bun run --cwd apps/seeder src/index.ts %%*
echo.
echo   bootstrap-dev-workspace init step
echo     - creates owner/admin/member dev users
echo     - creates the default organization, teams, and channels
echo     - enables org-wide direct messages for the bootstrap organization
echo     - writes USER1..USER7 credentials into apps/server/.env
echo.
echo Managed env files:
echo   apps/server/.env
echo   apps/web/.env
echo   apps/www/.env
echo   workers/notification/.env
echo   workers/message-search/.env
echo   workers/read-receipt/.env
echo.
echo VAPID generation:
echo   bunx web-push generate-vapid-keys --json
echo   shared across server/web/notification env files
echo   on failure, VAPID values remain empty
echo.
echo Auth secret generation:
echo   npx --yes auth secret
echo   fallback: bunx auth secret
echo   fallback: openssl rand -base64 32
echo.
echo Docker compose detection:
echo   prefers docker compose ^(v2^), fallback docker-compose ^(v1^)
echo.
echo Migration strategy:
echo   bun db:migrate
echo.
exit /b 0
