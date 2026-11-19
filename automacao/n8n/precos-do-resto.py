# -*- coding: utf-8 -*-
"""Leva os precos dos 96 links de story para precos.json e para o calendario.

A primeira rodada cobriu os 31 produtos de Reels. Esta fecha o resto do
catalogo em uso: tudo que vai ao ar de 19/11 em diante agora tem valor.

Produto sem preco e produto que nao pode ir ao ar, entao quem voltou
esgotado ou fora do ar sai da grade.
"""
import csv, json, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/'
S = 'C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad/'
DATA = '19/11/2026'

fila = json.load(open(S + 'faltam_preco.json', encoding='utf-8'))
por_i = {x['i']: x['palavras'] for x in fila}

novos = {}
for linha in open(S + 'coletado.txt', encoding='utf-8'):
    linha = linha.strip()
    if not linha:
        continue
    i, _nome, pix, antes, sit = linha.split('|')
    for p in por_i[int(i)]:
        novos[p] = {'pix': pix, 'antes': antes, 'situacao': sit}

d = json.load(open(BASE + 'precos.json', encoding='utf-8'))
d['precos'].update(novos)
d['conferido_em'] = DATA
json.dump(d, open(BASE + 'precos.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print('precos no arquivo:', len(d['precos']))

CAL = BASE + 'calendario.csv'
linhas = list(csv.DictReader(open(CAL, encoding='utf-8')))
campos = list(linhas[0].keys())

com, fora = 0, []
for r in linhas:
    if r['data'] < '2026-11-19' or r['status']:
        continue
    p = d['precos'].get(r['palavra'])
    if not p:
        continue
    if p['situacao'] != 'ok':
        r['status'] = 'CANCELADO'
        fora.append((r['data'], r['hora'][:5], r['palavra'], p['situacao']))
        continue
    if r['preco']:
        continue
    r['preco'] = p['pix']
    com += 1
    if r['legenda'] and 'R$' not in r['legenda']:
        partes = r['legenda'].split('\n\n', 1)
        valor = f"💰 {r['preco']} no Pix · preço de {DATA}, confira no link"
        r['legenda'] = partes[0] + '\n\n' + valor + ('\n\n' + partes[1] if len(partes) > 1 else '')

with open(CAL, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=campos)
    w.writeheader()
    w.writerows(linhas)

print('linhas que ganharam preco agora:', com)
print('tiradas do ar:')
for x in fora:
    print('  ', *x)
futuras = [r for r in linhas if r['data'] >= '2026-11-19' and not r['status']]
print('futuras no ar:', len(futuras), '| com preco:', sum(1 for r in futuras if r['preco']))
