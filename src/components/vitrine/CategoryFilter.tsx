'use client'

import { Package2 } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  productCounts: Record<string, number>
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts
}: CategoryFilterProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Package2 className="w-5 h-5 text-slate-700 flex-shrink-0" />
        <h2 className="text-lg font-semibold text-slate-900">Categorias</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Botão "Todos" */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            px-4 py-2 rounded-full font-medium text-sm transition-colors
            ${
              selectedCategory === null
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
            }
          `}
        >
          Todos ({productCounts['all'] || 0})
        </button>

        {/* Botões de categorias */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-colors
              ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
              }
            `}
          >
            {category} ({productCounts[category] || 0})
          </button>
        ))}
      </div>
    </div>
  )
}
