// Enche o canal do Telegram de uma vez, do maior desconto para o menor.
//
// O VC 11 posta quatro por dia, e quatro por dia levaria um mes para o
// canal ter o que mostrar. Quem chega num canal com duas mensagens sai
// na mesma hora - entao a largada vai de uma vez, e dali em diante o
// VC 11 segue sozinho sem repetir o que ja saiu.
//
// Roda dentro do contêiner do n8n, que e onde o token mora:
//   docker exec <n8n> node /midia/dados/encher-canal.js [quantos]

const BASE = process.env.MIDIA_BASE_URL;
const TOKEN = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CANAL = String(process.env.TELEGRAM_CANAL || '').trim();
const ARG = String(process.argv[2] || '25');
// Ou um numero (quantos postar, do maior desconto para o menor), ou
// uma lista de palavras separadas por virgula, para empurrar
// produto escolhido a dedo na frente da fila.
const ESCOLHIDAS = /^[A-Z0-9,]+$/.test(ARG) && /[A-Z]/.test(ARG)
  ? ARG.split(',').map(s => s.trim()).filter(Boolean) : null;
const QUANTOS = ESCOLHIDAS ? ESCOLHIDAS.length : Number(ARG);
const PAUSA = 4000;   // O Telegram corta em ~20 mensagens por minuto: a
                      // 1,6s ele recusou 7 de 30 com "Too Many Requests".
                      // 4s da 15 por minuto e passa inteiro.

if (!TOKEN || !CANAL) {
  console.error('Faltam TELEGRAM_BOT_TOKEN e TELEGRAM_CANAL no ambiente.');
  process.exit(1);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const num = v => {
  const m = String(v ?? '').replace(/\./g, '').match(/(\d+),(\d+)/);
  return m ? parseFloat(m[1] + '.' + m[2]) : 0;
};
const dorme = ms => new Promise(r => setTimeout(r, ms));

async function pegar(arquivo) {
  const r = await fetch(`${BASE}/dados/${arquivo}?v=${Date.now()}`);
  if (!r.ok) return null;
  return r.json();
}

(async () => {
  const pal = await pegar('palavras.json');
  const pre = await pegar('precos.json');
  const ja = (await pegar('telegram-postados.json')) || {};
  const jaForam = new Set(ja.postados || []);

  const vistos = new Map();
  for (const [palavra, v] of Object.entries(pal)) {
    const p = (pre.precos || {})[palavra];
    if (!p || p.situacao !== 'ok' || !p.pix || !v.link) continue;
    if (vistos.has(v.link)) continue;
    const agora = num(p.pix), antes = num(p.antes);
    vistos.set(v.link, {
      palavra, produto: v.produto, link: v.link, pix: p.pix, antes: p.antes,
      desconto: antes > agora ? Math.round((antes - agora) / antes * 100) : 0,
    });
  }

  const fila = ESCOLHIDAS
    ? ESCOLHIDAS.map(p => [...vistos.values()].find(x => x.palavra === p)).filter(Boolean)
    : [...vistos.values()]
        .filter(x => !jaForam.has(x.link))
        .sort((a, b) => b.desconto - a.desconto)
        .slice(0, QUANTOS);

  console.log(`no catálogo: ${vistos.size} | já no canal: ${jaForam.size} | a postar agora: ${fila.length}`);

  const dia = pre.conferido_em || '';
  let ok = 0, falhou = 0;

  for (const x of fila) {
    const linhas = [
      `🔥 <b>${esc(x.produto)}</b>`, '',
      `💰 <b>${esc(x.pix)}</b> no Pix`,
    ];
    if (x.desconto > 0) linhas.push(`<s>${esc(x.antes)}</s>  ·  ${x.desconto}% de desconto`);
    linhas.push('',
      `<i>Preço conferido em ${esc(dia)}. A Shopee muda sem avisar: confirme na página.</i>`, '',
      'A Vitrine Certa recebe uma comissão se você comprar pelo link. Para você não muda nada.');

    const corpo = {
      chat_id: CANAL,
      text: linhas.join('\n'),
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: false, prefer_large_media: true, url: x.link },
      reply_markup: { inline_keyboard: [[{ text: '🛒 Ver na Shopee', url: x.link }]] },
    };

    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    }).then(v => v.json());

    if (r.ok) { ok++; jaForam.add(x.link); }
    else { falhou++; console.log(`  recusou ${x.palavra}: ${r.description}`); }

    console.log(`${String(ok + falhou).padStart(3)}. ${String(x.desconto).padStart(3)}%  ${x.pix.padEnd(22)} ${x.produto.slice(0, 44)}`);
    await dorme(PAUSA);
  }

  const saida = {
    atualizado_em: new Date().toISOString(),
    quantos: jaForam.size,
    postados: [...jaForam],
  };
  require('fs').writeFileSync('/midia/dados/telegram-postados.json',
                              JSON.stringify(saida, null, 1));
  console.log(`\npublicados: ${ok} | recusados: ${falhou} | total no canal: ${jaForam.size}`);
})();
