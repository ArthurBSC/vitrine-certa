# Radar de achadinhos — o projeto

Conferido na Open API da Shopee em 19/11/2026.

A ideia é a sua: parar de escolher produto na mão e deixar o sistema
achar, avaliar e preparar. Este documento é o projeto disso, já
ajustado ao que as fontes oficiais realmente entregam.

---

## Antes de tudo: o que o radar resolve e o que ele não resolve

O radar resolve um problema real e concreto. Hoje a gente escolhe
produto no olho. Não sabemos a comissão de nenhum dos 165 itens do
catálogo — nem em porcentagem, nem em reais. Estamos dando 6 horários
por dia para produtos sem saber qual deles paga R$ 2 e qual paga R$ 20.
Isso é dinheiro parado por falta de informação, e a API resolve em uma
chamada.

O que o radar **não** resolve: a conta ainda não vendeu. Isso não é
falta de catálogo — 165 produtos dá e sobra para 28 dias. É falta de
alcance e de funil. Os ~700 seguidores foram comprados e não compram;
a resposta automática no direct só funciona para quem tem papel no app
até a Meta liberar o acesso avançado. Dobrar o catálogo com um radar
não muda nenhuma dessas duas coisas.

Então o radar vale a pena, mas pela razão certa: ele é a única forma de
**medir**. É o que transforma a máquina de publicação em máquina de
vendas — não porque acha mais produto, mas porque passa a dizer qual
produto deu clique e qual deu venda. Por isso a ordem de construção que
proponho no fim deste documento é diferente da ordem que você listou.

---

## O que a fonte oficial entrega, de verdade

### Shopee — cobre a operação inteira

A Open API de afiliados é oficial e está de pé:
`https://open-api.affiliate.shopee.com.br/graphql`, com explorador em
`/explorer/v2`. Autentica com **AppId e Secret** da sua conta de
afiliado. As operações existentes:

| Operação | Serve para |
|---|---|
| `productOfferV2` | achar produtos: por palavra, categoria, loja, maior comissão, mais vendidos |
| `listItemFeeds` / `getItemFeedData` | puxar catálogo em lote |
| `generateShortLink` / `generateBatchShortLink` | gerar o link de afiliado, com sub-IDs |
| `conversionReport` | **as vendas que vieram dos nossos links** |
| `validatedReport` | comissão já validada |
| `shopOfferV2` / `shopeeOfferV2` | ofertas de loja e campanhas |

Campos que o `productOfferV2` devolve por produto: `itemId`, `shopId`,
`productName`, `shopName`, `imageUrl`, `price`, `priceMin`, `priceMax`,
`priceDiscountRate` (0-100), `sales`, `ratingStar`, `commissionRate`,
`commission` (valor em reais), `sellerCommissionRate`,
`shopeeCommissionRate`, taxas separadas para comprador novo e antigo no
app e na web, `productCatIds`, `shopType`, `offerLink`,
`periodStartTime` e `periodEndTime` da oferta.

### Mercado Livre — não cobre

Você já desconfiou disso e está certo. O Mercado Livre tem API pública
de produtos, mas **não tem API oficial documentada para gerar link de
afiliado**. O caminho oficial é o gerador de links dentro do painel de
afiliados, que devolve o `meli.la` já com o seu `matt_tool`.

As bibliotecas que prometem automatizar isso usam cookie de sessão ou
endpoint interno. Não vamos por aí: é o tipo de coisa que funciona até
o dia em que derruba a conta, e aí leva junto tudo o que foi construído.

Então o desenho é: **o radar é Shopee.** Produto do Mercado Livre entra
no catálogo pela mão, com o link gerado no painel, numa tela de cadastro
manual. O mesmo banco, a mesma vitrine, a mesma fila do Instagram — só
a descoberta e o link é que não são automáticos. Se um dia o ML abrir
uma API de afiliado documentada, o motor 1 ganha uma segunda fonte e
nada mais muda.

---

## A pontuação: o ajuste que eu faria nos seus pesos

Seus seis critérios estão certos como ideia. O problema é que dois
deles pedem dado que a fonte oficial não dá:

- **avaliações e reputação, peso 20** — a API dá `ratingStar`, mas
  **não dá a quantidade de avaliações**. Nota 5,0 com três avaliações e
  nota 4,7 com oito mil são a mesma coisa para a API. Dar 20 pontos a
  um número que pode ser ruído é convidar o erro.
- **concorrência, peso 10** — não existe campo nenhum. Para medir
  concorrência de verdade seria preciso varrer busca e contar
  anunciantes do mesmo item, e isso é scraping.

Em vez de inventar número para esses dois, troco pelo que a API garante
e que mede a mesma coisa por outro caminho:

| Critério | Peso | De onde sai |
|---|---|---|
| Vendas comprovadas | 25 | `sales` |
| Comissão em reais | 25 | `commission` e `commissionRate` |
| Nota do produto | 15 | `ratingStar`, só acima de um piso de vendas |
| Preço e desconto | 15 | `price`, `priceDiscountRate`, e o nosso histórico |
| Qualidade da loja | 10 | `shopType` (Mall, Preferred), `isKeySeller` |
| Qualidade do anúncio | 10 | imagem, nome, faixa de preço estreita |

**Comissão em reais, não em porcentagem.** 20% de R$ 15 é R$ 3; 4% de
R$ 300 é R$ 12. A porcentagem engana; o campo `commission` já vem no
valor. É por isso que esse critério vale 25 junto com vendas.

**A nota só conta se houver venda.** Abaixo de um piso — eu começaria
em 300 vendas — o `ratingStar` não entra na conta e esses 15 pontos
simplesmente não são distribuídos. Produto novo não é punido, só não é
premiado por uma nota que não significa nada ainda.

**Faixa de preço estreita é qualidade de anúncio.** Quando o produto vai
de R$ 15 a R$ 190, como o nosso kit de potes, o "a partir de" é quase
propaganda enganosa e a pessoa chega na página e se frustra. Um produto
com `priceMin` e `priceMax` próximos converte melhor e merece o ponto.

As três faixas que você propôs eu manteria como estão: **80 ou mais**
entra na fila, **65 a 79** fica em observação, **abaixo de 65** é
descartado.

E a sua regra fundamental eu assino inteira, com um acréscimo. Sem
comissão verificada, sem link válido e sem preço conferido, o produto
não recebe nota nenhuma — não recebe nota baixa, recebe *sem nota*, e
fica fora da fila. O acréscimo: produto cuja oferta já venceu
(`periodEndTime` no passado) também sai, porque a comissão daquele
anúncio pode ter mudado.

### O critério que vale mais que todos os seis

Depois que os links saírem com sub-ID, o `conversionReport` passa a
dizer, por produto, quantos cliques e quantas compras vieram de nós. A
partir daí nenhuma estimativa deveria competir com isso.

A minha proposta: um produto com 30 dias de dado nosso ganha uma nota
medida, que **substitui** a nota estimada. O radar deixa de adivinhar o
que vende e passa a saber. Esse é o pulo do gato do projeto inteiro, e
é a parte que não dá para terceirizar para IA nenhuma — é dado nosso.

---

## Os cinco fluxos

Seus cinco motores, com a responsabilidade de cada um fechada.

**1 · Coletor.** Roda de madrugada. Chama `productOfferV2` com as
buscas que interessam — nossas categorias, maior comissão, mais
vendidos — e também `listItemFeeds` para o lote. Não julga nada: grava
produto e oferta no banco, cru, com carimbo de hora. Uma coleta é uma
foto do momento; é a sequência de fotos que vira histórico de preço.

**2 · Inteligência.** Calcula a nota pela fórmula acima, que é
aritmética e roda em código, não em IA. A IA entra só onde ela é boa:
ler o nome e a imagem do anúncio e dizer se aquilo se sustenta num
story — se o título é um amontoado de palavra-chave, se a foto é de
catálogo ou de celular, se o produto é cópia de marca. Isso é
julgamento de qualidade, não é cálculo. Você acertou em cheio na
decisão técnica: a IA interpreta dado coletado, não sai pesquisando
sozinha. É mais barato, erra menos e não alucina número.

**3 · Validação.** Antes de qualquer produto entrar na fila: reconfere
preço e comissão na API, confirma que a oferta não venceu, e gera o
link com `generateShortLink` **carregando o sub-ID**. É aqui que mora o
"não pode receber classificação sem link válido" — o fluxo só aprova o
que ele mesmo conseguiu linkar.

Uma conferência a mais entra aqui, e vale para qualquer mídia que o
sistema prepare: **vídeo que já tem som não recebe trilha**. A medição
é objetiva — faixa muda marca −91 dB, som de verdade fica muito acima —
então dá para o fluxo decidir sozinho, sem ninguém assistir. Música por
cima de alguém falando é o tipo de erro que não aparece em nenhum
relatório e só custa a pessoa que fechou o vídeo no primeiro segundo.

**4 · Catálogo.** Escreve na vitrine: insere o novo, atualiza preço do
que já existe, desativa o que venceu ou sumiu, e não deixa duplicado
entrar (a chave é `itemId` + `shopId`, não o nome, que a Shopee muda
toda hora).

**5 · Distribuição e medição.** Dois sentidos. Na ida, pega os
aprovados e enfileira no calendário do Instagram — o mesmo CSV que o
publicador já lê hoje. Na volta, puxa o `conversionReport` e grava
clique e venda por sub-ID, fechando o ciclo de volta no motor 2.

---

## O banco

O Google Sheets já não aguenta: a conta autorizada no n8n lê mas não
escreve, a limpeza da aba volta 403, e foi por isso que o publicador
passou hoje a ler o calendário do nosso servidor. Planilha não é banco
para isso. Eu subiria um **Postgres no Easypanel**, ao lado do n8n.

| Tabela | O que guarda |
|---|---|
| `produto` | item_id, shop_id, nome, imagem, categoria, loja, tipo de loja, visto pela primeira vez |
| `oferta` | preço, mín, máx, desconto, taxa e valor de comissão, colhido_em — **só insere, nunca atualiza** |
| `link` | produto, sub_id, url curta, criado_em |
| `score` | produto, nota, as parcelas em json, versão da fórmula, calculado_em |
| `publicacao` | produto, linha do calendário, post_id do Instagram, quando foi ao ar |
| `conversao` | conversion_id, utm_content, produto, clique_em, compra_em, status, comissão líquida |

Dois detalhes que valem o desenho:

**`oferta` só insere.** O histórico de preço não é uma tabela à parte —
é a própria sequência de ofertas. E é isso que resolve o seu "preço
anterior somente quando comprovado": a vitrine só pode escrever "de
R$ 80 por R$ 50" quando a gente mesma viu os R$ 80 em outra coleta. O
"de" que a Shopee mostra é dela, não é nosso, e não vamos repetir número
que não conferimos.

**`score` guarda a versão da fórmula.** Quando a gente mudar os pesos —
e vai mudar, assim que houver dado de conversão — dá para comparar o que
a fórmula nova teria escolhido contra o que a antiga escolheu. Sem isso
a gente troca a fórmula no escuro.

---

## A vitrine

Com o banco em pé, o site deixa de ser lista e vira o portal que você
descreveu: ofertas do dia, melhores do radar, mais vendidos, casa e
decoração, tecnologia, moda e beleza, achadinhos até R$ 50, relâmpago.
Cada produto com imagem, preço atualizado, nota, marketplace, selo de
oportunidade e o botão com o nosso link.

Três coisas que não são enfeite e eu colocaria desde o primeiro dia:

- **A data do preço, visível.** "R$ 49,90 — conferido hoje às 6h." É o
  que a gente já faz na legenda do Instagram e é o que os Termos já
  prometem. Preço de afiliado sem data vira mentira em uma semana.
- **O aviso de comissão.** Que a Vitrine Certa recebe comissão pela
  compra. Não é só boa educação: é exigência do programa de afiliados e
  da regra de publicidade.
- **Preço anterior só quando a gente viu.** Pela regra da tabela
  `oferta` acima.

O selo de oportunidade vale a conversa: mostrar "91/100" para o
visitante é mostrar a nossa cozinha, e convida a pergunta "91 para
quem?". Eu usaria a nota internamente para ordenar e escolher, e no site
mostraria o que a nota significa para quem compra — "mais vendido da
categoria", "desconto de 60% conferido hoje" — que é o mesmo dado em
linguagem de cliente.

---

## A ordem que eu construiria

A sua ordem é a lógica do fluxo: coletar, pensar, validar, catalogar,
distribuir. Mas construir nessa ordem deixa a medição para o fim, e a
medição é justamente o que falta hoje. Eu inverteria:

**Primeiro, sub-ID nos links que já existem.** Os 165 produtos do
catálogo atual passam pelo `generateShortLink` e ganham um sub-ID que
identifica post, story e palavra-chave. Custa pouco, não muda nada no
que já roda, e a partir do dia seguinte a gente sabe de onde vem cada
clique.

**Segundo, o `conversionReport`.** Um fluxo pequeno, roda de manhã,
grava clique e venda. Em duas semanas temos a primeira resposta honesta
sobre o que essa conta vende — e essa resposta pode muito bem mudar o
resto do plano.

**Terceiro, o coletor e a nota.** Aí sim, com a fórmula já podendo ser
conferida contra dado real.

**Quarto, catálogo e vitrine nova.**

Tem um ganho imediato nos dois primeiros passos que vale sozinho: ao
passar os 165 produtos pela API, a gente descobre a comissão de cada um.
É bem possível que metade do catálogo pague quase nada e que os
horários nobres estejam indo para os produtos errados. Isso dá para
saber esta semana, antes de escrever um fluxo novo sequer.

---

## O que já está montado

Os cinco motores existem como fluxo no n8n, todos **desligados**,
esperando as chaves. Nenhum deles publica nada: escrevem arquivos em
`/midia/dados/`, que a vitrine e o calendário leem depois.

| Fluxo | O que faz | Escreve |
|---|---|---|
| **VC 6** | gera os links com sub-ID | `links.json` |
| **VC 7** | puxa o relatório de conversão, 7h | `conversoes.json` |
| **VC 8** | varre a Shopee atrás de oferta, 4h | `radar-ofertas.json` |
| **VC 9** | dá a nota de 0 a 100, 5h | `radar-notas.json` |
| **VC 10** | mantém o catálogo da vitrine | `catalogo.json` |

A ordem de cada madrugada é 4h coletar, 5h pontuar, 7h medir. O VC 10
roda na mão, por um motivo que vale dizer.

**O radar não põe nada no calendário do Instagram.** Ele deixa a fila
pronta, com os trinta melhores, e a entrada na grade é um passo à
parte. Já achamos uma cópia pirata no catálogo que montamos na mão; uma
publicando sozinha seria um problema de verdade, e nenhuma nota de 0 a
100 enxerga isso.

### O que foi testado sem as chaves

A conta da nota e a do catálogo rodaram fora do n8n, com ofertas
inventadas. A nota se comporta: um produto com 24 mil vendas, R$ 12,40
de comissão e 62% de desconto tira 82,3 e entra na fila; com três
vendas nossas sobe para 94,3. Um com 12 vendas e R$ 0,40 de comissão
tira 15,2 e é descartado. Sem comissão ou com a oferta vencida, fica
sem nota, que é diferente de nota baixa.

O catálogo também: na primeira vez que vê um produto a R$ 80 ele não
escreve "de R$ 80", porque ainda não há com o que comparar. Quando o
preço cai para R$ 50 na coleta seguinte, aí sim o "de R$ 80" aparece —
e preço que não mudou não vira linha nova no histórico.

E o caminho de gravação foi testado de ponta a ponta com dado de
mentira: o VC 10 rodou, escreveu o `catalogo.json` em `/midia/dados/` e
o arquivo saiu servido na web. Depois apaguei os dois arquivos de
teste.

O que não dá para testar sem as chaves é a conversa com a Shopee: a
assinatura, o formato das respostas e os nomes dos campos. Esses eu
conferi no explorador oficial, um por um, mas conferir não é o mesmo
que ter rodado.

---

## O que trava

Tudo depende de uma coisa: **AppId e Secret da Open API de afiliados**,
que se pede dentro do painel de afiliado da Shopee.

Sem isso, nenhum dos cinco fluxos existe. Com isso, o primeiro passo
roda no mesmo dia.

Quando você tiver as credenciais, elas entram como variável de ambiente
no n8n — `SHOPEE_APP_ID` e `SHOPEE_APP_SECRET` — do mesmo jeito que o
`IG_TOKEN`. Eu não toco nelas, você mesmo cola no painel do Easypanel.
