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

Usamos a **API do Instagram com login unificado** (*Unified login*), em `graph.facebook.com`. Ela **não exige página do Facebook** — exige um portfólio de negócio, que já existe.

> **Os três caminhos da Meta, e por que este.** O *login do Facebook* é o antigo: exige o perfil ligado a uma página, e a própria Meta marca como obsoleto. O *login do Instagram* (`graph.instagram.com`) dispensa página e portfólio, mas a Meta só o oferece a integrações antigas — num app criado hoje a opção não aparece. Sobra o *login unificado*, que é o recomendado e o único que recebe recursos novos.

1. Em `developers.facebook.com`, com sua **conta pessoal do Facebook**, crie um app. Em *Casos de uso*, escolha **Gerenciar mensagens e conteúdo no Instagram**.
2. No app: *Personalizar* o caso de uso → **API setup with Unified login**. Não use a *Configuração da API com login do Facebook*, que é a obsoleta.
3. Permissões do token:
   `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`.
4. Gere o token pelo fluxo de login do próprio app. Quem autoriza é a conta do Instagram, escolhendo o portfólio **Vitrine Certa Oficial**. O resultado é um *Business Integration System User Access Token*, que não expira junto com a sessão de ninguém.
5. O **IG_USER_ID** é `17841461149108035` (confirmado em *Business settings → Instagram profiles*).
6. No **Easypanel** (`http://72.60.115.84:3000`), projeto `vitrine` → app `n8n` → aba **Environment**: preencha `IG_USER_ID` e `IG_TOKEN`, salve e clique em **Deploy**.

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
- A API do Instagram limita **25 publicações por 24 horas** por conta. Nosso calendário usa 6 por dia, está folgado.

## 8. Trilha sonora

Os vídeos saem mudos de propósito, e a razão não é técnica.

**A biblioteca de música do Instagram não serve aqui.** Ela é licenciada
pela Meta para uso *dentro do aplicativo*. Um post publicado pela API
sobe como arquivo pronto, e não existe passo em que dê para escolher
uma faixa do acervo. O único caminho é embutir o áudio no `.mp4` — e aí
a licença daquela faixa é responsabilidade de quem publica, não da Meta.

Por isso **música comercial está fora**. Uma faixa de artista conhecido
embutida num arquivo nosso não tem licença nenhuma, e o Rights Manager
do Instagram reconhece a gravação. O que acontece na prática é o áudio
ser silenciado ou o post removido; reincidência restringe a conta. Numa
operação que publica 6 vezes por dia de forma automática, a detecção
vira rotina depressa — e tudo depende dessa única conta.

**O que serve:** faixa livre para uso comercial. Procure por *royalty
free* com licença que permita uso comercial, ou Creative Commons CC0 /
CC-BY (nesta, credite o autor na legenda). Bibliotecas gratuitas com
esse tipo de licença existem; confira a licença da faixa específica,
não só a do site.

### Aplicar

Com a faixa em mãos, uma linha resolve todos os vídeos:

```sh
sh aplicar-trilha.sh /caminho/da/faixa.mp3 30
```

O segundo número é em que ponto da faixa começar (30 pula a introdução).
O script corta no tamanho de cada vídeo, normaliza o volume para -16
LUFS, aplica fade de meio segundo na entrada e na saída e **não
reencoda a imagem**, então não perde qualidade.

Testado de ponta a ponta com um tom gerado: entra vídeo de 15s mudo,
sai vídeo de 15s com áudio AAC a -15,5 dB.
