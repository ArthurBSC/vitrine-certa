# -*- coding: utf-8 -*-
"""Monta os dois fluxos do Telegram: o que publica e o que toma conta.

No canal nao existe algoritmo decidindo quem ve. Quem entrou, recebe.
E o link vai dentro da mensagem, sem bio, sem 10 mil seguidores e sem
depender da analise da Meta - o bloqueio que trava o funil do Instagram
simplesmente nao existe aqui.

Os dois falam com a API do Telegram por httpRequest, com o token em
TELEGRAM_BOT_TOKEN. Nada de credencial guardada no painel: o token fica
no ambiente, igual ao IG_TOKEN e ao da Shopee.
"""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

W = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/workflows/'
API = 'https://api.telegram.org/bot'


def sticky(texto, pos, largura=480, altura=400):
    return {'parameters': {'content': texto, 'height': altura, 'width': largura},
            'id': 'leiame', 'name': 'LEIA-ME',
            'type': 'n8n-nodes-base.stickyNote', 'typeVersion': 1, 'position': pos}


def code(nome, ident, js, pos):
    return {'parameters': {'jsCode': js}, 'id': ident, 'name': nome,
            'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': pos}


def baixar(nome, ident, caminho, pos, tolerante=False):
    op = {}
    if tolerante:
        op['response'] = {'response': {'neverError': True}}
    no = {'parameters': {'url': '={{ $env.MIDIA_BASE_URL }}' + caminho, 'options': op},
          'id': ident, 'name': nome,
          'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.2, 'position': pos}
    if tolerante:
        no['onError'] = 'continueRegularOutput'
    return no


def telegram(nome, ident, metodo, pos, corpo='={{ JSON.stringify($json.payload) }}',
             tolerante=True):
    """Chamada crua na API do bot. O metodo vem no caminho e o corpo e JSON."""
    no = {
        'parameters': {
            'method': 'POST',
            'url': '=' + API + '{{ $env.TELEGRAM_BOT_TOKEN }}/' + metodo,
            'sendHeaders': True,
            'headerParameters': {'parameters': [
                {'name': 'Content-Type', 'value': 'application/json'}]},
            'sendBody': True, 'contentType': 'raw', 'rawContentType': 'application/json',
            'body': corpo,
            'options': {'response': {'response': {'neverError': True}}},
        },
        'id': ident, 'name': nome, 'type': 'n8n-nodes-base.httpRequest',
        'typeVersion': 4.2, 'position': pos}
    if tolerante:
        no['onError'] = 'continueRegularOutput'
    return no


def ligar(pares):
    c = {}
    for de, para in pares:
        c.setdefault(de, {'main': [[]]})['main'][0].append(
            {'node': para, 'type': 'main', 'index': 0})
    return c


def montar(nome, ident, nos, pares):
    return {'name': nome, 'nodes': nos, 'connections': ligar(pares),
            'settings': {'executionOrder': 'v1'}, 'id': ident, 'active': False}


def cron(nome, expr, pos):
    return {'parameters': {'rule': {'interval': [
                {'field': 'cronExpression', 'expression': expr}]}},
            'id': 'cron', 'name': nome,
            'type': 'n8n-nodes-base.scheduleTrigger', 'typeVersion': 1.2, 'position': pos}


# =============================================================== VC 11
leia11 = """## VC 11 · A oferta do dia no canal

Publica no canal do Telegram, quatro vezes por dia, o produto com o
melhor desconto que ainda nao foi ao ar ali.

O canal nao divide audiencia com algoritmo nenhum: quem assinou, ve. E
o link vai dentro da mensagem, num botao - nada de "link na bio".

Guarda em /midia/dados/telegram-postados.json o que ja saiu, para nao
repetir. Quando a lista acaba, ele recomeca pelos melhores.

Precisa de TELEGRAM_BOT_TOKEN e TELEGRAM_CANAL (o @ do canal, ou o id
comecando em -100). O bot tem que ser administrador do canal.

Preco vem de precos.json, com a data da conferencia na mensagem: preco
de afiliado sem data vira mentira em uma semana."""

js11_escolher = r'''
function ler(nome, campo) {
  try {
    let a = $(nome).first().json;
    if (typeof a.data === 'string') a = JSON.parse(a.data);
    return campo ? (a && a[campo]) : a;
  } catch (e) { return campo ? null : {}; }
}

const canal = String($env.TELEGRAM_CANAL || '').trim();
if (!String($env.TELEGRAM_BOT_TOKEN || '').trim() || !canal) {
  throw new Error('Faltam TELEGRAM_BOT_TOKEN e TELEGRAM_CANAL no ambiente do n8n.');
}

const pal = ler('Baixar palavras') || {};
const pre = ler('Baixar preços', 'precos') || {};
const dia = (ler('Baixar preços', 'conferido_em')) || '';
const jaForam = (ler('Baixar o que já saiu', 'postados')) || [];

const n = v => { const x = parseFloat(String(v ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')); return isFinite(x) ? x : 0; };

// Candidatos: produto com preco conferido, em pe, e com link.
let fila = [];
for (const [palavra, v] of Object.entries(pal)) {
  const p = pre[palavra];
  if (!p || p.situacao !== 'ok' || !p.pix || !v.link) continue;
  const agora = n(p.pix), antes = n(p.antes);
  fila.push({
    palavra, produto: v.produto, link: v.link, pix: p.pix, antes: p.antes,
    // Desconto so conta quando o "antes" existe e e maior. Sem isso,
    // zero: nao invento desconto para ordenar.
    desconto: antes > agora ? Math.round((antes - agora) / antes * 100) : 0,
  });
}
if (!fila.length) throw new Error('Nenhum produto com preço conferido em palavras/precos.');

// Um produto por palavra, e nunca duas palavras do mesmo link seguidas.
const porLink = new Map();
for (const f of fila) if (!porLink.has(f.link)) porLink.set(f.link, f);
fila = [...porLink.values()];

const faltam = fila.filter(f => !jaForam.includes(f.link));
// Quando todos ja sairam, a volta comeca pelos melhores de novo.
const pool = faltam.length ? faltam : fila;
pool.sort((a, b) => b.desconto - a.desconto);
const escolhido = pool[0];

// HTML, nao Markdown. O Markdown legado do Telegram nao tem tachado:
// o ~R$ 100,00~ foi para o canal com os tils na tela, literal. E o
// MarkdownV2, que tem tachado, obriga a escapar ponto, parentese e
// hifen - e nome de produto da Shopee e feito disso. Em HTML sao tres
// caracteres para escapar e acabou.
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const linhas = [];
linhas.push('🔥 <b>' + esc(escolhido.produto) + '</b>');
linhas.push('');
linhas.push('💰 <b>' + esc(escolhido.pix) + '</b> no Pix');
if (escolhido.desconto > 0) {
  linhas.push('<s>' + esc(escolhido.antes) + '</s>  ·  ' + escolhido.desconto + '% de desconto');
}
linhas.push('');
linhas.push('<i>Preço conferido em ' + esc(dia) + '. A Shopee muda sem avisar: confirme na página.</i>');
linhas.push('');
linhas.push('A Vitrine Certa recebe uma comissão se você comprar pelo link. Para você não muda nada.');

return [{ json: {
  escolhido,
  payload: {
    chat_id: canal,
    text: linhas.join('\n'),
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: false, prefer_large_media: true, url: escolhido.link },
    reply_markup: { inline_keyboard: [[{ text: '🛒 Ver na Shopee', url: escolhido.link }]] },
  },
} }];
'''

js11_anotar = r'''
const r = $('Telegram: publicar').first().json;
if (r && r.ok === false) {
  throw new Error('O Telegram recusou: ' + (r.description || JSON.stringify(r)).slice(0, 200));
}
const escolhido = $('Escolher a oferta').first().json.escolhido;

let antes = [];
try {
  let a = $('Baixar o que já saiu').first().json;
  if (typeof a.data === 'string') a = JSON.parse(a.data);
  antes = (a && a.postados) || [];
} catch (e) { antes = []; }

// Quando a volta recomeca, a lista zera: se nao zerasse, ela so
// cresceria e o "ja foi" nunca mais sairia de la.
const postados = antes.includes(escolhido.link) ? [escolhido.link] : [...antes, escolhido.link];

return [{ json: {
  atualizado_em: new Date().toISOString(),
  ultimo: { palavra: escolhido.palavra, produto: escolhido.produto,
            pix: escolhido.pix, desconto: escolhido.desconto },
  quantos: postados.length,
  postados,
} }];
'''

n11 = [
    sticky(leia11, [-1180, -260], 480, 440),
    cron('Quatro vezes por dia', '0 9,12,15,20 * * *', [-620, 0]),
    # Sem gatilho de mao nao da para rodar uma vez e olhar o resultado:
    # nem pelo botao do painel, nem pela linha de comando, que responde
    # "Missing node to start execution".
    {'parameters': {}, 'id': 'namao', 'name': 'Rodar na mão',
     'type': 'n8n-nodes-base.manualTrigger', 'typeVersion': 1,
     'position': [-620, -160]},
    baixar('Baixar palavras', 'tg-pal', '/dados/palavras.json', [-400, -120]),
    baixar('Baixar preços', 'tg-pre', '/dados/precos.json', [-400, 20]),
    baixar('Baixar o que já saiu', 'tg-ja', '/dados/telegram-postados.json', [-400, 160], tolerante=True),
    code('Escolher a oferta', 'tg-esc', js11_escolher, [-140, 0]),
    telegram('Telegram: publicar', 'tg-pub', 'sendMessage', [120, 0]),
    code('Anotar que saiu', 'tg-ano', js11_anotar, [380, 0]),
    {'parameters': {'operation': 'toJson', 'mode': 'each',
                    'options': {'fileName': 'telegram-postados.json', 'format': True}},
     'id': 'tg-arq', 'name': 'Virar arquivo',
     'type': 'n8n-nodes-base.convertToFile', 'typeVersion': 1.1, 'position': [620, 0]},
    {'parameters': {'operation': 'write',
                    'fileName': '/midia/dados/telegram-postados.json', 'options': {}},
     'id': 'tg-sav', 'name': 'Guardar no servidor',
     'type': 'n8n-nodes-base.readWriteFile', 'typeVersion': 1, 'position': [860, 0]},
]
wf11 = montar('VC 11 · Telegram: a oferta do dia', 'vitrinecertatgp01', n11, [
    ('Quatro vezes por dia', 'Baixar palavras'),
    ('Rodar na mão', 'Baixar palavras'),
    ('Baixar palavras', 'Baixar preços'),
    ('Baixar preços', 'Baixar o que já saiu'),
    ('Baixar o que já saiu', 'Escolher a oferta'),
    ('Escolher a oferta', 'Telegram: publicar'),
    ('Telegram: publicar', 'Anotar que saiu'),
    ('Anotar que saiu', 'Virar arquivo'),
    ('Virar arquivo', 'Guardar no servidor'),
])

# =============================================================== VC 12
leia12 = """## VC 12 · O porteiro do grupo

Toma conta do grupo de discussao. Tres coisas, nessa ordem:

1. **Quem chega** recebe as regras, uma vez.
2. **Link de fora** postado por quem nao e administrador e apagado na
   hora, com um aviso curto. E o que mais suja grupo de ofertas: gente
   entrando so para pendurar o proprio link de afiliado.
3. **Quem escreve a palavra-chave** recebe o link do produto ali
   mesmo - o mesmo funil do Instagram, sem depender da Meta.

O que ele NAO faz: banir, expulsar ou silenciar ninguem. Apagar
mensagem e reversivel; banir pessoa errada nao e. Expulsao fica com
voce, na mao.

Nao apaga link do proprio canal: quando o grupo e o de discussao, toda
oferta publicada reaparece aqui sozinha, e sem essa excecao o porteiro
apagaria as nossas proprias ofertas.

Para funcionar, o bot precisa ser **administrador do grupo** com
permissao de apagar mensagens, e o webhook tem que estar apontando
para a URL deste fluxo (o passo a passo esta em telegram.md).

Precisa de TELEGRAM_BOT_TOKEN. TELEGRAM_DONO (o seu id de usuario) e
opcional e libera voce de postar link."""

js12_decidir = r'''
const u = $json.body || $json;
const msg = u.message || u.edited_message;
const canal = String($env.TELEGRAM_GRUPO || '').trim();

function nada(motivo) { return [{ json: { acao: 'nada', motivo } }]; }
if (!msg) return nada('update sem mensagem');
const chat = String(msg.chat?.id ?? '');
if (canal && chat !== canal) return nada('mensagem de outro chat');

// --------------------------------------------------- quem acabou de chegar
if (msg.new_chat_members && msg.new_chat_members.length) {
  const nomes = msg.new_chat_members
    .filter(m => !m.is_bot)
    .map(m => (m.first_name || 'gente').replace(/([*_`\[\]])/g, ''))
    .join(', ');
  if (!nomes) return nada('só bot entrou');
  const texto = [
    'Bem-vindo, ' + nomes + '! 👋',
    '',
    'Aqui a gente posta achado da Shopee com o preço conferido no dia.',
    '',
    '<b>Como funciona:</b>',
    '· Viu um produto e quer o link? Escreva a palavra-chave que aparece no post.',
    '· Link de divulgação de fora é apagado. Não é nada pessoal, é para o grupo não virar mural de spam.',
    '· A Vitrine Certa recebe comissão quando você compra pelos nossos links. Para você não muda o preço.',
  ].join('\n');
  return [{ json: { acao: 'boas-vindas',
    payload: { chat_id: msg.chat.id, text: texto, parse_mode: 'HTML',
               reply_to_message_id: msg.message_id } } }];
}

const texto = String(msg.text || msg.caption || '');
if (!texto) return nada('mensagem sem texto');

// --------------------------------------------------------- link de fora
// Quem pode postar link: voce, e o proprio canal.
//
// O segundo caso nao e detalhe. Quando o grupo e o de discussao do
// canal, TODA oferta publicada no canal reaparece aqui sozinha, com
// link e tudo. Sem esta linha o porteiro apagaria as nossas proprias
// ofertas, uma por uma, e ninguem entenderia o porque.
const doCanal = !!msg.sender_chat || msg.is_automatic_forward === true;
const souDono = doCanal
  || (String($env.TELEGRAM_DONO || '').trim() &&
      String(msg.from?.id || '') === String($env.TELEGRAM_DONO).trim());

const temLink = /(https?:\/\/|www\.|t\.me\/|wa\.me\/|chat\.whatsapp\.com)/i.test(texto)
  || (msg.entities || []).some(e => ['url', 'text_link'].includes(e.type));

if (temLink && !souDono) {
  return [{ json: {
    acao: 'apagar',
    payload: { chat_id: msg.chat.id, message_id: msg.message_id },
    aviso: { chat_id: msg.chat.id,
             text: 'Apaguei um link de fora. Aqui só vão os links dos produtos que a gente confere — '
                 + 'é o que mantém o grupo limpo. Para pedir o link de um produto, escreva a palavra-chave dele.' },
  } }];
}

// ------------------------------------------------------- palavra-chave
let pal = {};
try {
  let a = $('Baixar palavras').first().json;
  if (typeof a.data === 'string') a = JSON.parse(a.data);
  pal = a || {};
} catch (e) { pal = {}; }

const limpo = texto.trim().toUpperCase().replace(/[^A-ZÀ-Ú0-9 ]/g, '');
let achado = pal[limpo] ? limpo : '';
if (!achado) {
  // a palavra pode vir no meio de uma frase
  for (const k of Object.keys(pal)) {
    if (k.length >= 5 && new RegExp('(^| )' + k + '( |$)').test(limpo)) { achado = k; break; }
  }
}
if (!achado) return nada('nenhuma palavra reconhecida');

const v = pal[achado];
return [{ json: { acao: 'responder', payload: {
  chat_id: msg.chat.id,
  reply_to_message_id: msg.message_id,
  text: '🛒 <b>' + String(v.produto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</b>' + '

'
      + 'Aqui está o link. A Vitrine Certa recebe comissão se você comprar por ele — para você o preço é o mesmo.',
  parse_mode: 'HTML',
  reply_markup: { inline_keyboard: [[{ text: 'Ver na Shopee', url: v.link }]] },
} } }];
'''

js12_rotear = r'''
// Tres caminhos saem daqui, e cada um fala com um metodo diferente da
// API. Mando o metodo junto para um no so dar conta dos tres.
const d = $json;
if (d.acao === 'nada') return [];
if (d.acao === 'apagar') {
  return [{ json: { metodo: 'deleteMessage', payload: d.payload } },
          { json: { metodo: 'sendMessage', payload: d.aviso } }];
}
return [{ json: { metodo: 'sendMessage', payload: d.payload } }];
'''

n12 = [
    sticky(leia12, [-1180, -300], 480, 480),
    {'parameters': {'httpMethod': 'POST', 'path': 'telegram-porteiro',
                    'options': {}},
     'id': 'tg-hook', 'name': 'Telegram chama aqui',
     'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [-620, 0],
     'webhookId': 'vitrine-telegram-porteiro'},
    baixar('Baixar palavras', 'tg2-pal', '/dados/palavras.json', [-380, 0]),
    code('Decidir o que fazer', 'tg2-dec', js12_decidir, [-140, 0]),
    code('Separar as chamadas', 'tg2-rot', js12_rotear, [100, 0]),
    {'parameters': {
        'method': 'POST',
        'url': '=' + API + '{{ $env.TELEGRAM_BOT_TOKEN }}/{{ $json.metodo }}',
        'sendHeaders': True,
        'headerParameters': {'parameters': [
            {'name': 'Content-Type', 'value': 'application/json'}]},
        'sendBody': True, 'contentType': 'raw', 'rawContentType': 'application/json',
        'body': '={{ JSON.stringify($json.payload) }}',
        'options': {'response': {'response': {'neverError': True}}}},
     'id': 'tg2-api', 'name': 'Telegram: agir',
     'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.2, 'position': [340, 0],
     'onError': 'continueRegularOutput'},
]
wf12 = montar('VC 12 · Telegram: porteiro do grupo', 'vitrinecertatgm01', n12, [
    ('Telegram chama aqui', 'Baixar palavras'),
    ('Baixar palavras', 'Decidir o que fazer'),
    ('Decidir o que fazer', 'Separar as chamadas'),
    ('Separar as chamadas', 'Telegram: agir'),
])

for arq, wf in (('11-telegram-oferta.json', wf11),
                ('12-telegram-porteiro.json', wf12)):
    json.dump(wf, open(W + arq, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{arq:30} {wf['id']:20} {len(wf['nodes'])} nós")
