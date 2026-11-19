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

## Antes de enviar

Conferido direto na Graph API em 17/11/2026, com o token do app
(`GET /1465477545525044?fields=category,privacy_policy_url,icon_url,...`):

| Item | Estado |
|---|---|
| Categoria do app | ✅ `Lifestyle` |
| Política de privacidade | ✅ `/privacidade`, no ar |
| Ícone | ✅ enviado |
| URL do site | ✅ preenchida |
| E-mail de contato | ✅ preenchido |
| **Termos de serviço** | ✅ `/termos`, no ar — falta **colar a URL** nas configurações básicas |
| **Verificação do negócio** | ❓ não dá para checar pela API, confira no painel |
| **Vídeo de demonstração** | ❌ falta gravar |

Ou seja: os três itens que apareciam como *"Não qualificado para envio"*
(ícone, política de privacidade, categoria) **já estão resolvidos**.

O que falta, em ordem:

1. Colar `https://vitrine-certa-production.up.railway.app/termos` em
   *Configurações → Básico → URL dos Termos de Serviço*.
2. Concluir a **verificação do negócio** em
   `https://business.facebook.com/settings/security_center?business_id=1170838721943796`.
   Sem isso a análise nem começa.
3. Gravar o vídeo (roteiro acima) e enviar, pedindo **só**
   `instagram_manage_comments` e `instagram_manage_messages`.

### Isto É o que bloqueia o atendimento

Eu disse aqui que o app já atendia qualquer pessoa, porque `romulo.dev`
e `aliceelopesg` foram respondidas sem ter função no app. Errado de
novo: as duas são amigas do Arthur, e tudo indica que foram
adicionadas como testadoras do Instagram - lista que o `/roles` da API
não mostra.

O painel do app, em 19/11/2026, mostra **todas** as permissões como
*"Pronto para teste"*:

| Permissão | Chamadas | Estado |
|---|---|---|
| `instagram_basic` | 268 | Pronto para teste |
| `instagram_manage_messages` | 178 | Pronto para teste |
| `instagram_content_publish` | 81 | Pronto para teste |
| `instagram_manage_comments` | 54 | Pronto para teste |

Nenhuma com acesso avançado. Acesso padrão significa que a API e os
webhooks só funcionam para quem tem função no app: administrador,
desenvolvedor ou testador.

Na prática: a palavra-chave queimada em 118 arquivos funciona para as
contas de teste e **para mais ninguém**. O `ofelipesilva.dev` respondeu
um story e o evento nunca chegou - nem aparece em `/conversations`,
porque a conta dele não tem função no app.

Enquanto isso não for aprovado, os 780 seguidores veem a chamada e não
recebem nada.

### Como testar antes da aprovação

Adicione a pessoa como testadora do Instagram no painel do app, e peça
que ela aceite o convite nas configurações do Instagram dela. Sem isso,
nenhum teste com conta de fora vai funcionar.
