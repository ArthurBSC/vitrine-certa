# -*- coding: utf-8 -*-
"""Monta os stories dos destaques Moda e Duvidas, ja em 9:16.

Destaque nao se cria por API - os endpoints nem existem. Estes arquivos
sao publicados como story normal, e salvar no destaque e na mao.
"""
import sys, os, re, subprocess
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, 'C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad')
sys.stdout.reconfigure(encoding='utf-8')
from carregar import produtos, norm

B = 'C:/Users/DELL G15/Desktop/PROJETOS/VENDAS/AFILIADO/'
S = 'C:/Users/DELLG1~1/AppData/Local/Temp/claude/e1443e8320c64822/3a687cc6-9ceb-4121-add2-6e0aacef6fc5/scratchpad/'
OUT = S + 'destaques/'
os.makedirs(OUT, exist_ok=True)
NEGRITO = 'C:/Windows/Fonts/arialbd.ttf'
NORMAL = 'C:/Windows/Fonts/arial.ttf'
W, H = 1080, 1920
pastas = os.listdir(B + 'midia')


def fonte(caminho, t):
    return ImageFont.truetype(caminho, t)


def cabe(texto, f, limite):
    return f.getbbox(texto)[2] <= limite


def ajustar(texto, caminho, inicial, limite, minimo=20):
    t = inicial
    while t > minimo and not cabe(texto, fonte(caminho, t), limite):
        t -= 2
    return fonte(caminho, t)


def quebrar(texto, f, limite):
    linhas, atual = [], ''
    for palavra in texto.split():
        teste = (atual + ' ' + palavra).strip()
        if f.getbbox(teste)[2] <= limite or not atual:
            atual = teste
        else:
            linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def tarja(img, acima, palavra):
    """A mesma tarja dos outros stories: chamada pequena, palavra grande."""
    d = ImageDraw.Draw(img, 'RGBA')
    limite = int(W * 0.84)
    fg = ajustar(palavra, NEGRITO, 124, limite)
    fp = ajustar(acima, NEGRITO, 43, limite)
    lh1, lh2 = int(fp.size * 1.3), int(fg.size * 1.3)
    pad, gap = 37, 8
    banda = pad + lh1 + gap + lh2 + pad
    topo = H - int(H * 0.15) - banda
    d.rectangle([0, topo, W, topo + banda], fill=(0, 0, 0, 140))
    y = topo + pad
    d.text(((W - fp.getbbox(acima)[2]) / 2, y), acima, font=fp, fill=(255, 255, 255, 225))
    y += lh1 + gap
    d.text(((W - fg.getbbox(palavra)[2]) / 2, y), palavra, font=fg, fill='white')
    return img


def quadro916(caminho):
    """Foto quadrada dentro de 9:16, fundo dela mesma, borrado."""
    from PIL import ImageFilter, ImageEnhance
    im = Image.open(caminho).convert('RGB')
    w, h = im.size
    escala = max(W / w, H / h)
    bg = im.resize((int(w * escala), int(h * escala)))
    x = (bg.width - W) // 2
    y = (bg.height - H) // 2
    bg = bg.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.92)
    fg = im.resize((W, int(h * W / w)))
    bg.paste(fg, (0, (H - fg.height) // 2))
    return bg


def pasta_de(p):
    s = re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', norm(p['name']))).strip('-')
    c = [d for d in pastas if s.startswith(re.sub(r'^\d+-', '', d)[:22])]
    return c[0] if c else None


# ---------- MODA ----------
ESCOLHA = [('Calça pantalona', 'PANTALONA'), ('Tênis Meia Feminino', 'TENIS'),
           ('Blusa Feminina Manga Longa Cacharrel', 'BLUSA'),
           ('Macaquinho Fitness', 'MACAQUINHO')]
P = produtos()
feitos = []
for i, (trecho, palavra) in enumerate(ESCOLHA, 1):
    p = next(x for x in P if x['name'].startswith(trecho))
    d = pasta_de(p)
    img = quadro916(B + 'midia/' + d + '/foto-1.jpg')
    img = tarja(img, 'RESPONDE ESSA STORY COM', palavra)
    nome = f'destaque-moda-{i}.jpg'
    img.save(OUT + nome, quality=92)
    feitos.append(nome)
    print(f'moda {i}: {palavra:12} | {p["name"][:44]}')

# ---------- DUVIDAS ----------
CARDS = [
    ('Como eu compro?',
     'Clica no link que eu te mando no direct. Ele abre direto na página '
     'do produto, dentro da Shopee. A compra, o pagamento e a entrega '
     'acontecem lá — a gente só mostra o achado.'),
    ('O preço é esse mesmo?',
     'O preço quem define é a Shopee, e ele muda sem aviso. O que a gente '
     'posta é o valor do dia. Confere sempre na página antes de fechar.'),
    ('E se eu precisar trocar?',
     'Troca, devolução e rastreio são pelo app da Shopee, com o vendedor. '
     'A gente não tem acesso ao seu pedido — mas se você travar em alguma '
     'etapa, manda mensagem que eu te explico o caminho.'),
    ('Vocês ganham com isso?',
     'Ganhamos. Somos afiliados: quando você compra pelo nosso link, a '
     'Shopee nos paga uma comissão. O preço para você é exatamente o '
     'mesmo — por isso dá para indicar sem empurrar.'),
]
for i, (titulo, corpo) in enumerate(CARDS, 1):
    img = Image.new('RGB', (W, H), (15, 23, 42))        # slate-900, do site
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 14], fill=(16, 185, 129))     # faixa esmeralda
    ft = ajustar(titulo, NEGRITO, 92, int(W * 0.82))
    linhas_t = quebrar(titulo, ft, int(W * 0.82))
    fb = fonte(NORMAL, 54)
    linhas_c = quebrar(corpo, fb, int(W * 0.82))
    altura = len(linhas_t) * int(ft.size * 1.2) + 60 + len(linhas_c) * int(fb.size * 1.45)
    y = (H - altura) // 2 - 60
    for l in linhas_t:
        d.text((int(W * 0.09), y), l, font=ft, fill='white')
        y += int(ft.size * 1.2)
    y += 60
    for l in linhas_c:
        d.text((int(W * 0.09), y), l, font=fb, fill=(203, 213, 225))
        y += int(fb.size * 1.45)
    fr = fonte(NEGRITO, 40)
    d.text((int(W * 0.09), H - 190), 'VITRINE CERTA', font=fr, fill=(16, 185, 129))
    nome = f'destaque-duvidas-{i}.jpg'
    img.save(OUT + nome, quality=92)
    feitos.append(nome)
    print(f'duvida {i}: {titulo}')

print()
print('arquivos:', len(feitos))
open(S + 'destaques.txt', 'w', newline='\n').write('\n'.join(feitos) + '\n')
