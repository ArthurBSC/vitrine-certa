# -*- coding: utf-8 -*-
"""Escuta cada video da grade e diz quais ja tem som proprio.

Eu tinha colocado uma faixa muda em todos os videos, porque sem faixa
nenhuma o Instagram recusa o container quando se pede trilha da
biblioteca. So que marquei trilha em todos, inclusive nos que ja tinham
a pessoa falando - e nesses a musica entra por cima da voz.

Faixa muda e silencio digital: o volume medio bate em -91 dB. Voz, mesmo
baixa, fica muito acima disso. E assim que da para separar os dois sem
abrir video por video.
"""
import csv, os, subprocess, sys, re
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/automacao/n8n/'
S = os.path.dirname(os.path.abspath(__file__)) + '/'
FF = ('C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/'
      'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/')
PUB = 'https://vitrine-midia.6lpnbe.easypanel.host/pub/'
CACHE = S + 'ouvir/'
os.makedirs(CACHE, exist_ok=True)

# Acima disso tem som de verdade. Silencio digital da -91 dB; deixo uma
# folga larga porque ruido de fundo de gravacao tambem conta como som.
LIMIAR = -70.0


def baixar(nome):
    p = CACHE + nome
    if not os.path.exists(p) or os.path.getsize(p) == 0:
        r = subprocess.run(['curl', '-sf', '--max-time', '120', '-o', p, PUB + nome])
        if r.returncode != 0:
            return None
    return p


def escutar(p):
    """Devolve (tem_trilha, volume_medio). Sem trilha nenhuma -> (False, None)."""
    r = subprocess.run([FF + 'ffprobe.exe', '-v', 'error', '-select_streams', 'a:0',
                        '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', p],
                       capture_output=True, text=True)
    if not r.stdout.strip():
        return False, None
    r = subprocess.run([FF + 'ffmpeg.exe', '-hide_banner', '-nostats', '-i', p,
                        '-map', 'a:0', '-af', 'volumedetect', '-f', 'null', '-'],
                       capture_output=True, text=True)
    m = re.search(r'mean_volume:\s*(-?[\d.]+) dB', r.stderr)
    return True, (float(m.group(1)) if m else None)


linhas = list(csv.DictReader(open(BASE + 'calendario.csv', encoding='utf-8')))
videos = [r for r in linhas
          if not r['status'] and r['data'] >= '2026-11-19' and '.mp4' in r['arquivo']]

com_voz, mudos, sem_faixa, sumidos = [], [], [], []
for r in videos:
    nome = [a.strip() for a in r['arquivo'].split('|') if a.strip().endswith('.mp4')][0]
    p = baixar(nome)
    if not p:
        sumidos.append((r['id'], nome))
        continue
    tem, vol = escutar(p)
    if not tem:
        sem_faixa.append((r['id'], r['palavra'], nome))
    elif vol is None or vol > LIMIAR:
        com_voz.append((r['id'], r['palavra'], nome, vol, r['audio_id']))
    else:
        mudos.append((r['id'], r['palavra'], nome, vol, r['audio_id']))

print('videos na grade:', len(videos))
print()
print('--- COM SOM PROPRIO (musica tem que sair) ---')
for i, pa, n, v, a in com_voz:
    print(f'  {i:24} {pa:14} {v:7.1f} dB   trilha={a or "-"}')
print()
print('--- mudos (podem receber musica) ---')
for i, pa, n, v, a in mudos:
    print(f'  {i:24} {pa:14} {v:7.1f} dB   trilha={a or "-"}')
if sem_faixa:
    print()
    print('--- sem faixa de audio nenhuma (o IG recusa com trilha) ---')
    for i, pa, n in sem_faixa:
        print('  ', i, pa, n)
if sumidos:
    print()
    print('--- nao baixaram ---', sumidos)

with open(S + 'com_voz.txt', 'w', newline='\n', encoding='utf-8') as f:
    f.write('\n'.join(i for i, *_ in com_voz) + '\n')
