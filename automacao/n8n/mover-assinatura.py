# -*- coding: utf-8 -*-
"""Tira a assinatura de dentro do no de codigo e poe no no Crypto.

O sandbox do n8n nao expoe SHA256: nao tem globalThis.crypto.subtle nem
deixa dar require('crypto'). Meu teste passou porque rodou em node puro,
fora do sandbox - erro meu de nao ter testado dentro.

O no Crypto faz o hash. O segredo entra nele por expressao, lida na hora
da execucao, entao ele nao fica guardado no item e nao aparece no
historico de execucao do painel.
"""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

W = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/workflows/'

ARQUIVOS = {
    '6-links-com-subid.json': 'Pedir os links',
    '7-relatorio-de-conversao.json': 'Pedir o relatório',
    '8-radar-coletor.json': 'Montar as buscas',
    '9-radar-pontuacao.json': None,     # este nao fala com a Shopee
}

CHAVES = """function chaves() {
  const appId = String($env.SHOPEE_APP_ID || '').trim();
  if (!appId || !String($env.SHOPEE_APP_SECRET || '').trim()) {
    throw new Error('Faltam SHOPEE_APP_ID e SHOPEE_APP_SECRET no ambiente do n8n.');
  }
  return { appId };
}
"""


def limpar(js):
    """Tira a funcao assinar e qualquer chamada a ela."""
    i = js.find('\n// Assina do jeito')
    j = js.find('function chaves()')
    if i >= 0 and j > i:
        js = js[:i] + '\n' + js[j:]
    # a funcao chaves nao precisa mais devolver o segredo
    k = js.find('function chaves()')
    if k >= 0:
        fim = js.find('\n}\n', k)
        js = js[:k] + CHAVES.strip() + js[fim + 3:]
    js = js.replace('const { appId, secret } = chaves();', 'const { appId } = chaves();')
    js = re.sub(r'\n\s*const assinatura = await assinar\([^)]*\);', '', js)
    js = js.replace(', assinatura }', ' }').replace('{ appId, ts, corpo, assinatura,', '{ appId, ts, corpo,')
    js = re.sub(r",\s*\n\s*assinatura: await assinar\([^)]*\)", '', js)
    return js


def no_crypto(pos):
    return {
        'parameters': {
            'action': 'hash',
            'type': 'SHA256',
            # O segredo entra aqui por expressao: e lido na execucao e nao
            # vira dado do item, entao nao fica no historico.
            'value': '={{ $json.appId + $json.ts + $json.corpo + $env.SHOPEE_APP_SECRET }}',
            'dataPropertyName': 'assinatura',
            'encoding': 'hex',
        },
        'id': 'assinar', 'name': 'Assinar',
        'type': 'n8n-nodes-base.crypto', 'typeVersion': 1,
        'position': [pos[0] + 120, pos[1] + 150],
    }


for arq, nome_code in ARQUIVOS.items():
    if not nome_code:
        print(f'{arq:34} nao fala com a Shopee, nada a fazer')
        continue
    w = json.load(open(W + arq, encoding='utf-8'))
    code = next(n for n in w['nodes'] if n['name'] == nome_code)
    antes = code['parameters']['jsCode']
    code['parameters']['jsCode'] = limpar(antes)
    if 'assinar(' in code['parameters']['jsCode']:
        raise SystemExit(f'{arq}: ainda sobrou chamada a assinar()')

    if not any(n['name'] == 'Assinar' for n in w['nodes']):
        w['nodes'].append(no_crypto(code['position']))

    # o Crypto entra no meio: code -> Assinar -> quem o code alimentava
    seguinte = w['connections'][nome_code]['main'][0][0]['node']
    w['connections'][nome_code] = {'main': [[{'node': 'Assinar', 'type': 'main', 'index': 0}]]}
    w['connections']['Assinar'] = {'main': [[{'node': seguinte, 'type': 'main', 'index': 0}]]}

    json.dump(w, open(W + arq, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{arq:34} {nome_code} -> Assinar -> {seguinte}')
