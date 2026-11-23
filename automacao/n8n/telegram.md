# O canal no Telegram — passo a passo

Os dois fluxos (**VC 11** e **VC 12**) já estão importados no n8n,
desligados. Falta criar o canal e o bot, que só você pode criar: são
coisas da sua conta do Telegram.

Leva uns 15 minutos.

> Não preciso do seu telefone para nada disso, e não guardei o número
> em lugar nenhum. O Telegram não pede número para criar canal nem bot
> — pede só que você esteja logado no seu app.

---

## 1. Criar o canal · 2 minutos

No app do Telegram: menu → **Novo canal**.

- Nome: `Vitrine Certa · Achadinhos`
- Tipo: **público**, com um @ curto e fácil de falar em vídeo. Algo como
  `@vitrinecertaofertas`. O @ é o endereço que você vai divulgar.
- Descrição: diga o que é e já avise da comissão. Sugestão:

```
Achadinhos da Shopee com o preço conferido no dia.
Sem enrolação: produto, preço e link.
Recebemos comissão pelas compras feitas pelos links — para você o preço é o mesmo.
```

**Canal, não grupo.** No canal só você publica, então não tem spam,
não tem briga e não tem moderação para fazer. Grupo vem depois, no
passo 5, e é opcional.

## 2. Criar o bot · 3 minutos

Converse com o **@BotFather** no Telegram:

1. `/newbot`
2. Nome: `Vitrine Certa`
3. Usuário: algo terminado em `bot`, por exemplo `vitrinecertabot`

Ele devolve um **token**, parecido com `8123456789:AAH...`. Esse token
é a senha do bot — quem tiver ele controla o bot inteiro. Não me mande
o token; cole direto no Easypanel, no passo 4.

Se vazar, o próprio BotFather revoga com `/revoke`.

## 3. Pôr o bot como administrador do canal · 1 minuto

No canal: **Administradores → Adicionar administrador →** procure o
`@vitrinecertabot` e marque **Publicar mensagens**.

Sem isso o bot não consegue postar e o VC 11 volta erro.

## 4. As variáveis no Easypanel · 3 minutos

No serviço do n8n, em *Environment*:

```
TELEGRAM_BOT_TOKEN=     (o token do passo 2)
TELEGRAM_CANAL=@vitrinecertaofertas
```

E, se for fazer o grupo:

```
TELEGRAM_GRUPO=         (o id do grupo, passo 5)
TELEGRAM_DONO=          (o seu id de usuário, opcional)
```

O `TELEGRAM_DONO` só serve para o porteiro não apagar os links que
**você** postar no grupo. Para descobrir o seu id, mande qualquer
mensagem para o **@userinfobot**.

Depois de colar, reinicie o n8n.

## 5. O grupo de discussão · opcional, 5 minutos

Só faça isso quando o canal tiver gente. Grupo vazio dá impressão ruim,
e grupo é onde aparece spam.

1. Crie um grupo: `Vitrine Certa · Conversa`
2. No canal: **Editar → Discussão →** ligue o grupo ao canal
3. No grupo: ponha o bot como administrador com permissão de **apagar
   mensagens**

Para pegar o id do grupo: mande uma mensagem qualquer nele e abra, no
navegador, `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`. O id
aparece em `chat.id` e começa com `-100`.

Depois, aponte o webhook do bot para o fluxo do porteiro. No navegador:

```
https://api.telegram.org/bot<SEU_TOKEN>/setWebhook?url=https://vitrine-n8n.6lpnbe.easypanel.host/webhook/telegram-porteiro
```

Tem que responder `{"ok":true}`.

## 6. Ligar os fluxos

No n8n, ative:

| Fluxo | O que faz | Quando |
|---|---|---|
| **VC 11** | publica a oferta no canal | 9h, 12h, 15h e 20h |
| **VC 12** | toma conta do grupo | quando chega mensagem |

O VC 11 pode rodar na mão primeiro, pelo botão *Execute workflow*, para
você ver como a mensagem fica antes de deixar no automático.

---

## O que cada fluxo faz

**VC 11 · a oferta do dia.** Quatro vezes por dia escolhe, entre os 131
produtos com preço conferido, o que tem o maior desconto que ainda não
foi ao ar no canal. Monta a mensagem com nome, preço no Pix, o preço de
antes riscado, a data da conferência e um botão com o link. Anota o que
saiu em `telegram-postados.json` para não repetir; quando a lista
acaba, recomeça pelos melhores.

**VC 12 · o porteiro.** Dá as boas-vindas a quem entra, apaga link de
fora postado por quem não é você, e responde a palavra-chave com o link
do produto — o mesmo funil do Instagram, sem depender da Meta.

Ele **não** bane, não expulsa e não silencia ninguém. Apagar mensagem
se desfaz; banir a pessoa errada não. Expulsão fica com você.

E ele não apaga os links do próprio canal: num grupo de discussão, toda
oferta publicada reaparece lá sozinha, e sem essa exceção o porteiro
apagaria as nossas próprias ofertas uma por uma.

---

## Por que isso muda o jogo

**Você vira o algoritmo.** No canal, quem assinou recebe. Hoje, no
Instagram, 6 de 704 seguidores veem o post — menos de 1%.

**O link vai na mensagem.** Sem "link na bio", sem precisar de 10 mil
seguidores para a figurinha de link, e sem esperar a análise da Meta. O
bloqueio que trava o funil do Instagram simplesmente não existe aqui.

**Dá para medir.** O Telegram mostra quantos viram cada publicação. E
quando os sub-IDs da Shopee entrarem, dá para saber qual mensagem virou
venda.

**Não some.** Mudança de algoritmo não tira seu canal do ar, e ninguém
derruba sua lista de assinantes.

### O que ele não faz

Canal não cria audiência. Ele guarda e converte a audiência que vem de
outro lugar. Quem chega continua tendo que vir do Instagram, do TikTok,
de grupo de WhatsApp, de gente que você conhece.

É o destino, não a fonte. Mas é um destino onde cada pessoa vale muito
mais do que vale hoje.
