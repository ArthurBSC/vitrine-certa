'use client'

import { useState } from 'react'
import { Product } from '@/data/products'
import { ExternalLink } from 'lucide-react'
import ProductModal from './ProductModal'

interface ProductCardProps {
  product: Product
}

function formatSold(n: number): string {
  if (n < 1000) return String(n)
  const mil = n / 1000
  return `+${mil >= 10 ? Math.floor(mil) : (Math.floor(mil * 10) / 10).toString().replace('.', ',')} mil`
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBuyClick = () => {
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
  }

  const handleImageClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md flex flex-col group">
        {/* Imagem do produto */}
        <div
          className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 rounded-full px-2.5 py-1 text-xs font-medium text-slate-700">
          {product.category}
        </div>

        {product.sold ? (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 rounded-full px-2.5 py-1 text-xs font-medium text-white">
            {formatSold(product.sold)} vendidos
          </div>
        ) : null}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Nome do produto */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Botão de compra */}
        <button
          onClick={handleBuyClick}
          className="w-full rounded-xl py-3 px-4 font-medium text-slate-900 text-sm sm:text-base border border-slate-300
                     hover:border-slate-400 hover:bg-slate-50 transition-colors
                     flex items-center justify-center gap-1.5"
        >
          <span>Ver oferta</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>

      {/* Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
