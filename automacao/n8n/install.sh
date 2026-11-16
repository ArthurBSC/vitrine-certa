#!/usr/bin/env bash
# =============================================================
#  Vitrine Certa - instalador do n8n no VPS (Ubuntu 22/24)
#  Uso:  curl -fsSL https://raw.githubusercontent.com/ArthurBSC/vitrine-certa/main/automacao/n8n/install.sh | bash
# =============================================================
set -euo pipefail

BASE=/opt/vitrine
IP="$(curl -4 -fsS https://ifconfig.me || hostname -I | awk '{print $1}')"
DASH="${IP//./-}"
N8N_HOST="n8n.${DASH}.sslip.io"
MIDIA_HOST="midia.${DASH}.sslip.io"
TZ_APP="America/Sao_Paulo"

echo ">> IP detectado: $IP"
echo ">> n8n   ->  https://${N8N_HOST}"
echo ">> midia ->  https://${MIDIA_HOST}"

# ---------- 1. Docker ----------
if ! command -v docker >/dev/null 2>&1; then
  echo ">> Instalando Docker..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg >/dev/null
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker >/dev/null 2>&1 || true

# ---------- 2. Pastas ----------
mkdir -p "$BASE"/{caddy/data,caddy/config,n8n/data,n8n/files,midia/pub,pg}
chown -R 1000:1000 "$BASE/n8n" "$BASE/midia"

# ---------- 3. .env (segredos gerados uma unica vez) ----------
ENV="$BASE/.env"
if [ ! -f "$ENV" ]; then
  echo ">> Gerando segredos em $ENV"
  cat > "$ENV" <<ENVEOF
# ---- infra (nao mexer) ----
N8N_HOST=${N8N_HOST}
MIDIA_HOST=${MIDIA_HOST}
MIDIA_BASE_URL=https://${MIDIA_HOST}
GENERIC_TIMEZONE=${TZ_APP}
N8N_ENCRYPTION_KEY=$(openssl rand -hex 24)
POSTGRES_PASSWORD=$(openssl rand -hex 16)

# ---- Instagram / Meta (preencher depois) ----
IG_USER_ID=
IG_TOKEN=
META_VERIFY_TOKEN=$(openssl rand -hex 8)

# ---- Vitrine ----
VITRINE_URL=https://vitrine-certa-production.up.railway.app

# ---- ElevenLabs (opcional) ----
ELEVEN_API_KEY=
ELEVEN_VOICE_ID=
ENVEOF
  chmod 600 "$ENV"
fi

# ---------- 4. docker-compose ----------
cat > "$BASE/docker-compose.yml" <<'YMLEOF'
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    env_file: .env
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy/data:/data
      - ./caddy/config:/config
      - ./midia:/srv/midia:ro

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./pg:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 10s
      retries: 10

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: unless-stopped
    depends_on:
      postgres: { condition: service_healthy }
    env_file: .env
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_HOST: ${N8N_HOST}
      N8N_PORT: 5678
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://${N8N_HOST}/
      N8N_EDITOR_BASE_URL: https://${N8N_HOST}/
      GENERIC_TIMEZONE: ${GENERIC_TIMEZONE}
      TZ: ${GENERIC_TIMEZONE}
      N8N_BLOCK_ENV_ACCESS_IN_NODE: "false"
      N8N_DIAGNOSTICS_ENABLED: "false"
      N8N_RUNNERS_ENABLED: "true"
      N8N_PROXY_HOPS: "1"
      DB_SQLITE_POOL_SIZE: "5"
      N8N_DEFAULT_BINARY_DATA_MODE: filesystem
      NODE_FUNCTION_ALLOW_BUILTIN: "*"
    volumes:
      - ./n8n/data:/home/node/.n8n
      - ./n8n/files:/files
      - ./midia:/midia
YMLEOF

# ---------- 5. Caddyfile ----------
cat > "$BASE/caddy/Caddyfile" <<'CADEOF'
{$N8N_HOST} {
	encode zstd gzip
	reverse_proxy n8n:5678
}

{$MIDIA_HOST} {
	encode zstd gzip
	header Access-Control-Allow-Origin *
	root * /srv/midia
	file_server browse
}
CADEOF

# ---------- 6. Firewall ----------
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp  >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
fi

# ---------- 7. Subir ----------
cd "$BASE"
docker compose pull -q
docker compose up -d

echo
echo "============================================================"
echo " n8n no ar (aguarde ~40s o certificado HTTPS):"
echo "   https://${N8N_HOST}"
echo " Midia publica:"
echo "   https://${MIDIA_HOST}/pub/"
echo
echo " Segredos e tokens ficam em: $ENV"
echo " Token de verificacao do webhook da Meta:"
grep META_VERIFY_TOKEN "$ENV"
echo "============================================================"
