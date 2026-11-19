# -*- coding: utf-8 -*-
"""Monta o radar: coletor, pontuacao e catalogo. E refaz o VC 7 com historico.

Tudo conferido no explorador oficial da Open API da Shopee em 19/11/2026.
Nenhum destes fluxos publica nada: eles escrevem arquivos em
/midia/dados/, que a vitrine e o calendario leem depois.
"""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

W = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/workflows/'
ENDPOINT = 'https://open-api.affiliate.shopee.com.br/graphql'

ASSINA = r'''
// Assina do jeito que a propria pagina da Shopee assina. O corpo entra
// na conta exatamente como vai no fio, entao e montado uma vez so.
async function assinar(appId, secret, ts, corpo) {
  const fator = appId + ts + corpo + secret;
  if (globalThis.crypto && globalThis.crypto.subtle) {
    const b = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(fator));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
  }
  try {
    return require('crypto').createHash('sha256').update(fator).digest('hex');
  } catch (e) {
    throw new Error('Este n8n nao expoe SHA256 no no de codigo. Ligue NODE_FUNCTION_ALLOW_BUILTIN=crypto.');
  }
}

function chaves() {
  const appId = String($env.SHOPEE_APP_ID || '').trim();
  const secret = String($env.SHOPEE_APP_SECRET || '').trim();
  if (!appId || !secret) {
    throw new Error('Faltam SHOPEE_APP_ID e SHOPEE_APP_SECRET no ambiente do n8n.');
  }
  return { appId, secret };
}
'''


def sticky(texto, pos, largura=470, altura=360):
    return {'parameters': {'content': texto, 'height': altura, 'width': largura},
            'id': 'leiame', 'name': 'LEIA-ME',
            'type': 'n8n-nodes-base.stickyNote', 'typeVersion': 1, 'position': pos}


def code(nome, ident, js, pos):
    return {'parameters': {'jsCode': js}, 'id': ident, 'name': nome,
            'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': pos}


def baixar(nome, ident, caminho, pos, texto=False, tolerante=False):
    """Le um arquivo do nosso proprio servidor de midia."""
    op = {}
    if texto:
        op['response'] = {'response': {'responseFormat': 'text', 'outputPropertyName': 'csv'}}
    if tolerante:
        op.setdefault('response', {}).setdefault('response', {})['neverError'] = True
    no = {'parameters': {'url': '={{ $env.MIDIA_BASE_URL }}' + caminho, 'options': op},
          'id': ident, 'name': nome,
          'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.2, 'position': pos}
    if tolerante:
        no['onError'] = 'continueRegularOutput'
    return no


def chamada(nome, ident, pos):
    """POST assinado. O corpo vai cru: deixar o n8n remontar o JSON
    mudaria um byte e a assinatura cairia."""
    return {
        'parameters': {
            'method': 'POST', 'url': ENDPOINT, 'sendHeaders': True,
            'headerParameters': {'parameters': [
                {'name': 'Content-Type', 'value': 'application/json'},
                {'name': 'Authorization',
                 'value': '=SHA256 Credential={{ $json.appId }}, Timestamp={{ $json.ts }}, Signature={{ $json.assinatura }}'}]},
            'sendBody': True, 'contentType': 'raw', 'rawContentType': 'application/json',
            'body': '={{ $json.corpo }}',
            'options': {'response': {'response': {'neverError': True}}},
        },
        'id': ident, 'name': nome, 'type': 'n8n-nodes-base.httpRequest',
        'typeVersion': 4.2, 'position': pos}


def arquivo(nome_arq, pos, expressao=False):
    return {'parameters': {'operation': 'toJson', 'mode': 'each',
                           'options': {'fileName': nome_arq, 'format': True}},
            'id': 'arq', 'name': 'Virar arquivo',
            'type': 'n8n-nodes-base.convertToFile', 'typeVersion': 1.1, 'position': pos}


def salvar(caminho, pos, ident='salvar'):
    return {'parameters': {'operation': 'write', 'fileName': caminho, 'options': {}},
            'id': ident, 'name': 'Guardar no servidor',
            'type': 'n8n-nodes-base.readWriteFile', 'typeVersion': 1, 'position': pos}


def cron(nome, expr, pos, ident='cron'):
    return {'parameters': {'rule': {'interval': [
                {'field': 'cronExpression', 'expression': expr}]}},
            'id': ident, 'name': nome,
            'type': 'n8n-nodes-base.scheduleTrigger', 'typeVersion': 1.2, 'position': pos}


def ligar(pares):
    c = {}
    for de, para in pares:
        c.setdefault(de, {'main': [[]]})['main'][0].append(
            {'node': para, 'type': 'main', 'index': 0})
    return c


def montar(nome, ident, nos, pares):
    return {'name': nome, 'nodes': nos, 'connections': ligar(pares),
            'settings': {'executionOrder': 'v1'}, 'id': ident, 'active': False}


# ================================================================ VC 7
leia7 = """## VC 7 · O que as vendas vieram a ser

Puxa o relatorio de conversao das ultimas 48 horas e junta no
/midia/dados/conversoes.json, que vai acumulando.

O campo que importa e o **utmContent**: e nele que voltam os sub-IDs
que o VC 6 poe no link. E assim que se sabe de qual story, de qual post
ou do direct veio cada venda.

As 48 horas sao de proposito: a janela cobre o dia anterior de novo,
porque pedido muda de status depois de criado. A juncao e por
conversao + item, e o registro mais novo manda.

Precisa de SHOPEE_APP_ID e SHOPEE_APP_SECRET."""

js7_pedir = ASSINA + r'''
const { appId, secret } = chaves();
const ts = Math.floor(Date.now() / 1000);
const desde = ts - 60 * 60 * 48;

const query = `{
  conversionReport(purchaseTimeStart: ${desde}, purchaseTimeEnd: ${ts}, limit: 50) {
    nodes {
      conversionId clickTime purchaseTime utmContent device referrer buyerType
      totalCommission netCommission
      orders {
        orderId orderStatus
        items { itemId itemName itemPrice qty actualAmount refundAmount itemTotalCommission }
      }
    }
  }
}`;

const corpo = JSON.stringify({ query });
const assinatura = await assinar(appId, secret, ts, corpo);
return [{ json: { appId, ts, corpo, assinatura } }];
'''

js7_juntar = r'''
const r = $('Shopee: conversões').first().json;
if (r.errors && r.errors.length) {
  throw new Error('A Shopee recusou: ' + JSON.stringify(r.errors).slice(0, 300));
}
const nos = ((r.data || {}).conversionReport || {}).nodes || [];

const novas = [];
for (const n of nos) {
  // utmContent traz os cinco sub-IDs separados por underline.
  const sub = String(n.utmContent || '').split('_');
  const base = {
    conversion_id: n.conversionId, clique_em: n.clickTime, compra_em: n.purchaseTime,
    origem: sub[0] || '', onde: sub[1] || '', palavra: sub[2] || '', linha: sub[3] || '',
    aparelho: n.device, comprador: n.buyerType,
    comissao_total: n.totalCommission, comissao_liquida: n.netCommission,
  };
  for (const o of n.orders || []) {
    for (const it of o.items || []) {
      novas.push({ ...base, pedido: o.orderId, situacao: o.orderStatus,
        item_id: it.itemId, produto: it.itemName, preco: it.itemPrice, qtd: it.qty,
        pago: it.actualAmount, devolvido: it.refundAmount,
        comissao_item: it.itemTotalCommission });
    }
  }
  if (!(n.orders || []).length) novas.push(base);
}

// O que ja estava guardado. Arquivo que ainda nao existe volta vazio e
// nao e erro: na primeira rodada nao ha historico nenhum.
let antes = [];
try {
  let a = $('Baixar o que já temos').first().json;
  if (typeof a.data === 'string') a = JSON.parse(a.data);
  antes = (a && a.conversoes) || [];
} catch (e) { antes = []; }

const por = new Map();
for (const c of antes) por.set(`${c.conversion_id}|${c.item_id || ''}`, c);
for (const c of novas) por.set(`${c.conversion_id}|${c.item_id || ''}`, c);
const todas = [...por.values()].sort((a, b) => (b.compra_em || 0) - (a.compra_em || 0));

return [{ json: { atualizado_em: new Date().toISOString(),
                  novas: novas.length, total: todas.length, conversoes: todas }}];
'''

n7 = [
    sticky(leia7, [-980, -200], 470, 400),
    cron('Todo dia às 7h', '0 7 * * *', [-420, 0]),
    code('Pedir o relatório', 'cnv-pedir', js7_pedir, [-200, 0]),
    chamada('Shopee: conversões', 'cnv-http', [40, 0]),
    baixar('Baixar o que já temos', 'cnv-antes', '/dados/conversoes.json', [280, 0], tolerante=True),
    code('Juntar as vendas', 'cnv-juntar', js7_juntar, [520, 0]),
    arquivo('conversoes.json', [760, 0]),
    salvar('/midia/dados/conversoes.json', [1000, 0]),
]
wf7 = montar('VC 7 · Shopee: relatório de conversão', 'vitrinecertacnv01', n7, [
    ('Todo dia às 7h', 'Pedir o relatório'),
    ('Pedir o relatório', 'Shopee: conversões'),
    ('Shopee: conversões', 'Baixar o que já temos'),
    ('Baixar o que já temos', 'Juntar as vendas'),
    ('Juntar as vendas', 'Virar arquivo'),
    ('Virar arquivo', 'Guardar no servidor'),
])

# ================================================================ VC 8
leia8 = """## VC 8 · Radar: o coletor

Roda de madrugada e varre a Shopee atras de oferta. Nao julga nada:
grava o que achou em /midia/dados/radar-ofertas.json, cru e com hora.

Sao tres tipos de varredura, todas por productOfferV2:
  - maior comissao
  - mais vendidos
  - busca por palavra nas nossas categorias

Uma coleta e uma foto do momento. E a sequencia de fotos que vira
historico de preco, e e dai que sai o "de R$ 80 por R$ 50" que a
vitrine pode mostrar sem mentir - porque fomos nos que vimos os R$ 80.

Precisa de SHOPEE_APP_ID e SHOPEE_APP_SECRET."""

js8_buscas = ASSINA + r'''
const { appId, secret } = chaves();

// O que varrer. Mexer aqui e mexer no que o radar enxerga.
const BUSCAS = [
  { nome: 'maior comissão', listType: 1, pages: [1, 2] },
  { nome: 'mais vendidos', listType: 2, pages: [1, 2] },
];
const PALAVRAS = ['organizador cozinha', 'cama mesa banho', 'espelho decorativo',
                  'fone bluetooth', 'moda feminina inverno', 'ferramenta sem fio',
                  'utensilio cozinha', 'iluminacao led casa'];

const CAMPOS = `nodes {
  itemId shopId shopName productName imageUrl productLink offerLink
  price priceMin priceMax priceDiscountRate sales ratingStar
  commission commissionRate sellerCommissionRate shopeeCommissionRate
  productCatIds shopType periodStartTime periodEndTime
} pageInfo { page limit hasNextPage }`;

const saida = [];
let ts = Math.floor(Date.now() / 1000);

for (const b of BUSCAS) {
  for (const p of b.pages) {
    const query = `{ productOfferV2(listType: ${b.listType}, page: ${p}, limit: 50) { ${CAMPOS} } }`;
    const corpo = JSON.stringify({ query });
    saida.push({ busca: b.nome, pagina: p, appId, ts, corpo,
                 assinatura: await assinar(appId, secret, ts, corpo) });
  }
}
for (const k of PALAVRAS) {
  // sortType 2 = mais vendidos primeiro
  const query = `{ productOfferV2(keyword: ${JSON.stringify(k)}, sortType: 2, page: 1, limit: 50) { ${CAMPOS} } }`;
  const corpo = JSON.stringify({ query });
  saida.push({ busca: 'palavra: ' + k, pagina: 1, appId, ts, corpo,
               assinatura: await assinar(appId, secret, ts, corpo) });
}

return saida.map(json => ({ json }));
'''

js8_juntar = r'''
const agora = new Date().toISOString();
const por = new Map();
let recusas = 0;

$input.all().forEach((it, i) => {
  const r = it.json;
  const busca = ($('Montar as buscas').all()[i] || {}).json?.busca || '';
  if (r.errors && r.errors.length) { recusas++; return; }
  const nos = ((r.data || {}).productOfferV2 || {}).nodes || [];
  for (const n of nos) {
    const chave = `${n.shopId}|${n.itemId}`;
    const ja = por.get(chave);
    // O mesmo produto aparece em mais de uma varredura. Guardo uma vez
    // so, anotando por onde ele apareceu - isso conta depois.
    if (ja) { if (!ja.buscas.includes(busca)) ja.buscas.push(busca); continue; }
    por.set(chave, {
      shop_id: n.shopId, item_id: n.itemId, loja: n.shopName, produto: n.productName,
      imagem: n.imageUrl, link: n.productLink, oferta: n.offerLink,
      preco: n.price, preco_min: n.priceMin, preco_max: n.priceMax,
      desconto: n.priceDiscountRate, vendas: n.sales, nota: n.ratingStar,
      comissao: n.commission, comissao_taxa: n.commissionRate,
      comissao_vendedor: n.sellerCommissionRate, comissao_shopee: n.shopeeCommissionRate,
      categorias: n.productCatIds, tipo_loja: n.shopType,
      oferta_comeca: n.periodStartTime, oferta_acaba: n.periodEndTime,
      buscas: [busca], colhido_em: agora,
    });
  }
});

const ofertas = [...por.values()];
if (!ofertas.length) {
  throw new Error('A varredura nao trouxe nenhuma oferta' +
                  (recusas ? ' (' + recusas + ' chamadas recusadas)' : '') + '.');
}
return [{ json: { colhido_em: agora, varreduras: $input.all().length,
                  recusadas: recusas, total: ofertas.length, ofertas } }];
'''

n8 = [
    sticky(leia8, [-1000, -220], 470, 420),
    cron('Toda madrugada às 4h', '0 4 * * *', [-440, 0]),
    code('Montar as buscas', 'rad-buscas', js8_buscas, [-220, 0]),
    chamada('Shopee: varrer ofertas', 'rad-http', [20, 0]),
    code('Juntar as ofertas', 'rad-juntar', js8_juntar, [260, 0]),
    arquivo('radar-ofertas.json', [500, 0]),
    salvar('/midia/dados/radar-ofertas.json', [740, 0]),
]
wf8 = montar('VC 8 · Radar: coletor de ofertas', 'vitrinecertarad01', n8, [
    ('Toda madrugada às 4h', 'Montar as buscas'),
    ('Montar as buscas', 'Shopee: varrer ofertas'),
    ('Shopee: varrer ofertas', 'Juntar as ofertas'),
    ('Juntar as ofertas', 'Virar arquivo'),
    ('Virar arquivo', 'Guardar no servidor'),
])

# ================================================================ VC 9
leia9 = """## VC 9 · Radar: a nota

Le o que o coletor trouxe e da uma nota de 0 a 100 a cada oferta.

A conta e aritmetica e roda aqui, nao em IA: vendas 25, comissao em
reais 25, nota do produto 15, preco e desconto 15, loja 10, anuncio 10.

Regra dura: sem comissao, sem link ou com a oferta vencida, o produto
nao recebe nota baixa - ele fica **sem nota** e fora da fila.

80 ou mais entra na fila. 65 a 79 fica em observacao. Abaixo disso,
descartado.

Quando houver venda nossa do produto, a nota medida substitui a
estimada. E dado nosso, vale mais que qualquer palpite.

Escreve /midia/dados/radar-notas.json."""

js9_pontuar = r'''
function ler(nome, campo) {
  try {
    let a = $(nome).first().json;
    if (typeof a.data === 'string') a = JSON.parse(a.data);
    return (a && a[campo]) || (campo ? [] : a);
  } catch (e) { return []; }
}

const ofertas = ler('Baixar as ofertas', 'ofertas');
if (!ofertas.length) throw new Error('Nao achei ofertas. O VC 8 ja rodou hoje?');
const conversoes = ler('Baixar as conversões', 'conversoes');

let pal = {};
try {
  let a = $('Baixar palavras').first().json;
  if (typeof a.data === 'string') a = JSON.parse(a.data);
  pal = a || {};
} catch (e) { pal = {}; }
const jaTemos = new Set(Object.values(pal)
  .filter(v => v && v.item_id).map(v => `${v.shop_id}|${v.item_id}`));

const n = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : 0; };
const entre = (x, a, b) => Math.max(a, Math.min(b, x));
const agora = Math.floor(Date.now() / 1000);

// Quanto cada produto ja rendeu de verdade, por item.
const medido = new Map();
for (const c of conversoes) {
  if (!c.item_id) continue;
  const k = String(c.item_id);
  const m = medido.get(k) || { vendas: 0, comissao: 0 };
  if (String(c.situacao || '').toUpperCase() !== 'CANCELLED') {
    m.vendas += Number(c.qtd || 1);
    m.comissao += n(c.comissao_item || c.comissao_liquida);
  }
  medido.set(k, m);
}

const notas = [];
for (const o of ofertas) {
  const comissao = n(o.comissao);
  const preco = n(o.preco) || n(o.preco_min);
  const vencida = o.oferta_acaba && Number(o.oferta_acaba) > 0 && Number(o.oferta_acaba) < agora;

  // Sem o basico conferido, nao ha nota. Nem baixa: nenhuma.
  const faltas = [];
  if (!comissao) faltas.push('sem comissão');
  if (!preco) faltas.push('sem preço');
  if (!o.oferta && !o.link) faltas.push('sem link');
  if (vencida) faltas.push('oferta vencida');
  if (faltas.length) {
    notas.push({ ...resumo(o), nota: null, motivo: faltas.join(', '), faixa: 'sem nota' });
    continue;
  }

  const vendas = Number(o.vendas || 0);
  // Vendas em escala log: de 0 a 50 mil, porque a diferenca entre 100 e
  // 1000 importa muito mais que entre 40 mil e 50 mil.
  const pVendas = entre(Math.log10(vendas + 1) / Math.log10(50000), 0, 1) * 25;

  // Comissao em reais, nao em porcentagem: 20% de R$ 15 e R$ 3.
  const pComissao = entre(comissao / 20, 0, 1) * 25;

  // A nota so conta acima de um piso de vendas. Nota 5,0 com tres
  // avaliacoes e ruido, e a API nao devolve quantas avaliacoes sao.
  const nota = n(o.nota);
  const pNota = vendas >= 300 && nota > 0 ? entre((nota - 4) / 1, 0, 1) * 15 : 0;
  const notaContou = vendas >= 300 && nota > 0;

  const desconto = Number(o.desconto || 0);
  const pDesconto = entre(desconto / 60, 0, 1) * 10;
  // Faixa de preco que a nossa gente compra por impulso.
  const pPreco = preco >= 20 && preco <= 150 ? 5 : preco < 20 ? 3 : 1;

  // tipo_loja volta como numero e a documentacao nao diz o que cada um
  // significa. Enquanto nao soubermos, todo mundo leva metade e o valor
  // cru fica guardado - e com venda de verdade que se aprende o mapa.
  const pLoja = 5;

  const faixaEstreita = n(o.preco_max) > 0 && n(o.preco_min) > 0
    ? n(o.preco_max) / n(o.preco_min) : 1;
  const pAnuncio = (o.imagem ? 3 : 0)
    + (String(o.produto || '').length >= 20 && String(o.produto || '').length <= 120 ? 2 : 0)
    + (faixaEstreita <= 2 ? 5 : faixaEstreita <= 4 ? 2 : 0);

  const parcelas = { vendas: +pVendas.toFixed(1), comissao: +pComissao.toFixed(1),
                     nota: +pNota.toFixed(1), desconto: +pDesconto.toFixed(1),
                     preco: pPreco, loja: pLoja, anuncio: pAnuncio };
  let total = Object.values(parcelas).reduce((a, b) => a + b, 0);

  // Quando a nota nao contou, os 15 pontos nao sao distribuidos. Sem
  // reescalar: produto novo nao e punido, so nao e premiado.
  const teto = notaContou ? 100 : 85;

  const m = medido.get(String(o.item_id));
  const nosso = m && m.vendas > 0;

  notas.push({
    ...resumo(o),
    nota: +entre(total, 0, teto).toFixed(1),
    teto,
    parcelas,
    nota_contou: notaContou,
    faixa: total >= 80 ? 'fila' : total >= 65 ? 'observação' : 'descartado',
    ja_no_catalogo: jaTemos.has(`${o.shop_id}|${o.item_id}`),
    nossas_vendas: nosso ? m.vendas : 0,
    nossa_comissao: nosso ? +m.comissao.toFixed(2) : 0,
  });
}

function resumo(o) {
  return { shop_id: o.shop_id, item_id: o.item_id, produto: o.produto, loja: o.loja,
           imagem: o.imagem, link: o.oferta || o.link,
           origem_url: `https://shopee.com.br/product/${o.shop_id}/${o.item_id}`,
           preco: o.preco, preco_min: o.preco_min, preco_max: o.preco_max,
           desconto: o.desconto, vendas: o.vendas, nota_produto: o.nota,
           comissao: o.comissao, comissao_taxa: o.comissao_taxa,
           tipo_loja: o.tipo_loja, categorias: o.categorias,
           oferta_acaba: o.oferta_acaba, buscas: o.buscas };
}

// Medida ganha de estimada. Quem ja vendeu para a nossa gente sobe.
for (const x of notas) {
  if (x.nota === null || !x.nossas_vendas) continue;
  x.nota_estimada = x.nota;
  x.nota = +Math.min(100, x.nota + Math.min(20, x.nossas_vendas * 4)).toFixed(1);
  x.faixa = x.nota >= 80 ? 'fila' : x.nota >= 65 ? 'observação' : 'descartado';
  x.medida = true;
}

notas.sort((a, b) => (b.nota ?? -1) - (a.nota ?? -1));
const conta = f => notas.filter(x => x.faixa === f).length;
return [{ json: {
  calculado_em: new Date().toISOString(),
  formula: 'v1 · vendas 25, comissão 25, nota 15, preço e desconto 15, loja 10, anúncio 10',
  total: notas.length, fila: conta('fila'), observacao: conta('observação'),
  descartado: conta('descartado'), sem_nota: conta('sem nota'),
  notas } }];
'''

n9 = [
    sticky(leia9, [-1120, -260], 470, 460),
    cron('Toda madrugada às 5h', '0 5 * * *', [-560, 0]),
    baixar('Baixar as ofertas', 'pt-of', '/dados/radar-ofertas.json', [-340, -140], tolerante=True),
    baixar('Baixar as conversões', 'pt-cv', '/dados/conversoes.json', [-340, 0], tolerante=True),
    baixar('Baixar palavras', 'pt-pal', '/dados/palavras.json', [-340, 140], tolerante=True),
    code('Dar a nota', 'pt-nota', js9_pontuar, [-80, 0]),
    arquivo('radar-notas.json', [180, 0]),
    salvar('/midia/dados/radar-notas.json', [420, 0]),
]
wf9 = montar('VC 9 · Radar: pontuação das ofertas', 'vitrinecertapnt01', n9, [
    ('Toda madrugada às 5h', 'Baixar as ofertas'),
    ('Baixar as ofertas', 'Baixar as conversões'),
    ('Baixar as conversões', 'Baixar palavras'),
    ('Baixar palavras', 'Dar a nota'),
    ('Dar a nota', 'Virar arquivo'),
    ('Virar arquivo', 'Guardar no servidor'),
])

# =============================================================== VC 10
leia10 = """## VC 10 · Radar: o catalogo

Pega o que o VC 9 aprovou e mantem /midia/dados/catalogo.json, que e o
que a vitrine le.

O que ele faz: entra produto novo, atualiza preco do que ja esta,
desativa o que venceu ou sumiu da varredura, e nao deixa duplicado -
a chave e loja + produto, nunca o nome, que a Shopee muda toda hora.

Cada visto entra no historico de preco do produto. E dai, e so dai, que
sai o "de R$ 80 por R$ 50" da vitrine: so vale o preco que nos mesmos
vimos em outra coleta. O "de" que a Shopee mostra e dela.

Ele **nao** poe nada no calendario do Instagram. Produto entrar na
grade e decisao de quem olha - ja achamos uma copia pirata no catalogo,
e aquilo publicado sozinho seria um problema de verdade. O fluxo deixa
a fila pronta em `fila`, e a entrada na grade e um passo a parte."""

js10_catalogo = r'''
function ler(nome, campo) {
  try {
    let a = $(nome).first().json;
    if (typeof a.data === 'string') a = JSON.parse(a.data);
    return campo ? ((a && a[campo]) || []) : a;
  } catch (e) { return campo ? [] : {}; }
}

const notas = ler('Baixar as notas', 'notas');
if (!notas.length) throw new Error('Nao achei notas. O VC 9 ja rodou?');
const antes = ler('Baixar o catálogo', 'produtos');

const hoje = new Date().toISOString().slice(0, 10);
const agora = new Date().toISOString();
const n = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) ? x : 0; };

const cat = new Map();
for (const p of antes) cat.set(`${p.shop_id}|${p.item_id}`, p);

const vistos = new Set();
let novos = 0, atualizados = 0;

for (const x of notas) {
  if (x.nota === null) continue;            // sem o basico conferido, nem entra
  const chave = `${x.shop_id}|${x.item_id}`;
  vistos.add(chave);
  const antigo = cat.get(chave);

  // So insere o preco no historico quando ele mudou. Guardar o mesmo
  // numero todo dia enche o arquivo e nao diz nada.
  const historico = (antigo && antigo.historico) || [];
  const ultimo = historico[historico.length - 1];
  if (!ultimo || n(ultimo.preco) !== n(x.preco)) {
    historico.push({ dia: hoje, preco: x.preco, desconto: x.desconto });
  }
  // Um ano de preco por produto ja e mais do que a vitrine precisa.
  while (historico.length > 365) historico.shift();

  // O "de" so vale se fomos nos que vimos. O maior preco que passou
  // pelo nosso historico e o unico que da para escrever sem mentir.
  const maior = historico.reduce((m, h) => Math.max(m, n(h.preco)), 0);
  const antes_comprovado = maior > n(x.preco) ? maior.toFixed(2) : '';

  cat.set(chave, {
    shop_id: x.shop_id, item_id: x.item_id, produto: x.produto, loja: x.loja,
    imagem: x.imagem, link: x.link, origem_url: x.origem_url,
    preco: x.preco, preco_min: x.preco_min, preco_max: x.preco_max,
    antes_comprovado, desconto: x.desconto,
    vendas: x.vendas, nota_produto: x.nota_produto,
    comissao: x.comissao, comissao_taxa: x.comissao_taxa,
    categorias: x.categorias, nota: x.nota, faixa: x.faixa,
    medida: !!x.medida, nossas_vendas: x.nossas_vendas || 0,
    ativo: true, visto_em: agora,
    entrou_em: (antigo && antigo.entrou_em) || agora,
    historico,
  });
  if (antigo) atualizados++; else novos++;
}

// Quem nao apareceu na varredura de hoje sai do ar, mas fica guardado:
// produto some da busca e volta, e o historico de preco nao se refaz.
let desativados = 0;
for (const [k, p] of cat) {
  if (vistos.has(k)) continue;
  if (p.ativo) { p.ativo = false; p.saiu_em = agora; desativados++; }
}

const produtos = [...cat.values()];
const fila = produtos
  .filter(p => p.ativo && p.faixa === 'fila')
  .sort((a, b) => b.nota - a.nota)
  .slice(0, 30);

return [{ json: {
  atualizado_em: agora,
  total: produtos.length, ativos: produtos.filter(p => p.ativo).length,
  novos, atualizados, desativados,
  fila: fila.map(p => ({ item_id: p.item_id, shop_id: p.shop_id, produto: p.produto,
                         nota: p.nota, preco: p.preco, comissao: p.comissao,
                         origem_url: p.origem_url })),
  produtos } }];
'''

n10 = [
    sticky(leia10, [-1100, -260], 480, 480),
    {'parameters': {}, 'id': 'cat-ini', 'name': 'Começar',
     'type': 'n8n-nodes-base.manualTrigger', 'typeVersion': 1, 'position': [-540, 0]},
    baixar('Baixar as notas', 'cat-nt', '/dados/radar-notas.json', [-320, -90], tolerante=True),
    baixar('Baixar o catálogo', 'cat-at', '/dados/catalogo.json', [-320, 90], tolerante=True),
    code('Atualizar o catálogo', 'cat-upd', js10_catalogo, [-60, 0]),
    arquivo('catalogo.json', [200, 0]),
    salvar('/midia/dados/catalogo.json', [440, 0]),
]
wf10 = montar('VC 10 · Radar: catálogo da vitrine', 'vitrinecertacat01', n10, [
    ('Começar', 'Baixar as notas'),
    ('Baixar as notas', 'Baixar o catálogo'),
    ('Baixar o catálogo', 'Atualizar o catálogo'),
    ('Atualizar o catálogo', 'Virar arquivo'),
    ('Virar arquivo', 'Guardar no servidor'),
])

for arq, wf in (('7-relatorio-de-conversao.json', wf7),
                ('8-radar-coletor.json', wf8),
                ('9-radar-pontuacao.json', wf9),
                ('10-radar-catalogo.json', wf10)):
    json.dump(wf, open(W + arq, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{arq:34} {wf['id']:20} {len(wf['nodes'])} nós")
