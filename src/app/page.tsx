'use client'

import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import Header from '@/components/estrutura/Header'
import Footer from '@/components/estrutura/Footer'
import ProductCard from '@/components/vitrine/ProductCard'
import CategoryFilter from '@/components/vitrine/CategoryFilter'
import { products } from '@/data/products'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Extrai categorias únicas
  const categories = useMemo(() => {
    // Categorias que mais vendem aparecem primeiro
    const totals: Record<string, number> = {}
    products.forEach(p => {
      totals[p.category] = (totals[p.category] || 0) + (p.sold || 0)
    })
    return Object.keys(totals).sort((a, b) => totals[b] - totals[a] || a.localeCompare(b))
  }, [])

  // Conta produtos por categoria
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  // Filtra produtos por categoria
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(p => p.category === selectedCategory)
  }, [selectedCategory])

  // Produtos recentes (últimos 8)
  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">Ofertas selecionadas para voce</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Navegue por categorias e abra as ofertas diretamente no marketplace.
            </p>
          </section>

          {products.length === 0 ? (
            // Mensagem quando não há produtos
            <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto mt-8">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Nenhum produto cadastrado
              </h2>
              <p className="text-slate-600 mb-6">
                Adicione produtos editando o arquivo{' '}
                <code className="glass rounded-lg px-2 py-1 text-slate-900">
                  src/data/products.ts
                </code>
              </p>
            </div>
          ) : (
            <>
              {/* Filtro de Categorias */}
              {categories.length > 0 && (
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  productCounts={productCounts}
                />
              )}

              {/* Grid de Produtos Filtrados ou Todos */}
              <section id="produtos" className="mb-12">
                {!selectedCategory && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Destaques da semana</h3>
                    <p className="text-sm text-slate-600">Os produtos mais vendidos e mais bem avaliados da Shopee.</p>
                  </div>
                )}
                {selectedCategory && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Categoria: <span className="text-slate-700">{selectedCategory}</span>
                    </h3>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      Nenhum produto encontrado nesta categoria
                    </p>
                  </div>
                )}
              </section>

              {/* Produtos Recentes */}
              {recentProducts.length > 0 && !selectedCategory && products.length > 8 && (
                <section id="recentes">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Adicionados recentemente</h2>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {recentProducts.map((product) => (
                      <ProductCard key={`recent-${product.id}`} product={product} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
