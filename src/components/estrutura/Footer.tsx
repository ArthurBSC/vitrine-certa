import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="rodape" className="w-full mt-12 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/80 bg-white">
              <img
                src="/logo-vitrine-certa.png"
                alt="Logo Vitrine Certa"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Vitrine Certa</h3>
              <p className="text-xs text-slate-500">Selecao independente de ofertas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <p>Links de afiliado podem gerar comissao sem custo extra.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>© {new Date().getFullYear()} Vitrine Certa</p>
          <p>Politica de Privacidade • Termos e Condicoes</p>
        </div>
      </div>
    </footer>
  )
}
