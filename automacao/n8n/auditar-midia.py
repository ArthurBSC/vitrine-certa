# -*- coding: utf-8 -*-
"""Confere se a midia de cada linha veio da pasta do produto certo.

O casamento que usei nas rodadas de hoje olhava so os 22 primeiros
caracteres do nome da pasta. "Jogo de Lencol 400 Fios Extra Macio" e
"Jogo de Lencol 400 Fios Micropercal" tem os mesmos 22, entao o
segundo casava com a pasta do primeiro.
"""
import sys, os, re, csv, json
sys.path.insert(0, 'C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad')
sys.stdout.reconfigure(encoding='utf-8')
from carregar import produtos, norm

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/'
P = {p['affiliateLink']: p for p in produtos()}
pastas = [d for d in os.listdir(BASE + 'midia') if os.path.isdir(BASE + 'midia/' + d)]


def slug(nome):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', norm(nome))).strip('-')


def frouxo(s):
    """O casamento errado que usei hoje: primeiro que bater 22 chars."""
    for d in pastas:
        if s.startswith(re.sub(r'^\d+-', '', d)[:22]):
            return d
    return None


def estrito(s):
    """Prefixo mais longo; se empatar no tamanho, e ambiguo."""
    melhor, tam, empate = None, 0, False
    for d in pastas:
        base = re.sub(r'^\d+-', '', d)
        if s.startswith(base):
            if len(base) > tam:
                melhor, tam, empate = d, len(base), False
            elif len(base) == tam:
                empate = True
    return (None if empate else melhor), tam


cal = list(csv.DictReader(open(BASE + 'automacao/n8n/calendario.csv', encoding='utf-8')))
ruins = []
for r in cal:
    p = P.get(r['link'])
    if not p:
        continue                      # lembrete, sem produto proprio
    s = slug(p['name'])
    f, c = frouxo(s), estrito(s)[0]
    if f != c:
        ruins.append((r, p, f, c))

print('linhas conferidas:', len(cal))
print('midia da pasta errada:', len(ruins))
for r, p, f, c in ruins:
    print(f"\n  {r['id']} | {r['palavra']}")
    print(f"    produto : {p['name'][:62]}")
    print(f"    usou    : {f}")
    print(f"    correto : {c}")

json.dump([[r['id'], c] for r, p, f, c in ruins],
          open('C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad/corrigir.json', 'w'))
