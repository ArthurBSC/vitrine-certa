# -*- coding: utf-8 -*-
"""Monta os fluxos 6 e 7, que ficam prontos esperando as chaves da Shopee.

Tudo conferido no explorador oficial da Open API em 19/11/2026:
  Authorization: SHA256 Credential=<appId>, Timestamp=<ts>, Signature=<hex>
  assinatura = SHA256(appId + ts + corpo + secret), corpo = JSON {"query": ...}

O segredo e usado dentro do no de codigo e nao sai de la. Se a
assinatura fosse feita pelo no Crypto, o segredo ficaria guardado no
historico de execucao do n8n, que qualquer um com acesso ao painel le.
"""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

W = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/workflows/'

ENDPOINT = 'https://open-api.affiliate.shopee.com.br/graphql'

ASSINA = r'''
// Assina do jeito que a propria pagina da Shopee assina.
// Conferido no explorador oficial: o corpo entra na conta exatamente
// como vai no fio, entao ele e montado uma vez e reaproveitado.
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


def sticky(nome, texto, pos, largura=460, altura=300):
    return {'parameters': {'content': texto, 'height': altura, 'width': largura},
            'id': nome, 'name': nome, 'type': 'n8n-nodes-base.stickyNote',
            'typeVersion': 1, 'position': pos}


def code(nome, ident, js, pos):
    return {'parameters': {'jsCode': js}, 'id': ident, 'name': nome,
            'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': pos}


def chamada(nome, ident, pos):
    """POST assinado para a Open API. O corpo vai cru, byte a byte igual
    ao que foi assinado: deixar o n8n remontar o JSON quebraria a conta."""
    return {
        'parameters': {
            'method': 'POST',
            'url': ENDPOINT,
            'sendHeaders': True,
            'headerParameters': {'parameters': [
                {'name': 'Content-Type', 'value': 'application/json'},
                {'name': 'Authorization',
                 'value': '=SHA256 Credential={{ $json.appId }}, Timestamp={{ $json.ts }}, Signature={{ $json.assinatura }}'},
            ]},
            'sendBody': True,
            'contentType': 'raw',
            'rawContentType': 'application/json',
            'body': '={{ $json.corpo }}',
            'options': {'response': {'response': {'neverError': True}}},
        },
        'id': ident, 'name': nome, 'type': 'n8n-nodes-base.httpRequest',
        'typeVersion': 4.2, 'position': pos,
    }


def ligar(pares):
    c = {}
    for de, para in pares:
        c.setdefault(de, {'main': [[]]})['main'][0].append(
            {'node': para, 'type': 'main', 'index': 0})
    return c


# ----------------------------------------------------------------- VC 7
leia7 = """## VC 7 · O que vieram a ser as vendas

Puxa o relatorio de conversao da Shopee das ultimas 48 horas e guarda
em /midia/dados/conversoes-AAAA-MM-DD.json.

O campo que importa e o **utmContent**: e nele que voltam os sub-IDs
que o fluxo 6 colocou no link. E assim que se sabe de qual story, de
qual post ou do direct veio cada venda.

Precisa de SHOPEE_APP_ID e SHOPEE_APP_SECRET no ambiente do n8n.
Sem as chaves, o fluxo para no primeiro no com recado claro.

As 48 horas sao de proposito: a janela cobre de novo o dia anterior,
porque pedido muda de status depois de criado. Quem le dedupe por
conversionId."""

js7_pedir = ASSINA + r'''
const { appId, secret } = chaves();
const ts = Math.floor(Date.now() / 1000);
const desde = ts - 60 * 60 * 48;

const query = `{
  conversionReport(purchaseTimeStart: ${desde}, purchaseTimeEnd: ${ts}, limit: 50) {
    nodes {
      conversionId
      clickTime
      purchaseTime
      utmContent
      device
      referrer
      buyerType
      totalCommission
      netCommission
      orders {
        orderId
        orderStatus
        items {
          itemId
          itemName
          itemPrice
          qty
          actualAmount
          refundAmount
          itemTotalCommission
        }
      }
    }
  }
}`;

const corpo = JSON.stringify({ query });
const assinatura = await assinar(appId, secret, ts, corpo);
return [{ json: { appId, ts, corpo, assinatura } }];
'''

js7_separar = r'''
const r = $input.first().json;
if (r.errors && r.errors.length) {
  throw new Error('A Shopee recusou: ' + JSON.stringify(r.errors).slice(0, 300));
}
const nos = ((r.data || {}).conversionReport || {}).nodes || [];

const linhas = [];
for (const n of nos) {
  // utmContent traz os cinco sub-IDs separados por underline.
  const sub = String(n.utmContent || '').split('_');
  const base = {
    conversion_id: n.conversionId,
    clique_em: n.clickTime,
    compra_em: n.purchaseTime,
    origem: sub[0] || '',
    onde: sub[1] || '',
    palavra: sub[2] || '',
    linha: sub[3] || '',
    aparelho: n.device,
    comprador: n.buyerType,
    comissao_total: n.totalCommission,
    comissao_liquida: n.netCommission,
  };
  for (const o of n.orders || []) {
    for (const it of o.items || []) {
      linhas.push({ ...base,
        pedido: o.orderId, situacao: o.orderStatus,
        item_id: it.itemId, produto: it.itemName,
        preco: it.itemPrice, qtd: it.qty,
        pago: it.actualAmount, devolvido: it.refundAmount,
        comissao_item: it.itemTotalCommission });
    }
  }
  if (!(n.orders || []).length) linhas.push(base);
}

const hoje = new Date().toISOString().slice(0, 10);
return [{ json: { arquivo: `conversoes-${hoje}.json`, quantas: linhas.length,
                  colhido_em: new Date().toISOString(), conversoes: linhas } }];
'''

n7 = [
    sticky('LEIA-ME', leia7, [-920, -180], 460, 380),
    {'parameters': {'rule': {'interval': [{'field': 'cronExpression', 'expression': '0 7 * * *'}]}},
     'id': 'cnv-cron', 'name': 'Todo dia às 7h',
     'type': 'n8n-nodes-base.scheduleTrigger', 'typeVersion': 1.2, 'position': [-400, 0]},
    code('Pedir o relatório', 'cnv-pedir', js7_pedir, [-180, 0]),
    chamada('Shopee: conversões', 'cnv-http', [60, 0]),
    code('Separar as vendas', 'cnv-sep', js7_separar, [300, 0]),
    {'parameters': {'operation': 'toJson', 'mode': 'each',
                    'options': {'fileName': '={{ $json.arquivo }}', 'format': True}},
     'id': 'cnv-arq', 'name': 'Virar arquivo',
     'type': 'n8n-nodes-base.convertToFile', 'typeVersion': 1.1, 'position': [540, 0]},
    {'parameters': {'operation': 'write',
                    'fileName': '=/midia/dados/{{ $(\'Separar as vendas\').item.json.arquivo }}',
                    'options': {}},
     'id': 'cnv-salvar', 'name': 'Guardar no servidor',
     'type': 'n8n-nodes-base.readWriteFile', 'typeVersion': 1, 'position': [780, 0]},
]

wf7 = {
    'name': 'VC 7 · Shopee: relatório de conversão',
    'nodes': n7,
    'connections': ligar([
        ('Todo dia às 7h', 'Pedir o relatório'),
        ('Pedir o relatório', 'Shopee: conversões'),
        ('Shopee: conversões', 'Separar as vendas'),
        ('Separar as vendas', 'Virar arquivo'),
        ('Virar arquivo', 'Guardar no servidor'),
    ]),
    'settings': {'executionOrder': 'v1'},
    'id': 'vitrinecertacnv01',
    'active': False,
}

# ----------------------------------------------------------------- VC 6
leia6 = """## VC 6 · Links com sub-ID

Gera de novo todos os links de afiliado, agora carregando sub-IDs, e
guarda em /midia/dados/links.json.

Os cinco sub-IDs vao assim:

  1. vitrinecerta   — fixo, e a operacao
  2. onde apareceu  — story, feed ou dm
  3. a palavra-chave do produto
  4. o id da linha do calendario (vazio no dm)
  5. reservado

Sao esses campos que voltam no utmContent do relatorio de conversao, e
e por eles que se descobre o que vende.

Roda na mao, de proposito: gerar link e coisa de fazer quando a grade
muda, nao toda noite. Precisa de SHOPEE_APP_ID e SHOPEE_APP_SECRET.

Rodar este fluxo nao mexe em nada do que esta no ar. Ele so escreve o
links.json; trocar os links do calendario e do atendimento e um passo
a parte, depois de conferir o resultado."""

js6_montar = r'''
let pal = $('Baixar palavras').first().json;
if (typeof pal.data === 'string') { try { pal = JSON.parse(pal.data); } catch (e) {} }

function lerCsv(s) {
  const linhas = []; let campo = '', linha = [], dentro = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (dentro) {
      if (c === '"') { if (s[i + 1] === '"') { campo += '"'; i++; } else dentro = false; }
      else campo += c;
    } else if (c === '"') dentro = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\r') { /* ignora */ }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
    else campo += c;
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

const bruto = lerCsv($('Baixar calendário').first().json.csv || '').filter(l => l.length > 1);
const cab = bruto[0];
const cal = bruto.slice(1).map(l => {
  const o = {}; cab.forEach((c, i) => { o[c] = l[i] === undefined ? '' : l[i]; }); return o;
});

const hoje = new Date().toISOString().slice(0, 10);
const pedidos = [];

// Um link por palavra, para responder no direct e no comentario.
for (const [palavra, v] of Object.entries(pal)) {
  if (!v.origem_url) continue;
  pedidos.push({ chave: 'dm:' + palavra, originUrl: v.origem_url,
                 subIds: ['vitrinecerta', 'dm', palavra, '', ''] });
}

// E um link por publicacao que ainda vai ao ar, para saber qual post vendeu.
for (const r of cal) {
  if (r.status || r.data < hoje || !r.palavra) continue;
  const v = pal[r.palavra];
  if (!v || !v.origem_url) continue;
  pedidos.push({ chave: 'post:' + r.id, originUrl: v.origem_url,
                 subIds: ['vitrinecerta', r.tipo, r.palavra, r.id, ''] });
}

// A Shopee aceita 50 por chamada.
const lotes = [];
for (let i = 0; i < pedidos.length; i += 50) lotes.push(pedidos.slice(i, i + 50));
return lotes.map((lote, i) => ({ json: { lote: i + 1, de: lotes.length, pedidos: lote } }));
'''

js6_pedir = ASSINA + r'''
const { appId, secret } = chaves();
const ts = Math.floor(Date.now() / 1000);
const pedidos = $json.pedidos;

// A resposta so devolve originUrl, que se repete entre pedidos do mesmo
// produto. O casamento e pela ORDEM, entao a ordem vai junto.
const links = pedidos.map(p => ({ originUrl: p.originUrl, subIds: p.subIds }));
const query = `mutation {
  generateBatchShortLink(input: ${JSON.stringify({ links })
    .replace(/"(\w+)":/g, '$1:')}) {
    total
    successCount
    links { originUrl shortLink longLink success errorMessage }
  }
}`;

const corpo = JSON.stringify({ query });
const assinatura = await assinar(appId, secret, ts, corpo);
return [{ json: { appId, ts, corpo, assinatura, chaves: pedidos.map(p => p.chave),
                  lote: $json.lote, de: $json.de } }];
'''

js6_juntar = r'''
const tudo = {};
let pedidos = 0, falhas = 0;

for (let i = 0; i < $input.all().length; i++) {
  const r = $input.all()[i].json;
  if (r.errors && r.errors.length) {
    throw new Error('A Shopee recusou: ' + JSON.stringify(r.errors).slice(0, 300));
  }
  const res = ((r.data || {}).generateBatchShortLink) || {};
  const links = res.links || [];
  const chaves = $('Pedir os links').all()[i].json.chaves || [];
  if (links.length !== chaves.length) {
    throw new Error('A resposta veio com ' + links.length + ' links para ' +
                    chaves.length + ' pedidos; sem a ordem nao da para casar.');
  }
  links.forEach((l, k) => {
    pedidos++;
    if (!l.success || !l.shortLink) { falhas++; return; }
    tudo[chaves[k]] = { link: l.shortLink, longo: l.longLink };
  });
}

return [{ json: { gerado_em: new Date().toISOString(),
                  pedidos, falhas, prontos: Object.keys(tudo).length, links: tudo } }];
'''

n6 = [
    sticky('LEIA-ME', leia6, [-1100, -240], 480, 480),
    {'parameters': {}, 'id': 'lnk-ini', 'name': 'Começar',
     'type': 'n8n-nodes-base.manualTrigger', 'typeVersion': 1, 'position': [-560, 0]},
    {'parameters': {'url': '={{ $env.MIDIA_BASE_URL }}/dados/palavras.json', 'options': {}},
     'id': 'lnk-pal', 'name': 'Baixar palavras',
     'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.2, 'position': [-340, -100]},
    {'parameters': {'url': '={{ $env.MIDIA_BASE_URL }}/dados/calendario.csv',
                    'options': {'response': {'response': {
                        'responseFormat': 'text', 'outputPropertyName': 'csv'}}}},
     'id': 'lnk-cal', 'name': 'Baixar calendário',
     'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.2, 'position': [-340, 100]},
    code('Montar os pedidos', 'lnk-montar', js6_montar, [-100, 0]),
    code('Pedir os links', 'lnk-pedir', js6_pedir, [140, 0]),
    chamada('Shopee: gerar os links', 'lnk-http', [380, 0]),
    code('Juntar tudo', 'lnk-juntar', js6_juntar, [620, 0]),
    {'parameters': {'operation': 'toJson', 'mode': 'each',
                    'options': {'fileName': 'links.json', 'format': True}},
     'id': 'lnk-arq', 'name': 'Virar arquivo',
     'type': 'n8n-nodes-base.convertToFile', 'typeVersion': 1.1, 'position': [860, 0]},
    {'parameters': {'operation': 'write', 'fileName': '/midia/dados/links.json', 'options': {}},
     'id': 'lnk-salvar', 'name': 'Guardar no servidor',
     'type': 'n8n-nodes-base.readWriteFile', 'typeVersion': 1, 'position': [1100, 0]},
]

wf6 = {
    'name': 'VC 6 · Shopee: gerar os links com sub-ID',
    'nodes': n6,
    'connections': ligar([
        ('Começar', 'Baixar palavras'),
        ('Baixar palavras', 'Baixar calendário'),
        ('Baixar calendário', 'Montar os pedidos'),
        ('Montar os pedidos', 'Pedir os links'),
        ('Pedir os links', 'Shopee: gerar os links'),
        ('Shopee: gerar os links', 'Juntar tudo'),
        ('Juntar tudo', 'Virar arquivo'),
        ('Virar arquivo', 'Guardar no servidor'),
    ]),
    'settings': {'executionOrder': 'v1'},
    'id': 'vitrinecertalnk01',
    'active': False,
}

for arq, wf in (('6-links-com-subid.json', wf6), ('7-relatorio-de-conversao.json', wf7)):
    json.dump(wf, open(W + arq, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(arq, '->', len(wf['nodes']), 'nós')
