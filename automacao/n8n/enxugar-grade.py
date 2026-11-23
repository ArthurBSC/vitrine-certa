# -*- coding: utf-8 -*-
"""Enxuga a grade para 1 Reels e 2 storys por dia.

A conta esta publicando 6,2 vezes por dia com zero engajamento. Cada
post a mais e mais uma vez por dia que a conta diz ao algoritmo que o
que ela publica nao interessa a ninguem. Menos post com a mesma
atencao e taxa melhor por post, que e o que o Instagram mede.

Nada e descartado: o que sai do dia de hoje entra mais pra frente. A
grade estica em vez de encolher.

O que tem data propria - Black Friday, Natal, presente - fica no dia
que estava. O resto escorre em volta.
"""
import csv, re, sys, datetime
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/'
HOJE = datetime.date(2026, 11, 23)
AGORA = 13 * 60 + 20          # 13:20 em Brasilia, quando isto rodou
COMECA = datetime.date(2026, 11, 24)

# Um Reels a noite, um story de manha e o lembrete depois do post.
SLOTS = [('story', '9:00'), ('feed', '19:00'), ('story', '20:00')]

DATADO = re.compile(r'natal|black ?friday|gta|papai noel|ceia|amigo secreto|árvore|arvore',
                    re.IGNORECASE)


def minutos(h):
    p = h.split(':')
    return int(p[0]) * 60 + int(p[1] if len(p) > 1 else 0)


linhas = list(csv.DictReader(open(BASE + 'calendario.csv', encoding='utf-8')))
campos = list(linhas[0].keys())

passado, pool = [], []
for r in linhas:
    d = datetime.date.fromisoformat(r['data'])
    ja_foi = d < HOJE or (d == HOJE and minutos(r['hora']) <= AGORA)
    if r['status'] or ja_foi:
        passado.append(r)
    else:
        pool.append(r)

print('linhas que nao mexo:', len(passado))
print('linhas para remontar:', len(pool))

for r in pool:
    r['datado'] = bool(DATADO.search(r['legenda'] + ' ' + r['produto'] + ' ' + r['hashtags']))
    r['lembrete'] = r['produto'].startswith('(lembrete)')

# Hoje ja esta em andamento. Decido o que fica hoje ANTES de montar as
# filas, senao a mesma linha entra duas vezes: uma hoje e outra la na
# frente, porque ela continua na fila de onde saiu.
hoje_sobrou = [r for r in pool if r['data'] == HOJE.isoformat()]
agenda = []
guardados = set()
for r in sorted(hoje_sobrou, key=lambda x: minutos(x['hora'])):
    if r['tipo'] == 'feed' and minutos(r['hora']) == 19 * 60:
        agenda.append((HOJE.isoformat(), '19:00', r)); guardados.add(id(r))
    elif r['lembrete'] and minutos(r['hora']) == 20 * 60:
        agenda.append((HOJE.isoformat(), '20:00', r)); guardados.add(id(r))
pool = [r for r in pool if id(r) not in guardados]

# Um lembrete com data propria prende o post que ele anuncia. "Amanha
# e Black Friday" e um story das 20h que acompanha o Reels das 19h: se
# so o story tivesse data, o post escorreria e o lembrete iria junto -
# foi assim que o "amanha e Black Friday" caiu em 15 de dezembro.
porDia = {}
for r in pool:
    porDia.setdefault((r['data'], r['palavra']), []).append(r)
for (data, palavra), rs in porDia.items():
    if any(x['datado'] and x['lembrete'] for x in rs):
        for x in rs:
            if x['tipo'] == 'feed':
                x['datado'] = True

feeds = [r for r in pool if r['tipo'] == 'feed']
storys = [r for r in pool if r['tipo'] != 'feed']
print('a distribuir: %d feed, %d story' % (len(feeds), len(storys)))

# O que tem data propria fica onde esta; o resto entra na ordem em que
# ja estava, que e a ordem que voce montou.
feeds_fixos = {}
for r in feeds:
    if r['datado']:
        feeds_fixos.setdefault(r['data'], r)
feeds_soltos = [r for r in feeds if r not in feeds_fixos.values()]

storys_fixos = {}
for r in storys:
    if r['datado'] and not r['lembrete']:
        storys_fixos.setdefault(r['data'], []).append(r)
fixos_ids = {id(x) for v in storys_fixos.values() for x in v}
storys_soltos = [r for r in storys if id(r) not in fixos_ids]

# O lembrete anda junto do post que ele anuncia.
lembretes = {}
for r in storys_soltos:
    if r['lembrete'] and r['palavra']:
        lembretes.setdefault(r['palavra'], []).append(r)
storys_soltos = [r for r in storys_soltos if not r['lembrete']]

print('feed com data propria:', len(feeds_fixos), '| story com data propria:', len(fixos_ids))

# ------------------------------------------------------------- monta
dia = COMECA
usados = set()
while feeds_soltos or storys_soltos or feeds_fixos or storys_fixos:
    iso = dia.isoformat()

    feed = feeds_fixos.pop(iso, None)
    if feed is None and feeds_soltos:
        feed = feeds_soltos.pop(0)
    if feed is not None:
        agenda.append((iso, '19:00', feed))

    # 20h: o lembrete do post do dia, se existir
    tarde = None
    if feed is not None and feed['palavra'] in lembretes and lembretes[feed['palavra']]:
        tarde = lembretes[feed['palavra']].pop(0)
    if tarde is None and storys_fixos.get(iso):
        tarde = storys_fixos[iso].pop(0)
    if tarde is None and storys_soltos:
        tarde = storys_soltos.pop(0)
    if tarde is not None:
        agenda.append((iso, '20:00', tarde))

    # 9h: outro produto, nunca o mesmo do post do dia
    manha = None
    if storys_fixos.get(iso):
        manha = storys_fixos[iso].pop(0)
    if manha is None:
        for i, r in enumerate(storys_soltos):
            if not feed or r['palavra'] != feed['palavra']:
                manha = storys_soltos.pop(i)
                break
    if manha is not None:
        agenda.append((iso, '9:00', manha))

    storys_fixos = {k: v for k, v in storys_fixos.items() if v}
    dia += datetime.timedelta(days=1)
    if (dia - COMECA).days > 200:
        raise SystemExit('loop longo demais, algo ficou preso')

# sobras de lembrete sem post (nao deveria acontecer, mas nao perco linha)
sobra = [r for v in lembretes.values() for r in v]
for r in sobra:
    agenda.append((dia.isoformat(), '9:00', r))
    dia += datetime.timedelta(days=1)

# ------------------------------------------------------------ aplica
agenda.sort(key=lambda x: (x[0], minutos(x[1])))
novos = []
for iso, hora, r in agenda:
    r = dict(r)
    r.pop('datado', None)
    r.pop('lembrete', None)
    r['data'] = iso
    r['hora'] = hora
    r['id'] = '%s-%s-%sh' % (iso, r['tipo'], hora.split(':')[0])
    novos.append(r)

vistos, finais = set(), []
for r in novos:
    base, n = r['id'], 2
    while r['id'] in vistos:
        r['id'] = '%s-%d' % (base, n); n += 1
    vistos.add(r['id'])
    finais.append(r)

todas = passado + finais
todas.sort(key=lambda r: (r['data'], minutos(r['hora'])))

with open(BASE + 'calendario.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=campos)
    w.writeheader()
    w.writerows(todas)

dias = sorted({r['data'] for r in finais})
print()
print('remontadas:', len(finais), 'em', len(dias), 'dias -> %.1f por dia' % (len(finais) / len(dias)))
print('a grade vai de', dias[0], 'ate', dias[-1])
print()
print('os proximos sete dias:')
for d in dias[:7]:
    doDia = [r for r in finais if r['data'] == d]
    print(' ', d, ' '.join('%s %s/%s' % (r['hora'][:5], r['tipo'][:5], r['palavra'][:11]) for r in doDia))
