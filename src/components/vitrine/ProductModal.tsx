'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Product } from '@/data/products'

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Múltiplas imagens - usa imagens adicionais se existirem, senão usa só a principal
  const images = product.images && product.images.length > 0
    ? [product.image, ...product.images]
    : [product.image]

  // Reseta o índice quando abre o modal
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
      document.body.style.overflow = 'hidden' // Bloqueia scroll do body
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBuyClick = () => {
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white hover:bg-slate-100 rounded-full p-2 transition-colors border border-slate-200"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
            {/* Galeria de Imagens - Esquerda */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Imagem Principal */}
              <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Controles do Slide */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-slate-200 hover:bg-slate-50 transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-slate-200 hover:bg-slate-50 transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-slate-900 w-8'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Ir para imagem ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? 'ring-2 ring-slate-900'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Produto - Direita */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Nome */}
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Sobre o produto</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Categoria */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-sm text-slate-600">
                  Categoria: <span className="text-slate-900 font-medium">{product.category}</span>
                </p>
              </div>

              {/* Botão de Compra */}
              <div className="mt-auto">
                <button
                  onClick={handleBuyClick}
                  className="w-full rounded-xl py-4 px-6 font-medium text-slate-900 text-base
                             border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors
                             flex items-center justify-center gap-2"
                >
                  <span>Ver oferta no marketplace</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              {/* Info adicional */}
              <p className="text-xs text-center text-slate-500">
                Ao clicar, o link abre em nova aba no site do vendedor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
