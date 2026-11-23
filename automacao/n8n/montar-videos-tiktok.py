# -*- coding: utf-8 -*-
"""Monta os videos de TikTok a partir do acervo limpo.

Nao da para reaproveitar os Reels do Instagram: eles tem a tarja
"COMENTA AQUI EMBAIXO" queimada, que no TikTok nao quer dizer nada. A
fonte limpa e a pasta midia/, que tem a foto e o video do anuncio sem
nada por cima.

O que muda em relacao ao Reels:
  - o preco e o gancho, no primeiro segundo e grande
  - texto pensado para quem assiste sem som, que e a maioria
  - nada escrito embaixo de 320px nem a direita de 180px, que e onde
    ficam os botoes e a legenda do proprio TikTok
  - sem musica: a trilha entra no app, na hora de publicar, que e onde
    ela e licenciada
"""
import json, os, re, subprocess, sys
from PIL import ImageFont
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/'
M = BASE + 'midia/'
S = os.path.dirname(os.path.abspath(__file__)) + '/'
FF = ('C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/'
      'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/')
FONTE = S + 'fonte.ttf'
OUT = S + 'tiktok/'
os.makedirs(OUT, exist_ok=True)

L, A = 1080, 1920
SEG = 12                      # 12 segundos: curto o bastante para repetir
RODAPE = 320                  # o TikTok escreve por cima daqui para baixo


def larg(texto, tam):
    return ImageFont.truetype(FONTE, tam).getbbox(texto)[2]


def ajustar(texto, inicial, limite, minimo=18):
    t = inicial
    while t > minimo and larg(texto, t) > limite:
        t -= 2
    return t


def escapar(s):
    # O % fica de fora de proposito: no drawtext ele abre expansao e
    # escapar com barra nao sobrevive a travessia do filtro - o ffmpeg
    # responde "Stray % near ' OFF'". Quem resolve e expansion=none,
    # que vai em todo drawtext daqui.
    return s.replace('\\', '\\\\').replace("'", "\u2019").replace(':', r'\:')


def sobrepor(pix, desconto, nome):
    """Gancho em cima, produto e chamada em baixo, longe da interface."""
    so_min = pix.split(' a ')[0].strip()
    limite = int(L * 0.86)

    t_cham = 72
    t_preco = ajustar(so_min, 190, limite)
    t_selo = 64
    y_cham = int(A * 0.07)
    y_preco = y_cham + int(t_cham * 1.5)
    y_selo = y_preco + int(t_preco * 1.35) + 10

    # Uma faixa só, cobrindo gancho, preço e selo. Antes o selo caía
    # fora dela e flutuava em cima da arte do anúncio, brigando com o
    # texto que o vendedor já tinha posto na foto.
    alto = int(t_cham * 1.5) + int(t_preco * 1.35) + 56
    if desconto > 0:
        alto += int(t_selo * 1.5) + 26

    partes = [
        f"drawbox=x=0:y={y_cham - 28}:w={L}:h={alto}:color=black@0.55:t=fill",
        f"drawtext=fontfile=fonte.ttf:text='{escapar('ACHEI ESSE POR')}':fontcolor=white@0.92:expansion=none:"
        f"fontsize={t_cham}:x=(w-text_w)/2:y={y_cham}",
        f"drawtext=fontfile=fonte.ttf:text='{escapar(so_min)}':fontcolor=white:expansion=none:"
        f"fontsize={t_preco}:x=(w-text_w)/2:y={y_preco}:borderw=6:bordercolor=black@0.55",
    ]

    if desconto > 0:
        selo = f'{desconto}% OFF'
        w_selo = larg(selo, t_selo) + 56
        x_selo = (L - w_selo) // 2
        partes += [
            f"drawbox=x={x_selo}:y={y_selo}:w={w_selo}:h={int(t_selo * 1.5)}"
            f":color=0x16a34a@0.95:t=fill",
            f"drawtext=fontfile=fonte.ttf:text='{escapar(selo)}':fontcolor=white:expansion=none:"
            f"fontsize={t_selo}:x=(w-text_w)/2:y={y_selo + int(t_selo * 0.25)}",
        ]

    # rodape: nome curto e a chamada, acima da zona do TikTok
    curto = nome if len(nome) <= 42 else nome[:41].rsplit(' ', 1)[0] + '...'
    t_nome = ajustar(curto, 52, limite)
    t_cta = 56
    y_cta = A - RODAPE - int(t_cta * 1.4)
    y_nome = y_cta - int(t_nome * 1.5)
    partes += [
        # mais escura que a de cima: aqui embaixo a foto do anúncio
        # costuma ter os seus próprios ícones e selos, e o nome sumia
        f"drawbox=x=0:y={y_nome - 24}:w={L}:h={int(t_nome * 1.5) + int(t_cta * 1.4) + 48}"
        f":color=black@0.72:t=fill",
        f"drawtext=fontfile=fonte.ttf:text='{escapar(curto)}':fontcolor=white@0.9:expansion=none:"
        f"fontsize={t_nome}:x=(w-text_w)/2:y={y_nome}",
        f"drawtext=fontfile=fonte.ttf:text='{escapar('LINK NO PERFIL')}':fontcolor=0x4ade80:expansion=none:"
        f"fontsize={t_cta}:x=(w-text_w)/2:y={y_cta}",
    ]
    return ','.join(partes)


def de_video(ent, sai, texto):
    enquadrar = (
        f"[0:v]scale={L}:{A}:force_original_aspect_ratio=increase,crop={L}:{A},"
        f"boxblur=34:4,eq=brightness=-0.10[bg];"
        f"[0:v]scale={L}:{A}:force_original_aspect_ratio=decrease[fg];"
        f"[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p," + texto)
    subprocess.run([FF + 'ffmpeg.exe', '-v', 'error', '-y', '-t', str(SEG), '-i', ent,
                    '-filter_complex', enquadrar, '-an',
                    '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast',
                    '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', sai],
                   check=True, cwd=S)


def de_fotos(fotos, sai, texto):
    """Cada foto ganha um empurrao lento de zoom. Foto parada 12 segundos
    nao segura ninguem; com movimento, segura."""
    dur = SEG / len(fotos)
    quadros = int(dur * 30)
    entradas, filtros, nomes = [], [], []
    for i, f in enumerate(fotos):
        # UM quadro por foto, e so. O zoompan repete cada quadro que
        # recebe d vezes: com a foto entrando a 25 quadros por segundo,
        # tres segundos viravam 75 x 90 quadros, e o video de 12
        # segundos saiu com 15 minutos e 250 MB.
        entradas += ['-loop', '1', '-framerate', '1', '-t', '1', '-i', f]
        filtros.append(
            f"[{i}:v]scale={L*2}:{A*2}:force_original_aspect_ratio=increase,"
            f"crop={L*2}:{A*2},boxblur=40:4,eq=brightness=-0.10[bg{i}];"
            f"[{i}:v]scale={L*2}:{A*2}:force_original_aspect_ratio=decrease[fg{i}];"
            f"[bg{i}][fg{i}]overlay=(W-w)/2:(H-h)/2,"
            f"zoompan=z='min(zoom+0.0012,1.12)':d={quadros}:s={L}x{A}:fps=30,"
            f"trim=duration={dur:.2f},setpts=PTS-STARTPTS[v{i}]")
        nomes.append(f'[v{i}]')
    cadeia = ';'.join(filtros) + ';' + ''.join(nomes) + \
             f"concat=n={len(fotos)}:v=1:a=0,format=yuv420p,{texto}[out]"
    subprocess.run([FF + 'ffmpeg.exe', '-v', 'error', '-y'] + entradas +
                   ['-filter_complex', cadeia, '-map', '[out]', '-an',
                    '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast',
                    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', sai],
                   check=True, cwd=S)


fila = json.load(open(S + 'tiktok_fila.json', encoding='utf-8'))
pal = json.load(open(BASE + 'automacao/n8n/palavras.json', encoding='utf-8'))
nomes = {k: v['produto'] for k, v in pal.items()}

feitos = []
for item in fila:
    pasta = M + item['pasta'] + '/'
    nome = nomes.get(item['palavra'], item['palavra'])
    sai = OUT + item['palavra'].lower() + '.mp4'
    texto = sobrepor(item['pix'], item['desconto'], nome)
    try:
        if item['video'] and os.path.isfile(pasta + 'video.mp4'):
            de_video(pasta + 'video.mp4', sai, texto)
            origem = 'vídeo'
        else:
            fotos = [pasta + f for f in sorted(os.listdir(pasta)) if f.startswith('foto-')][:4]
            if len(fotos) < 2:
                print('  pulei', item['palavra'], '- material de menos')
                continue
            de_fotos(fotos, sai, texto)
            origem = f"{len(fotos)} fotos"
    except subprocess.CalledProcessError as e:
        print('  falhou', item['palavra'], e)
        continue
    feitos.append(os.path.basename(sai))
    print('%-12s %3d%%  %-22s  %s' % (item['palavra'], item['desconto'], item['pix'], origem))

print()
print('vídeos prontos:', len(feitos), 'em', OUT)
