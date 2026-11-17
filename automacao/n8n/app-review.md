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

### Isto NÃO está bloqueando o atendimento

Eu afirmei aqui que, por estar em desenvolvimento, o webhook só
dispararia para contas com função no app, e que a palavra-chave não
funcionaria para os seguidores. **Está errado.** Conferido em 17/11/2026
nas execuções reais do n8n:

| Conta | Quando | O que aconteceu |
|---|---|---|
| `arthur_brunosx` | 13h07 | comentário respondido + direct entregue |
| `romulo.dev` | 13h20 | comentário respondido + direct entregue |
| `aliceelopesg` | 13h51 | comentário respondido + direct entregue |

E `GET /{app-id}/roles` devolve **um único administrador**, nenhum
testador. Ou seja: as duas últimas são pessoas de fora, sem função no
app, e foram atendidas normalmente. O app está publicado e o funil
funciona para qualquer pessoa.

O que sobra desta lista é higiene, não bloqueio: a URL dos termos e a
verificação do negócio valem a pena, mas nenhuma delas impede uma venda
hoje.

### O que de fato se perdeu naquele dia

As duas pessoas de fora comentaram às 13h20 e 13h51, **antes** da
correção do prompt. Receberam um direct dizendo "te mandei o link"
*sem link nenhum*. Havia procura; o funil é que estava quebrado.

## O que não pedir

Não peça `ads_management`, `ads_read`, `instagram_manage_insights` nem `instagram_manage_events`. Nada no projeto usa, e cada permissão a mais é um motivo a mais de reprovação.

---

# Tratamento de dados (o questionário do envio)

São declarações legais suas. Responda pelo que o sistema realmente faz — declaração falsa aqui derruba o app depois, mesmo que a análise passe.

## Você tem operadores de dados com acesso aos Dados da Plataforma?

**Sim.** O atendimento manda o texto da mensagem para um provedor de IA e guarda o registro numa planilha do Google. Isso são operadores.

## Liste todos os operadores

| Operador | País | O que recebe |
|---|---|---|
| OpenRouter, Inc. | EUA | o texto do comentário ou da mensagem, para gerar a resposta |
| Google LLC | EUA | o mesmo texto, como provedor do modelo `google/gemini-3.7-flash` via OpenRouter; e o registro do atendimento no Google Sheets |
| Hostinger International Limited | Lituânia | hospeda o VPS onde o n8n roda e processa os eventos |
| Railway Corp. | EUA | hospeda a vitrine, cuja API recebe a palavra-chave buscada |

## Quem é o responsável pelos Dados da Plataforma

O **controlador**: a pessoa jurídica, se houver CNPJ; senão, seu nome completo como pessoa física. Tem que ser quem decide por que e como os dados são tratados — ou seja, você.

**País:** Brasil.

## Forneceu dados a autoridades públicas por segurança nacional nos últimos 12 meses?

**Não.**

## Processos para solicitações de autoridades públicas

Marque **só o que você de fato faz hoje**. Numa operação de uma pessoa que nunca recebeu solicitação nenhuma, a resposta honesta costuma ser **"Nenhuma das opções acima"**.

Marcar análise de legitimidade, contestação, minimização e registro significa afirmar que esses processos existem. Se quiser marcá-los, escreva antes um procedimento curto dizendo o que você faria ao receber uma ordem judicial — aí passa a ser verdade. Não marque porque parece melhor.
