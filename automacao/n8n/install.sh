#!/usr/bin/env bash
# =============================================================
#  Vitrine Certa - instalador do n8n no VPS (Ubuntu 22/24)
#  Uso:  curl -fsSL https://raw.githubusercontent.com/ArthurBSC/vitrine-certa/main/automacao/n8n/install.sh | bash
# =============================================================
set -euo pipefail

BASE=/opt/vitrine
REPO=https://github.com/ArthurBSC/vitrine-certa.git
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
  apt-get install -y -qq ca-certificates curl gnupg git >/dev/null
  curl -fsSL https://get.docker.com | sh
fi
command -v git >/dev/null 2>&1 || apt-get install -y -qq git >/dev/null
systemctl enable --now docker >/dev/null 2>&1 || true

# ---------- 2. Pastas ----------
mkdir -p "$BASE"/{caddy/data,caddy/config,n8n/data,n8n/files,midia/pub,pg}

# ---------- 2b. Codigo do projeto (fluxos do n8n) ----------
if [ -d "$BASE/repo/.git" ]; then
  echo ">> Atualizando o repositorio..."
  git -C "$BASE/repo" pull --ff-only
else
  echo ">> Clonando o repositorio..."
  git clone --depth 1 "$REPO" "$BASE/repo"
fi

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
      - ./repo/automacao/n8n/workflows:/fluxos:ro
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

# ---------- 7. Atalhos ----------
cat > "$BASE/importar-fluxos.sh" <<'IMPEOF'
#!/usr/bin/env bash
# Importa (ou reimporta) os 3 fluxos da Vitrine Certa no n8n.
# Rode DEPOIS de criar a conta de dono no painel do n8n.
set -euo pipefail
cd /opt/vitrine
docker compose exec -u node n8n n8n import:workflow --separate --input=/fluxos
echo
echo "Fluxos importados. Agora, no painel do n8n:"
echo "  1. Crie as credenciais Google Sheets, Google Drive e Anthropic."
echo "  2. Troque COLE_O_ID_DA_PLANILHA e os ids das pastas do Drive."
echo "  3. Ative um por um, comecando pelos fluxos 2 e 3."
IMPEOF
chmod +x "$BASE/importar-fluxos.sh"

cat > "$BASE/atualizar.sh" <<'UPDEOF'
#!/usr/bin/env bash
# Puxa a versao nova dos fluxos e atualiza o n8n.
set -euo pipefail
git -C /opt/vitrine/repo pull --ff-only
cd /opt/vitrine
docker compose pull -q
docker compose up -d
echo "Pronto. Para reimportar os fluxos: /opt/vitrine/importar-fluxos.sh"
UPDEOF
chmod +x "$BASE/atualizar.sh"

# ---------- 8. Subir ----------
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
echo " PROXIMO PASSO"
echo "   1. Abra o n8n no link acima e crie a conta de dono."
echo "   2. Rode:  /opt/vitrine/importar-fluxos.sh"
echo
echo " Para atualizar depois:  /opt/vitrine/atualizar.sh"
echo
echo " Segredos e tokens ficam em: $ENV"
echo " Token de verificacao do webhook da Meta:"
grep META_VERIFY_TOKEN "$ENV"
echo "============================================================"
