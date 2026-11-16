# Instalar o n8n no VPS que já tem Easypanel

Este é o caminho **para o servidor 72.60.115.84**, que já roda:

- Easypanel (painel na porta 3000) e **Traefik** mandando nas portas 80/443
- projeto `prjleads`: Evolution API + Postgres 17 + Redis
- CRM Leads (backend, worker, Postgres, Redis) na porta 3333
- NURA na porta 4001

Por isso **não** se usa o `install.sh` aqui: ele subiria um Caddy próprio nas portas 80/443 e derrubaria o Traefik, levando CRM e Evolution API com ele. O `install.sh` agora detecta isso e para antes de mexer em nada — ele serve para um servidor limpo.

No Easypanel o n8n entra como app: o Traefik cuida de domínio e HTTPS, o Postgres fica gerenciado e nada encosta no que já está no ar.

---

## 1. Projeto

No painel, **Create Project** → nome `vitrine`.

## 2. Banco

Dentro do projeto: **+ Service → Postgres**.

- Nome: `n8n-db`
- Senha: gere uma forte e guarde

## 3. App do n8n

**+ Service → App**, nome `n8n`.

**Source** → Docker Image: `n8nio/n8n:latest`

**Environment** (cole tudo de uma vez e troque o que está em MAIÚSCULA):

```
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=vitrine_n8n-db
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n-db
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=A_SENHA_DO_PASSO_2
N8N_ENCRYPTION_KEY=GERE_UMA_CHAVE_LONGA_E_GUARDE
N8N_HOST=n8n.72-60-115-84.sslip.io
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://n8n.72-60-115-84.sslip.io/
N8N_EDITOR_BASE_URL=https://n8n.72-60-115-84.sslip.io/
GENERIC_TIMEZONE=America/Sao_Paulo
TZ=America/Sao_Paulo
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
N8N_DIAGNOSTICS_ENABLED=false
N8N_RUNNERS_ENABLED=true
N8N_PROXY_HOPS=1
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
MIDIA_BASE_URL=https://midia.72-60-115-84.sslip.io
VITRINE_URL=https://vitrine-certa-production.up.railway.app
IG_USER_ID=
IG_TOKEN=
META_VERIFY_TOKEN=GERE_UM_TEXTO_ALEATORIO
ELEVEN_API_KEY=
ELEVEN_VOICE_ID=
```

> `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` não é opcional: os três fluxos leem `IG_TOKEN`, `MIDIA_BASE_URL` e companhia por `$env`. Sem isso, nada funciona.
>
> `N8N_ENCRYPTION_KEY` é o que decifra as credenciais salvas. Se você trocar essa chave depois, perde todas as credenciais do n8n e tem que refazer os logins do Google.

**Domains** → Add Domain:
- Host: `n8n.72-60-115-84.sslip.io`
- Port: `5678`
- HTTPS: ligado

**Mounts** → Bind Mount:
| Host | Container |
|---|---|
| `/opt/vitrine-midia` | `/midia` |
| `/opt/vitrine-fluxos` | `/fluxos` |

**Deploy**.

## 4. App da mídia pública

A API do Instagram só aceita vídeo por URL pública HTTPS — link do Google Drive não serve. Então um app minúsculo serve a mesma pasta que o n8n escreve.

**+ Service → App**, nome `midia`.

- Docker Image: `halverneus/static-file-server:latest`
- Environment: `FOLDER=/web` e `SHOW_LISTING=true`
- Domains: host `midia.72-60-115-84.sslip.io`, port `8080`, HTTPS ligado
- Mounts → Bind Mount: host `/opt/vitrine-midia` → container `/web`

**Deploy**. Teste abrindo `https://midia.72-60-115-84.sslip.io/`.

## 5. Os fluxos

No servidor, uma vez:

```bash
git clone --depth 1 https://github.com/ArthurBSC/vitrine-certa.git /opt/vitrine-repo && ln -sfn /opt/vitrine-repo/automacao/n8n/workflows /opt/vitrine-fluxos && mkdir -p /opt/vitrine-midia/pub && chown -R 1000:1000 /opt/vitrine-midia
```

Depois abra `https://n8n.72-60-115-84.sslip.io`, crie a conta de dono e importe os três de uma vez:

```bash
docker exec -u node $(docker ps -qf name=vitrine_n8n) n8n import:workflow --separate --input=/fluxos
```

Para atualizar os fluxos quando eu mexer neles aqui:

```bash
git -C /opt/vitrine-repo pull --ff-only
```

## 6. Daqui pra frente

O resto é igual ao [README](README.md): planilha, pastas do Drive, token do Instagram, credenciais e os testes. Só ignore a seção 1 dele, que é a instalação em servidor limpo.

### Antes de ativar o fluxo 1

Ele publica de verdade no horário marcado. Teste com o botão *Execute workflow* e uma linha de teste na planilha antes de ligar a chave.
