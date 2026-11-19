# -*- coding: utf-8 -*-
"""Queima o preco numa faixa no topo da midia que ja tem a tarja embaixo.

Pedido do Arthur: o que para o dedo muitas vezes e o valor, nao a foto.
A faixa de baixo continua com a palavra-chave; o preco entra em cima,
onde o olho bate primeiro.

A midia e baixada do servidor (ja com a tarja), ganha a faixa e volta.
"""
import csv, os, subprocess, sys
from PIL import ImageFont
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/'
S = 'C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad/'
FF = ('C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/'
      'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/')
FONTE = S + 'fonte.ttf'
ORIG = S + 'preco_in/'
DEST = S + 'preco_out/'
for d in (ORIG, DEST):
    os.makedirs(d, exist_ok=True)

DE_ONDE = '2026-11-19'          # nao mexe no que ja foi ao ar


def dimensoes(p):
    r = subprocess.run([FF + 'ffprobe.exe', '-v', 'error', '-select_streams', 'v:0',
                        '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=,', p],
                       capture_output=True, text=True, check=True)
    w, h = r.stdout.strip().split(',')[:2]
    return int(w), int(h)


def ajustar(texto, inicial, limite):
    t = inicial
    while t > 16 and ImageFont.truetype(FONTE, t).getbbox(texto)[2] > limite:
        t -= 2
    return t


def filtro(w, h, preco):
    base = min(w, h)
    limite = int(w * 0.86)
    # faixa curta cabe grande; faixa longa diminui sozinha
    t = ajustar(preco, int(base * 0.115), limite)
    pad = int(base * 0.030)
    banda = pad + int(t * 1.30) + pad
    topo = int(h * 0.055)
    return (f"drawbox=x=0:y={topo}:w={w}:h={banda}:color=black@0.60:t=fill,"
            f"drawtext=fontfile=fonte.ttf:text='{preco}':fontcolor=white:"
            f"fontsize={t}:x=(w-text_w)/2:y={topo + pad}")


linhas = list(csv.DictReader(open(BASE + 'automacao/n8n/calendario.csv', encoding='utf-8')))
alvos = []
for r in linhas:
    if not r.get('preco') or r['data'] < DE_ONDE or r['status']:
        continue
    arqs = [a.strip() for a in r['arquivo'].split('|') if a.strip()]
    escolhidos = arqs if len(arqs) == 1 else [arqs[0], arqs[-1]]
    for a in escolhidos:
        alvos.append((a, r['preco']))

print('arquivos a receber a faixa:', len(alvos))
feitos = []
for i, (nome, preco) in enumerate(alvos, 1):
    ent = ORIG + nome
    if not os.path.exists(ent):
        u = 'https://vitrine-midia.6lpnbe.easypanel.host/pub/' + nome
        if subprocess.run(['curl', '-sf', '-o', ent, u]).returncode != 0:
            print('  nao baixou:', nome)
            continue
    w, h = dimensoes(ent)
    vf = filtro(w, h, preco.replace(':', r'\:'))
    sai = DEST + nome
    if nome.lower().endswith(('.jpg', '.jpeg', '.png')):
        cmd = [FF + 'ffmpeg.exe', '-v', 'error', '-y', '-i', ent, '-vf', vf,
               '-frames:v', '1', '-q:v', '2', sai]
    else:
        cmd = [FF + 'ffmpeg.exe', '-v', 'error', '-y', '-i', ent, '-vf', vf,
               '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast',
               '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'copy', sai]
    subprocess.run(cmd, check=True, cwd=S)
    feitos.append(nome)
    if i % 15 == 0:
        print('  ...', i)

print('prontos:', len(feitos))
open(S + 'com_preco.txt', 'w', newline='\n').write('\n'.join(feitos) + '\n')
