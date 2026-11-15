'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ArrowLeft,
  Lock,
  ExternalLink,
  Package,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  FolderOpen
} from 'lucide-react'
import { Product } from '@/data/products'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    affiliateLink: '',
    category: ''
  })

  // Categorias sugeridas
  const suggestedCategories = [
    'Cozinha',
    'Quarto',
    'Sala',
    'Banheiro',
    'Eletrônicos',
    'Moda',
    'Beleza',
    'Esportes',
    'Pet Shop',
    'Decoração',
    'Ferramentas',
    'Bebês'
  ]

  // Verifica autenticação
  useEffect(() => {
    checkAuth()
  }, [])

  // Carrega produtos quando autenticado
  useEffect(() => {
    if (authenticated) {
      loadProducts()
    }
  }, [authenticated])

  // Limpa mensagens temporárias após 4 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      setAuthenticated(data.authenticated)
    } catch {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })

      const data = await res.json()

      if (data.success) {
        setAuthenticated(true)
        setPin('')
      } else {
        setError(data.error || 'PIN inválido')
        if (data.remainingAttempts !== undefined) {
          setError(`${data.error}. Tentativas restantes: ${data.remainingAttempts}`)
        }
      }
    } catch {
      setError('Erro ao fazer login no servidor')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthenticated(false)
      setProducts([])
      setEditingProduct(null)
      setIsNewProduct(false)
    } catch {
      setError('Erro ao fazer logout')
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch {
      setError('Erro ao carregar lista de produtos')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsNewProduct(false)
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      affiliateLink: product.affiliateLink,
      category: product.category
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNew = () => {
    setEditingProduct(null)
    setIsNewProduct(true)
    setFormData({
      name: '',
      description: '',
      image: '',
      affiliateLink: '',
      category: ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setIsNewProduct(false)
    setFormData({
      name: '',
      description: '',
      image: '',
      affiliateLink: '',
      category: ''
    })
    setError('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      let res

      if (isNewProduct) {
        // Criar novo produto
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            images: []
          })
        })
      } else {
        // Atualizar produto existente
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct?.id,
            ...formData,
            images: editingProduct?.images || [],
            createdAt: editingProduct?.createdAt || new Date().toISOString()
          })
        })
      }

      const data = await res.json()

      if (data.success) {
        setSuccessMessage(isNewProduct ? 'Produto adicionado com sucesso!' : 'Produto atualizado com sucesso!')
        await loadProducts()
        handleCancel()
      } else {
        setError(data.error || 'Erro ao salvar produto')
      }
    } catch {
      setError('Erro ao conectar com a API para salvar produto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        setSuccessMessage('Produto removido com sucesso!')
        await loadProducts()
      } else {
        setError(data.error || 'Erro ao deletar produto')
      }
    } catch {
      setError('Erro ao deletar produto')
    }
  }

  // Estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Verificando credenciais...</p>
        </div>
      </div>
    )
  }

  // Tela de Login (não autenticado)
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
        {/* Cabeçalho da Marca */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/80 shadow-sm bg-white flex-shrink-0">
            <img
              src="/logo-vitrine-certa.png"
              alt="Logo Vitrine Certa"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Vitrine Certa</h1>
            <p className="text-xs text-slate-500">Painel Administrativo</p>
          </div>
        </div>

        {/* Card de Login */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Acesso Restrito</h2>
            <p className="text-sm text-slate-500 mt-1">
              Digite seu PIN de 8 dígitos para gerenciar produtos
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                PIN de Segurança
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 text-center text-2xl tracking-widest font-mono placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
                maxLength={8}
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-xl p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 px-4 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Entrar no Painel
            </button>

            <a
              href="/"
              className="w-full rounded-xl py-2.5 px-4 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Vitrine
            </a>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <p className="font-medium text-slate-700 mb-2">Proteção ativa:</p>
            <ul className="space-y-1 text-slate-500">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Limite de tentativas contra força bruta
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Proteção contra timing attacks
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Sessão criptografada via JWT
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Autenticado
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Barra Superior / Header do Admin */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/80 shadow-sm bg-white flex-shrink-0">
                <img
                  src="/logo-vitrine-certa.png"
                  alt="Logo Vitrine Certa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Painel Administrativo
                  </h1>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    Ativo
                  </span>
                </div>
                <p className="text-xs text-slate-500">Vitrine Certa • Gerenciamento de Produtos</p>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-2 text-xs sm:text-sm font-medium transition-colors"
                title="Abrir o site da vitrine em nova aba"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Ver Vitrine</span>
              </a>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors"
                title="Encerrar sessão administrativa"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mensagens de Sucesso e Erro */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Formulário de Criação / Edição */}
        {(editingProduct || isNewProduct) && (
          <section className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  {isNewProduct ? <Plus className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {isNewProduct ? 'Cadastrar Novo Produto' : 'Editar Produto'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Preencha os dados e o link de afiliado da Shopee
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Nome do Produto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nome do Produto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="Ex: Fritadeira Sem Óleo Air Fryer 4L"
                  required
                  maxLength={100}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descrição Resumida <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-colors"
                  placeholder="Ex: Potência de 1500W, cesto antiaderente removível e timer de 60 minutos."
                  rows={3}
                  required
                  maxLength={200}
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {formData.description.length}/200 caracteres
                </p>
              </div>

              {/* URL da Imagem */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL da Imagem do Produto <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-grow">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      placeholder="https://cf.shopee.com.br/file/..."
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Dica: Clique com botão direito na imagem do anúncio da Shopee → &quot;Copiar endereço da imagem&quot;.
                    </p>
                  </div>

                  {/* Pré-visualização da imagem */}
                  {formData.image && (
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={formData.image}
                        alt="Prévia"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/logo-vitrine-certa.png'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Link de Afiliado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Link de Afiliado (Shopee) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="https://shope.ee/..."
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Categoria <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  placeholder="Digite ou escolha uma sugestão abaixo"
                  required
                  list="category-suggestions"
                  maxLength={50}
                />
                <datalist id="category-suggestions">
                  {suggestedCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>

                <div className="mt-2.5">
                  <p className="text-xs text-slate-500 mb-1.5">Sugestões rápidas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
                          formData.category === cat
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botões do Formulário */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isNewProduct ? 'Salvar Novo Produto' : 'Salvar Alterações'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium py-2.5 px-6 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Barra de Ação e Estatísticas */}
        {!editingProduct && !isNewProduct && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Catálogo de Ofertas
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNew}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 shadow-sm transition-colors text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Produto</span>
              </button>
            </div>

            {/* Listagem de Produtos */}
            {products.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Nenhum produto cadastrado
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Adicione seu primeiro produto para que ele apareça na vitrine principal.
                </p>
                <button
                  onClick={handleNew}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 shadow-sm transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Primeiro Produto</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs hover:border-slate-300 transition-all"
                  >
                    {/* Imagem + Infos */}
                    <div className="flex gap-4 items-start sm:items-center min-w-0">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/logo-vitrine-certa.png'
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                          <span>Ver link de afiliado</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex sm:flex-col gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-300 px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Deletar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
