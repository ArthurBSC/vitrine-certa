# n8n no VPS com Easypanel — como ficou

Registro do que está instalado no servidor **72.60.115.84**, para quando precisar mexer ou refazer.

## Por que não o install.sh

Esse VPS não está vazio. Ele roda:

- **Easypanel** (painel na porta 3000) e **Traefik 3.6.7** mandando nas portas 80/443
- projeto `prjleads`: Evolution API + Postgres 17 + Redis
- CRM Leads (backend, worker, Postgres, Redis) na porta 3333
- NURA na porta 4001, servindo `nurasys.com.br`, `api.nurasys.com.br`, `exibicao.nurasys.com.br`, `unialfa.nurasys.com.br` e `ngbagent.com.br`

O `install.sh` sobe um Caddy próprio nas portas 80/443 e derrubaria o Traefik, levando junto o NURA, o CRM e a Evolution API. Ele agora detecta portas ocupadas e para antes de mexer em nada — serve para servidor limpo.

Aqui o n8n entra como **app do Easypanel**, em projeto separado: o Traefik dá domínio e HTTPS, e nada encosta no que já roda.

---

## O que está no ar

| | |
|---|---|
| Projeto | `vitrine` |
| n8n | https://vitrine-n8n.6lpnbe.easypanel.host |
| Mídia pública | https://vitrine-midia.6lpnbe.easypanel.host |
| Imagem do n8n | `docker.n8n.io/n8nio/n8n:1.123.97` (fixa, não se atualiza sozinha) |
| Banco | SQLite, dentro do volume `n8n-data` |

Os domínios `*.easypanel.host` vêm do próprio painel, com certificado automático. Não precisou de `sslip.io` nem de domínio comprado.

### Banco: por que SQLite

Para 4 posts por dia mais o atendimento, SQLite dá e sobra, e o backup é um arquivo só dentro do volume. Se um dia o volume de execuções crescer muito, dá para migrar para Postgres sem refazer os fluxos.

---

## App `n8n`

**Source** → Docker Image: `docker.n8n.io/n8nio/n8n:1.123.97`

**Environment:**

```
N8N_HOST=vitrine-n8n.6lpnbe.easypanel.host
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://vitrine-n8n.6lpnbe.easypanel.host/
N8N_EDITOR_BASE_URL=https://vitrine-n8n.6lpnbe.easypanel.host/
GENERIC_TIMEZONE=America/Sao_Paulo
TZ=America/Sao_Paulo
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
N8N_DIAGNOSTICS_ENABLED=false
N8N_RUNNERS_ENABLED=true
N8N_PROXY_HOPS=1
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
MIDIA_BASE_URL=https://vitrine-midia.6lpnbe.easypanel.host
VITRINE_URL=https://vitrine-certa-production.up.railway.app
META_VERIFY_TOKEN=(gerado na instalação)
IG_USER_ID=
IG_TOKEN=
ELEVEN_API_KEY=
ELEVEN_VOICE_ID=
```

> `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` não é opcional: os três fluxos leem `IG_TOKEN`, `MIDIA_BASE_URL` e companhia por `$env`. Sem isso, nada funciona.

**Domains:** `vitrine-n8n.6lpnbe.easypanel.host` → porta **5678**, HTTPS ligado.

**Mounts:**

| Tipo | Origem | Dentro do container |
|---|---|---|
| Volume `n8n-data` | — | `/home/node/.n8n` |
| Bind | `/opt/vitrine-midia` | `/midia` |
| Bind | `/opt/vitrine-repo/automacao/n8n/workflows` | `/fluxos` |

## App `midia`

A API do Instagram só aceita vídeo por URL pública HTTPS — link do Google Drive não serve. Este app serve a mesma pasta que o n8n escreve.

- Docker Image: `halverneus/static-file-server:latest`
- Environment: `FOLDER=/web`, `SHOW_LISTING=true`, `PORT=8080`
- Domains: `vitrine-midia.6lpnbe.easypanel.host` → porta **8080**, HTTPS ligado
- Mounts → Bind: `/opt/vitrine-midia` → `/web`

---

## Pastas no servidor

```bash
ls /opt/vitrine-repo /opt/vitrine-midia/pub
```

- `/opt/vitrine-repo` — este repositório, clonado. É de onde vêm os fluxos.
- `/opt/vitrine-midia/pub` — onde o fluxo 1 grava o arquivo antes de publicar. Dono `uid 1000`, que é o usuário `node` do container.

## Importar os fluxos

Depois de criar a conta de dono no n8n:

```bash
docker exec -u node $(docker ps -qf name=vitrine_n8n) n8n import:workflow --separate --input=/fluxos
```

## Atualizar os fluxos quando mudarem aqui

```bash
git -C /opt/vitrine-repo pull --ff-only
```

Depois rode o comando de importar de novo: ele sobrescreve pelo id, sem duplicar.

## Olhar o log

```bash
docker service logs vitrine_n8n --tail 50 -f
```

---

## Daqui pra frente

O resto é igual ao [README](README.md): planilha, pastas do Drive, token do Instagram, credenciais e os testes. Só ignore a seção 1 dele, que é a instalação em servidor limpo.

### Antes de ativar o fluxo 1

Ele publica de verdade no horário marcado. Teste com o botão *Execute workflow* e uma linha de teste na planilha antes de ligar a chave.
