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

> **Servidor com Easypanel, Coolify, Dokploy, nginx ou Apache já no ar?** Use o guia [easypanel.md](easypanel.md) em vez desta seção. O script abaixo sobe um Caddy próprio nas portas 80/443 e derrubaria o proxy que já existe — ele detecta isso e para antes de mexer em nada, mas o caminho certo nesse caso é o outro guia. É o caso do servidor 72.60.115.84.

Em **servidor limpo**, no terminal, como root:

```bash
curl -fsSL https://raw.githubusercontent.com/ArthurBSC/vitrine-certa/main/automacao/n8n/install.sh | bash
```

Instala Docker, Postgres, n8n e Caddy (HTTPS automático), clona este repositório em `/opt/vitrine/repo` e cria:

- `https://n8n.72-60-115-84.sslip.io` — o painel do n8n
- `https://midia.72-60-115-84.sslip.io/pub/` — a mídia pública que o Instagram vai baixar
- `/opt/vitrine/.env` — onde ficam os segredos e os tokens

Depois abra o painel, crie a conta de dono (e-mail seu e senha forte) e importe os três fluxos de uma vez:

```bash
/opt/vitrine/importar-fluxos.sh
```

### Comandos do dia a dia

Ver se está tudo de pé:

```bash
cd /opt/vitrine && docker compose ps
```

Acompanhar o que o n8n está fazendo:

```bash
cd /opt/vitrine && docker compose logs -f n8n
```

Atualizar o n8n e os fluxos (puxa o que mudou aqui no repositório):

```bash
/opt/vitrine/atualizar.sh
```

---

## 2. A planilha

**Já está criada.** O fluxo **VC 0 · Setup** fez isso: criou a planilha *Vitrine Certa — Calendário* com as abas `Calendario` e `Atendimento`, e gravou as 112 linhas (28 posts de feed e 84 stories, de 17/11 a 14/12, com legenda e link prontos).

- Planilha: `1V11T5ZWHpmkCtjc3VHcQ30P1pbC6pZzJept8n6MOsyc`

As datas foram gravadas como texto, não como data, que é o que o fluxo 1 espera ao comparar o dia.

Se um dia precisar refazer do zero: apague a planilha e rode o **VC 0** de novo. Rodar com a planilha existente cria outra, duplicada.

### Colunas que importam

- `data` — `2026-11-18`, texto simples.
- `hora` — `19:00`. O fluxo só olha a hora inteira.
- `tipo` — `feed` ou `story`.
- `arquivo` — nome exato do arquivo no Drive. Vários separados por `|` viram carrossel.
- `status` — deixe vazio. O fluxo escreve `POSTADO` ou `ERRO`. **Linha com `POSTADO` nunca é publicada de novo.**

---

## 3. O Drive

**As pastas já estão criadas** pelo mesmo fluxo de setup:

| Pasta | Id | Para que serve |
|---|---|---|
| `Vitrine Certa` | `1S5HQYOXhNpmGCWuPQZKVcJQmr8j3QiAt` | a pasta mãe |
| `MIDIA` | `1YHdIAxEX0-cGQFw-wQvUcAFdOb3ASK8c` | de onde o fluxo 1 pega o que publicar |
| `1-ENTRADA` | `15260cOs8_64Sa7Fei8zdrBVmc9LWKea_` | vídeo novo para a IA escrever a legenda |
| `NARRACAO` | `1uaG8xhDTwlP28zMcBSzYnkcE6V9sB_da` | onde as narrações em MP3 caem |

**Falta você subir a mídia:** arraste os 130 arquivos de `midia/drive/` (~110 MB, já renomeados no padrão `2026-11-18-feed-19h.mp4`) para dentro da pasta **MIDIA**. É o único passo do Drive que eu não consigo fazer: os arquivos estão no seu computador.

## 4. Token do Instagram

Usamos a **Instagram API with Instagram Login**, em `graph.instagram.com`. Ela dispensa página do Facebook e Business Manager: o próprio perfil do Instagram autoriza o app.

> **Por que não o caminho da página.** O caminho clássico (`graph.facebook.com` + token de página) exige que o perfil esteja ligado a uma página do Facebook e que o app seja criado por uma conta pessoal com acesso ao portfólio. Nesta conta o portfólio foi criado por um login do Instagram, que fica bloqueado nas Configurações (`blocked_ig_user_in_mbs`) — ninguém consegue aprovar o acesso, nem o próprio dono. Por isso o caminho do Instagram Login.

1. Em `developers.facebook.com`, com sua **conta pessoal do Facebook**, crie um app do tipo **Business**. A conta pessoal serve só para ser dona do app; ela não precisa de acesso nenhum ao perfil do Instagram.
2. No app: *Adicionar produto* → **Instagram** → **API setup with Instagram login**.
3. Em *Business login settings*, cadastre a **OAuth Redirect URI**. Qualquer URL HTTPS sua serve; o token é copiado na mão uma vez só.
4. Ainda em *API setup with Instagram login*, use o botão para gerar o token do perfil `@vitrinecertaooficial`, com os escopos:
   `instagram_business_basic`, `instagram_business_content_publish`, `instagram_business_manage_comments`, `instagram_business_manage_messages`.
5. Troque o token curto por um de 60 dias:
   `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={app-secret}&access_token={token-curto}`
   Ele se renova sozinho enquanto for usado; um token parado mais de 60 dias morre.
6. Confirme o id do perfil:
   `GET https://graph.instagram.com/v26.0/me?fields=user_id,username`
   O `user_id` é o **IG_USER_ID**. O nosso é `17841461149108035` — confira se bate.
7. No **Easypanel** (`http://72.60.115.84:3000`), projeto `vitrine` → app `n8n` → aba **Environment**: preencha `IG_USER_ID` e `IG_TOKEN`, salve e clique em **Deploy**.

> Neste servidor não existe `/opt/vitrine/.env`: o n8n roda como app do Easypanel e os segredos ficam na aba *Environment*. Veja [easypanel.md](easypanel.md).

### Webhook do atendimento

- URL para cadastrar na Meta: `https://vitrine-n8n.6lpnbe.easypanel.host/webhook/instagram`
- *Verify token*: o valor de `META_VERIFY_TOKEN` que já está no *Environment*.

O fluxo 2 só devolve o `hub.challenge` se o `hub.verify_token` bater com essa variável — é o que impede qualquer um de registrar um webhook no lugar da Meta. O fluxo precisa estar **ativo** antes de cadastrar, senão a URL de produção não responde.

---

## 5. Importar os fluxos

O `importar-fluxos.sh` do passo 1 já traz os três de uma vez. Se preferir na mão: *Workflows → ⋯ → Import from File*, com os arquivos de `automacao/n8n/workflows/`.

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
| OpenRouter | a IA que escreve e atende (modelo `google/gemini-3.7-flash`) |

Nas duas do Google, o n8n mostra a *OAuth Redirect URL*. Cole essa URL no seu projeto do Google Cloud (*APIs e serviços → Credenciais → ID do cliente OAuth → URIs de redirecionamento*) e ative as APIs **Google Sheets** e **Google Drive**. Como o n8n está num domínio HTTPS de verdade, o login do Google funciona normalmente.

Para trocar de modelo, abra o nó **OpenRouter** e mude o campo *Model*. Nada mais muda. Opções mais baratas, se quiser cortar custo: `deepseek/deepseek-v4-flash` ou `z-ai/glm-5.3-flash`.

---

## 6. Testar antes de soltar

1. **Fluxo 1**: na planilha, mude a `data` e a `hora` de uma linha para daqui a uns minutos, deixe `status` vazio e clique em *Execute workflow*. Acompanhe: tem que aparecer o arquivo em `https://midia.72-60-115-84.sslip.io/pub/` e o post no perfil. Só depois ative o workflow (chave no topo) para ele rodar sozinho.
2. **Fluxo 2**: ative, copie a *Production URL* do nó `Entrada da Meta` e cadastre como webhook na Meta, com o `META_VERIFY_TOKEN` da aba *Environment*. Assine `comments`, `messages` e `mentions`. Comente no seu próprio post para ver a resposta.
3. **Fluxo 3**: ative e jogue um vídeo em `1-ENTRADA`. Em até 1 minuto aparece uma linha nova com status `A PROGRAMAR`.

> Enquanto estiver testando, mantenha o fluxo 1 **desativado**. Ativo, ele publica de verdade no horário marcado.

---

## 7. Segurança

- A aba *Environment* do app `n8n` tem tokens com poder de publicar na sua conta. Esses valores vivem só no Easypanel; nunca os coloque neste repositório.
- O n8n fica exposto na internet. Use senha forte e, se possível, ative a verificação em duas etapas nas *Settings* do n8n.
- A API do Instagram limita **25 publicações por 24 horas** por conta. Nosso calendário usa 4 por dia, está folgado.
