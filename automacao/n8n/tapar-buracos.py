# -*- coding: utf-8 -*-
"""Tapa os 8 horarios que ficaram vazios quando produtos esgotaram.

Cada linha volta com outro produto, escolhido pelo desconto que nos
mesmos conferimos hoje - preco de antes contra preco no Pix, nada de
"de/por" da Shopee.

Os tres horarios de feed eram Reels e viram Carrossel, montado com as
fotos do acervo, para nao depender de gravacao.

A pasta de fotos e casada pelo NOME EXATO do produto, lido da terceira
linha da legenda.txt. Casar por pedaco do nome ja trocou produto uma
vez aqui, e tem cinco pastas de "utensilios de silicone" no acervo.
"""
import csv, json, os, subprocess, sys
from PIL import ImageFont
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/'
N8N = BASE + 'automacao/n8n/'
MIDIA = BASE + 'midia/'
S = os.path.dirname(os.path.abspath(__file__)) + '/'
FF = ('C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/'
      'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/')
FONTE = S + 'fonte.ttf'
SAIDA = S + 'buracos/'
os.makedirs(SAIDA, exist_ok=True)
DATA = '19/11/2026'

CHAMADA = {'story': 'RESPONDE ESSA STORY COM', 'feed': 'COMENTA AQUI EMBAIXO'}

# id da linha -> (palavra, gancho, categoria, hashtags)
PLANO = {
 '2026-11-20-feed-11h': ('SECAGEM', 'O tapete que seca o pé e seca sozinho 🚿', 'Banheiro',
                         '#achadinhosshopee #banheiro #organizacao #casa #publi'),
 '2026-11-20-story-12h': ('SECAGEM', 'Tapete que seca sozinho, no post de hoje 🚿', 'Banheiro', ''),
 '2026-11-25-story-13h': ('TORNEIRA', 'Torneira de parede que muda a cozinha 🚰', 'Cozinha', ''),
 '2026-11-26-story-13h': ('PLUMA', 'Travesseiro de pluma com cara de hotel 🛏️', 'Quarto', ''),
 '2026-11-29-feed-19h': ('UTENSILIOS', 'Kit de 12 utensílios que não arranha a panela 🥄', 'Cozinha',
                         '#achadinhosshopee #cozinha #utilidadesdomesticas #blackfriday #publi'),
 '2026-11-29-story-20h': ('UTENSILIOS', 'Kit de utensílios no post de hoje 🥄', 'Cozinha', ''),
 '2026-11-30-feed-19h': ('MEIACALCA', 'Meia-calça térmica forrada por menos de vinte 🧦', 'Moda Feminina',
                         '#achadinhosshopee #modafeminina #inverno #achadinhos #publi'),
 '2026-11-30-story-20h': ('MEIACALCA', 'Meia-calça térmica no post de hoje 🧦', 'Moda Feminina', ''),
}

pal = json.load(open(N8N + 'palavras.json', encoding='utf-8'))
pre = json.load(open(N8N + 'precos.json', encoding='utf-8'))['precos']

# nome exato do produto -> pasta
pastas = {}
for d in sorted(os.listdir(MIDIA)):
    leg = MIDIA + d + '/legenda.txt'
    if not os.path.isfile(leg):
        continue
    linhas = open(leg, encoding='utf-8').read().split('\n')
    if len(linhas) > 2 and linhas[2].strip():
        pastas.setdefault(linhas[2].strip(), d)

for p, (palavra, _g, _c, _h) in PLANO.items():
    nome = pal[palavra]['produto']
    if nome not in pastas:
        raise SystemExit('sem pasta para ' + palavra + ': ' + nome)
print('as 8 linhas tem pasta de fotos conferida pelo nome exato')


def dimensoes(p):
    r = subprocess.run([FF + 'ffprobe.exe', '-v', 'error', '-select_streams', 'v:0',
                        '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=,', p],
                       capture_output=True, text=True, check=True)
    w, h = r.stdout.strip().split(',')[:2]
    return int(w), int(h)


def ajustar(texto, inicial, limite, minimo=14):
    t = inicial
    while t > minimo and ImageFont.truetype(FONTE, t).getbbox(texto)[2] > limite:
        t -= 1
    return t


def tarja(w, h, tipo, palavra):
    """Rodape de chamada, igual ao do resto da grade."""
    l1, l2 = CHAMADA[tipo], palavra
    base = min(w, h)
    limite = int(w * 0.84)
    t2 = ajustar(l2, int(base * 0.115), limite)
    t1 = ajustar(l1, int(base * 0.040), limite)
    lh1, lh2 = int(t1 * 1.30), int(t2 * 1.30)
    pad, gap = int(base * 0.035), int(base * 0.008)
    banda = pad + lh1 + gap + lh2 + pad
    margem = int(h * 0.15) if tipo == 'story' else int(h * 0.055)
    topo = h - margem - banda
    y1 = topo + pad
    return (f"drawbox=x=0:y={topo}:w={w}:h={banda}:color=black@0.55:t=fill,"
            f"drawtext=fontfile=fonte.ttf:text='{l1}':fontcolor=white@0.88:"
            f"fontsize={t1}:x=(w-text_w)/2:y={y1},"
            f"drawtext=fontfile=fonte.ttf:text='{l2}':fontcolor=white:"
            f"fontsize={t2}:x=(w-text_w)/2:y={y1 + lh1 + gap}")


def faixa(w, h, preco):
    """Preco no topo, onde o olho bate primeiro."""
    base = min(w, h)
    t = ajustar(preco, int(base * 0.115), int(w * 0.86), 16)
    pad = int(base * 0.030)
    topo = int(h * 0.055)
    return (f"drawbox=x=0:y={topo}:w={w}:h={pad + int(t * 1.30) + pad}:color=black@0.60:t=fill,"
            f"drawtext=fontfile=fonte.ttf:text='{preco}':fontcolor=white:"
            f"fontsize={t}:x=(w-text_w)/2:y={topo + pad}")


def montar(foto, saida, larg, alt, tipo, palavra, preco):
    """Foto inteira dentro do quadro, fundo dela mesma borrado. Nada cortado."""
    enquadrar = (
        f"[0:v]scale={larg}:{alt}:force_original_aspect_ratio=increase,"
        f"crop={larg}:{alt},boxblur=30:4,eq=brightness=-0.06[bg];"
        f"[0:v]scale={larg}:{alt}:force_original_aspect_ratio=decrease[fg];"
        f"[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p")
    if palavra or preco:
        extra = []
        if preco:
            extra.append(faixa(larg, alt, preco.replace(':', r'\:')))
        if palavra:
            extra.append(tarja(larg, alt, tipo, palavra))
        enquadrar += ',' + ','.join(extra)
    subprocess.run([FF + 'ffmpeg.exe', '-v', 'error', '-y', '-i', foto,
                    '-filter_complex', enquadrar, '-frames:v', '1', '-q:v', '2', saida],
                   check=True, cwd=S)


cal = list(csv.DictReader(open(N8N + 'calendario.csv', encoding='utf-8')))
campos = list(cal[0].keys())
porid = {r['id']: r for r in cal}
feitos = []

for ident, (palavra, gancho, categoria, hashtags) in PLANO.items():
    r = porid[ident]
    nome = pal[palavra]['produto']
    pasta = MIDIA + pastas[nome] + '/'
    fotos = sorted(f for f in os.listdir(pasta) if f.startswith('foto-'))
    preco = pre[palavra]['pix']
    story = r['tipo'] == 'story'

    if story:
        arqs = [ident + '.jpg']
        montar(pasta + fotos[0], SAIDA + arqs[0], 1080, 1920, 'story', palavra, preco)
    else:
        arqs = [f'{ident}-{i}.jpg' for i in range(1, len(fotos) + 1)]
        for i, f in enumerate(fotos):
            # No carrossel a tarja vai so na primeira e na ultima, que
            # sao as que a pessoa de fato ve antes de decidir.
            ponta = i in (0, len(fotos) - 1)
            montar(pasta + f, SAIDA + arqs[i], 1080, 1080, 'feed',
                   palavra if ponta else '', preco if ponta else '')
    feitos += arqs

    r['formato'] = 'Story' if story else 'Carrossel'
    r['produto'] = nome
    r['categoria'] = categoria
    r['arquivo'] = '|'.join(arqs)
    r['link'] = pal[palavra]['link']
    r['legenda'] = (gancho + '\n\n💰 ' + preco + ' no Pix · preço de ' + DATA +
                    ', confira no link')
    r['hashtags'] = hashtags
    r['palavra'] = palavra
    r['preco'] = preco
    r['status'] = ''
    r['post_id'] = ''
    r['postado_em'] = ''
    r['audio_id'] = ''
    print(f"{ident:24} {palavra:12} {preco:22} {len(arqs)} arquivo(s)")

with open(N8N + 'calendario.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=campos)
    w.writeheader()
    w.writerows(cal)

open(S + 'buracos.txt', 'w', newline='\n').write('\n'.join(feitos) + '\n')
futuras = [r for r in cal if r['data'] >= '2026-11-19' and not r['status']]
print('\narquivos montados:', len(feitos))
print('futuras no ar:', len(futuras), '| com preco:', sum(1 for r in futuras if r['preco']))
