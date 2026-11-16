import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

// ============================================================
// GET /api/catalogo?q=projetor&limit=3
// Catálogo público, somente leitura. Usado pelas automações do
// n8n (atendimento por IA e gerador de legendas) para nunca
// inventar nome, categoria ou link de afiliado.
// ============================================================

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const IGNORAR = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'o', 'a', 'os', 'as', 'para', 'com',
  'em', 'um', 'uma', 'no', 'na', 'por', 'que', 'mp4', 'mov', 'jpg', 'jpeg',
  'png', 'feed', 'story', 'reels', 'video', 'foto',
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const limite = Math.min(Math.max(parseInt(searchParams.get('limit') || '5', 10) || 5, 1), 30)

    const products = await getProducts()

    const simples = products.map((p) => ({
      nome: p.name,
      categoria: p.category,
      descricao: p.description,
      vendidos: p.sold ?? null,
      link: p.affiliateLink,
      busca: normalizar(`${p.name} ${p.category} ${p.description}`),
    }))

    const termos = normalizar(q).split(' ').filter((t) => t.length > 2 && !IGNORAR.has(t))

    // Sem busca: devolve os primeiros da vitrine (que já estão em ordem de prioridade)
    if (termos.length === 0) {
      return NextResponse.json({
        total: products.length,
        produtos: simples.slice(0, limite).map((p) => ({
          nome: p.nome,
          categoria: p.categoria,
          descricao: p.descricao,
          vendidos: p.vendidos,
          link: p.link,
        })),
      })
    }

    const pontuados = simples
      .map((p) => {
        let pontos = 0
        for (const t of termos) {
          if (p.busca.includes(t)) pontos += 10
          else if (t.length > 4 && p.busca.includes(t.slice(0, -1))) pontos += 6
        }
        // Empate: quem vendeu mais na frente
        return { p, pontos: pontos + Math.min((p.vendidos ?? 0) / 100000, 1) }
      })
      .filter((x) => x.pontos >= 6)
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, limite)

    return NextResponse.json({
      total: pontuados.length,
      busca: termos.join(' '),
      produtos: pontuados.map(({ p }) => ({
        nome: p.nome,
        categoria: p.categoria,
        descricao: p.descricao,
        vendidos: p.vendidos,
        link: p.link,
      })),
    })
  } catch (error) {
    console.error('Erro no catálogo:', error)
    return NextResponse.json({ error: 'Erro ao ler o catálogo' }, { status: 500 })
  }
}
