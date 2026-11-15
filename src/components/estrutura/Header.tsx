'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Search, Clock, ShieldCheck, Tag, Lock } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fecha o menu com tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Previne rolagem de fundo quando menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo e Nome da Marca */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-emerald-500/80 shadow-sm bg-white flex-shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logo-vitrine-certa.png"
                alt="Logo Vitrine Certa"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">Vitrine Certa</h1>
              <p className="text-xs text-slate-500 hidden xs:block">Ofertas selecionadas</p>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#produtos" className="hover:text-emerald-600 transition-colors">Produtos</a>
            <a href="#recentes" className="hover:text-emerald-600 transition-colors">Recentes</a>
            <a href="#rodape" className="hover:text-emerald-600 transition-colors">Sobre</a>
          </nav>

          {/* Ações / Botões */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection('produtos')}
              aria-label="Buscar produtos"
              title="Buscar ofertas"
              className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Botão Hamburguer Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              className={`md:hidden w-9 h-9 rounded-lg border transition-colors flex items-center justify-center ${
                isMenuOpen
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown / Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop escurecido */}
          <div
            className="fixed inset-0 top-[65px] bg-slate-900/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-150"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Conteúdo do Menu */}
          <div className="relative z-50 md:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
              Navegação
            </p>

            <button
              onClick={() => scrollToSection('produtos')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900 font-medium">Produtos & Categorias</div>
                <div className="text-xs text-slate-500">Veja todas as ofertas disponíveis</div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('recentes')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900 font-medium">Recentes</div>
                <div className="text-xs text-slate-500">Últimas adições à vitrine</div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('rodape')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900 font-medium">Sobre a Vitrine</div>
                <div className="text-xs text-slate-500">Informações e termos de afiliados</div>
              </div>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <a
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-800 font-medium">Área Administrativa</div>
                  <div className="text-xs text-slate-400">Gerenciar produtos e links</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
