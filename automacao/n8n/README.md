# Automação da Vitrine Certa (n8n no VPS)

Três fluxos prontos:

| Fluxo | O que faz |
|---|---|
| **1 · Publicador automático** | Lê a planilha, pega o arquivo no Drive e publica no Instagram (Reels, foto, carrossel e story) nos horários 9h / 13h / 19h / 20h. Volta na planilha e marca `POSTADO`. |
| **2 · Atendimento IA** | Responde comentário e direct com IA, consultando o catálogo real da vitrine antes de falar qualquer coisa. Grava tudo numa aba de log. |
| **3 · Legenda + narração IA** | Você joga um vídeo numa pasta do Drive; a IA escreve gancho, legenda e hashtags, grava a linha na planilha e (opcional) gera a narração em MP3 na ElevenLabs. |

A arquitetura: **Google Sheets é o cérebro** (data, hora, arquivo, legenda, link, status), **Drive é o depósito** e o **VPS** roda o n8n e serve a mídia num subdomínio público — porque a API do Instagram só aceita vídeo por URL pública HTTPS, e link do Drive não serve.

---

## 1. Instalar no VPS

No terminal do servidor, como root:

```bash
curl -fsSL https://raw.githubusercontent.com/ArthurBSC/vitrine-certa/main/automacao/n8n/install.sh | bash
```

Instala Docker, Postgres, n8n e Caddy (HTTPS automático), e cria:

- `https://n8n.72-60-115-84.sslip.io` — o painel do n8n
- `https://midia.72-60-115-84.sslip.io/pub/` — a mídia pública que o Instagram vai baixar
- `/opt/vitrine/.env` — onde ficam os segredos e os tokens

Primeiro acesso ao n8n: ele pede para criar o usuário dono. Use um e-mail seu e uma senha forte.

### Comandos do dia a dia

```bash
cd /opt/vitrine && docker compose ps
```

```bash
cd /opt/vitrine && docker compose logs -f n8n
```

```bash
cd /opt/vitrine && docker compose pull && docker compose up -d
```

---

## 2. A planilha

1. Crie uma planilha no Google chamada **Vitrine Certa — Calendário**.
2. Renomeie a primeira aba para **Calendario** e crie uma segunda aba chamada **Atendimento**.
3. Na aba `Calendario`, **antes de colar nada**, selecione a coluna B (data) e marque *Formatar → Número → Texto simples*. Isso evita que o Google transforme `2026-11-18` em outro formato e o fluxo pare de achar o dia.
4. Importe o arquivo `automacao/n8n/calendario.csv` (*Arquivo → Importar → Substituir planilha atual*, separador vírgula). São **112 linhas**: 28 posts de feed e 84 stories, de 17/11 a 14/12, com legenda e link prontos.
5. Na aba `Atendimento`, cabeçalho na linha 1: `quando`, `tipo`, `autor`, `mensagem`, `resposta`.
6. O id da planilha é o trecho do meio da URL: `docs.google.com/spreadsheets/d/`**`ESSE_PEDAÇO`**`/edit`.

### Colunas que importam

- `data` — `2026-11-18`, texto simples.
- `hora` — `19:00`. O fluxo só olha a hora inteira.
- `tipo` — `feed` ou `story`.
- `arquivo` — nome exato do arquivo no Drive. Vários separados por `|` viram carrossel.
- `status` — deixe vazio. O fluxo escreve `POSTADO` ou `ERRO`. **Linha com `POSTADO` nunca é publicada de novo.**

---

## 3. O Drive

Crie no seu Drive a pasta **Vitrine Certa** com três subpastas:

- `MIDIA` — jogue aqui tudo que está em `midia/drive/` do projeto (130 arquivos, ~110 MB, já renomeados no padrão `2026-11-18-feed-19h.mp4`).
- `1-ENTRADA` — onde você joga vídeo novo para a IA escrever a legenda (fluxo 3).
- `NARRACAO` — onde as narrações em MP3 vão cair.

O id de uma pasta é o final da URL dela: `drive.google.com/drive/folders/`**`ESSE_PEDAÇO`**.

---

## 4. Token do Instagram

O perfil tem que ser **profissional** e estar ligado a uma **página do Facebook** (já está).

1. Em `developers.facebook.com` → *Meus apps* → criar app do tipo **Business**.
2. Adicione o produto **Instagram** → *API com login do Instagram* (ou Graph API).
3. No **Graph API Explorer**, escolha o app e gere um token com estas permissões:
   `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`, `pages_show_list`, `pages_read_engagement`, `business_management`.
4. Pegue o id da conta do Instagram:
   - `GET /me/accounts` → copie o `id` da página.
   - `GET /{id-da-pagina}?fields=instagram_business_account` → o `id` que vier é o seu **IG_USER_ID**.
5. Troque o token curto por um de 60 dias em *Ferramentas → Depurador de token de acesso → Estender*. Para um token que não expira, crie um **usuário do sistema** no Business Manager e gere o token por lá — é o que eu recomendo.
6. No VPS, edite `/opt/vitrine/.env`, preencha `IG_USER_ID` e `IG_TOKEN`, e reinicie:

```bash
cd /opt/vitrine && nano .env && docker compose up -d --force-recreate n8n
```

---

## 5. Importar os fluxos

No n8n: *Workflows → ⋯ → Import from File*, um por vez, com os arquivos de `automacao/n8n/workflows/`.

Depois, em cada um, preencha o que está marcado:

- Nós de planilha: trocar `COLE_O_ID_DA_PLANILHA` pelo id real.
- `Drive: achar arquivo`: id da pasta `MIDIA`.
- `Novo arquivo na pasta`: id da pasta `1-ENTRADA`.
- `Drive: salvar narração`: id da pasta `NARRACAO`.

### Credenciais a criar no n8n (menu *Credentials*)

| Credencial | Para quê |
|---|---|
| Google Sheets OAuth2 | ler e escrever a planilha |
| Google Drive OAuth2 | baixar e salvar arquivos |
| Anthropic | a IA que escreve e atende |

Nas duas do Google, o n8n mostra a *OAuth Redirect URL*. Cole essa URL no seu projeto do Google Cloud (*APIs e serviços → Credenciais → ID do cliente OAuth → URIs de redirecionamento*) e ative as APIs **Google Sheets** e **Google Drive**. Como o n8n está num domínio HTTPS de verdade, o login do Google funciona normalmente.

Para usar OpenAI em vez da Anthropic: troque o nó **Claude** por *OpenAI Chat Model* e religue o fio no agente. Nada mais muda.

---

## 6. Testar antes de soltar

1. **Fluxo 1**: na planilha, mude a `data` e a `hora` de uma linha para daqui a uns minutos, deixe `status` vazio e clique em *Execute workflow*. Acompanhe: tem que aparecer o arquivo em `https://midia.72-60-115-84.sslip.io/pub/` e o post no perfil. Só depois ative o workflow (chave no topo) para ele rodar sozinho.
2. **Fluxo 2**: ative, copie a *Production URL* do nó `Entrada da Meta` e cadastre como webhook na Meta, com o `META_VERIFY_TOKEN` do `.env`. Assine `comments`, `messages` e `mentions`. Comente no seu próprio post para ver a resposta.
3. **Fluxo 3**: ative e jogue um vídeo em `1-ENTRADA`. Em até 1 minuto aparece uma linha nova com status `A PROGRAMAR`.

> Enquanto estiver testando, mantenha o fluxo 1 **desativado**. Ativo, ele publica de verdade no horário marcado.

---

## 7. Segurança

- `/opt/vitrine/.env` tem tokens com poder de publicar na sua conta. Não suba esse arquivo para o GitHub (ele vive só no VPS).
- O n8n fica exposto na internet. Use senha forte e, se possível, ative a verificação em duas etapas nas *Settings* do n8n.
- A API do Instagram limita **25 publicações por 24 horas** por conta. Nosso calendário usa 4 por dia, está folgado.
