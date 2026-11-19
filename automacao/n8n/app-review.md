# Análise do app na Meta — o que preencher

App `1465477545525044` · caso de uso **Instagram Business** · configuração de login unificado.

Pedimos duas permissões. As outras (`instagram_basic`, `instagram_content_publish`) já estão liberadas.

---

## instagram_manage_comments

**Como o app usa esta permissão** (cole no campo de descrição):

> O app é um assistente de atendimento da própria conta @vitrinecertaooficial, uma vitrine de produtos afiliados. Quando um seguidor comenta em uma publicação da conta, o app lê o comentário pelo webhook `comments`, consulta o catálogo de produtos da própria loja e responde ao comentário com a informação pedida — preço, disponibilidade e o link do produto.
>
> A permissão é necessária para duas coisas: ler o texto do comentário recebido e publicar a resposta como resposta àquele comentário. O app só atua na conta do próprio negócio, que é quem autoriza o acesso. Não lê nem responde comentários em contas de terceiros.
>
> Sem esta permissão o assistente não consegue receber o evento do comentário nem responder, e o atendimento precisa ser feito manualmente.

## instagram_manage_messages

> O app responde mensagens diretas recebidas na conta @vitrinecertaooficial. Quando um seguidor manda uma mensagem — inclusive resposta a story — o app lê o texto pelo webhook `messages`, consulta o catálogo de produtos da loja e responde com preço e link do produto perguntado.
>
> Também usa a permissão para enviar, por mensagem direta, o link do produto a quem comentou em uma publicação pedindo informação, que é o caminho normal desse tipo de atendimento no Instagram.
>
> O app só envia e recebe mensagens da conta do próprio negócio, que autoriza o acesso. Não acessa conversas de terceiros.

---

## O vídeo de demonstração

É o que mais reprova. A Meta quer ver o caminho inteiro, na tela, sem corte:

1. A tela de login do app, autorizando a conta do Instagram (o fluxo de login unificado).
2. Um comentário sendo feito na publicação, por uma segunda conta.
3. A resposta automática aparecendo no comentário.
4. A mensagem direta chegando na segunda conta.

Grave com a conta de teste já cadastrada em *Funções do app → Testadores*, porque em modo de desenvolvimento só essas contas disparam webhook. Narre o que está acontecendo ou use legendas.

## Passo a passo, em ordem

Conferido na Graph API em 19/11/2026. Faça de cima para baixo: cada
passo depende do anterior estar pronto.

### 1. ~~Colar a URL dos termos~~  ·  FEITO em 19/11/2026

Conferido na Graph API: `terms_of_service_url` aponta para
`/termos`. Com isso o **cadastro do app está completo** — categoria,
política de privacidade, termos, ícone, site e e-mail de contato, os
seis preenchidos.

### 2. Verificação do negócio  ·  horas a dias

`https://business.facebook.com/settings/security_center?business_id=1170838721943796`

Sem ela a análise não começa. Pede documento da empresa, ou os seus
dados como pessoa física se não houver CNPJ. É a etapa mais demorada,
então comece por ela assim que o passo 1 estiver feito.

### 3. Gravar o vídeo  ·  10 minutos

Roteiro na seção acima. Grave a tela do celular, sem corte, com a conta
testadora. Mostre, nesta ordem: o login autorizando a conta, o
comentário sendo feito pela segunda conta, a resposta aparecendo no
comentário, e o direct chegando na segunda conta.

### 4. Enviar  ·  5 minutos

`https://developers.facebook.com/apps/1465477545525044/app-review/permissions/`

Peça **apenas duas**:

- `instagram_manage_comments`
- `instagram_manage_messages`

Os textos de justificativa estão no topo deste arquivo, prontos para
colar. Não peça mais nada: `instagram_basic` e
`instagram_content_publish` já funcionam em acesso padrão, porque agem
na própria conta do dono do app. Cada permissão a mais é um motivo a
mais de reprovação.

---

## Enquanto a análise não sai

O funil funciona só para quem tem função no app. Para testar com
alguém de fora, adicione a pessoa como **testadora do Instagram**:

`https://developers.facebook.com/apps/1465477545525044/roles/roles/`

Ela precisa aceitar o convite nas configurações do Instagram dela.
Sem isso, nenhum teste com conta de fora dispara webhook.

## O que não pedir

Não peça `ads_management`, `ads_read`, `instagram_manage_insights` nem
`instagram_manage_events`. Nada no projeto usa.
