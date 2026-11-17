import type { Metadata } from 'next'
import Link from 'next/link'

// Mesmo endereco publicado na Politica de Privacidade.
const EMAIL_CONTATO = 'vitrinecertaooficial@gmail.com'

const ATUALIZADO_EM = '17 de novembro de 2026'

export const metadata: Metadata = {
  title: 'Termos e Condições · Vitrine Certa',
  description:
    'As regras de uso da Vitrine Certa: o que fazemos, o que não fazemos e de quem é a responsabilidade por cada parte da compra.',
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{titulo}</h2>
      <div className="space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

export default function Termos() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Termos e Condições
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Vitrine Certa · atualizados em {ATUALIZADO_EM}
          </p>

          <Secao titulo="O que a Vitrine Certa é">
            <p>
              A Vitrine Certa é uma <strong>vitrine de indicações</strong>. Reunimos
              produtos de marketplaces parceiros, principalmente a Shopee, e
              organizamos por categoria para facilitar a escolha. Também mantemos o
              perfil <strong>@vitrinecertaooficial</strong> no Instagram.
            </p>
            <p>
              Ao usar o site ou falar com a gente no Instagram, você concorda com o
              que está escrito aqui.
            </p>
          </Secao>

          <Secao titulo="Não vendemos nada">
            <p>
              Este é o ponto mais importante: <strong>a Vitrine Certa não vende, não
              estoca, não embala e não entrega produto nenhum</strong>. Ao clicar num
              item, você é levado para o site do marketplace, e é lá que tudo
              acontece — o pedido, o pagamento, o prazo, o frete, a troca, a
              devolução e o atendimento pós-venda.
            </p>
            <p>
              Quem vende é o lojista do marketplace, sob as regras e a política de
              privacidade dele. Não temos acesso ao seu pedido nem poder para
              alterá-lo, cancelá-lo ou reembolsá-lo.
            </p>
          </Secao>

          <Secao titulo="Somos afiliados, e isso fica claro">
            <p>
              Quando alguém compra por um link nosso, recebemos uma comissão do
              marketplace. <strong>Isso não altera o preço para quem compra</strong> —
              você paga o mesmo que pagaria entrando direto na loja.
            </p>
            <p>
              É assim que a vitrine se mantém, e por isso nossos posts são marcados
              como publicidade.
            </p>
          </Secao>

          <Secao titulo="Preço, estoque e disponibilidade">
            <p>
              Preço, promoção, cupom e estoque são definidos pelo marketplace e mudam
              sem aviso. Qualquer valor citado por nós, num post ou numa resposta, é
              apenas uma referência do momento em que foi escrito.
            </p>
            <p>
              <strong>Vale sempre o que estiver na página do produto</strong> no
              momento da sua compra. Confira antes de finalizar.
            </p>
          </Secao>

          <Secao titulo="O atendimento automático do Instagram">
            <p>
              Comentários e mensagens diretas no nosso perfil podem ser respondidos
              por um assistente automático, que identifica o produto e envia o link
              correspondente.
            </p>
            <p>
              Ele pode errar, demorar ou não entender a pergunta. As respostas têm
              caráter informativo e não criam obrigação de venda, de preço ou de
              prazo. Nunca pedimos CPF, endereço, telefone, dado bancário ou dado de
              cartão — se receber um pedido desses em nome da Vitrine Certa,
              desconfie e nos avise.
            </p>
            <p>
              O tratamento dos dados dessas conversas está descrito na{' '}
              <Link href="/privacidade" className="underline hover:text-slate-900">
                Política de Privacidade
              </Link>
              .
            </p>
          </Secao>

          <Secao titulo="Uso do site">
            <p>
              O site é de uso livre e gratuito, sem cadastro. Pedimos apenas que não
              seja usado para raspagem automatizada em massa, nem para qualquer
              finalidade ilícita ou que prejudique o funcionamento do serviço.
            </p>
            <p>
              Textos, seleção e organização da vitrine são nossos. Imagens e nomes de
              produtos pertencem aos respectivos lojistas e marcas.
            </p>
          </Secao>

          <Secao titulo="Limitação de responsabilidade">
            <p>
              Fazemos a curadoria com cuidado, mas não garantimos qualidade,
              durabilidade, autenticidade ou adequação de nenhum produto, porque não
              somos nós que os fabricamos nem os vendemos.
            </p>
            <p>
              Problemas com o produto ou com a entrega devem ser tratados diretamente
              com o vendedor e com o marketplace, que são quem tem os meios de
              resolver.
            </p>
          </Secao>

          <Secao titulo="Mudanças">
            <p>
              Estes termos podem mudar a qualquer momento, e a data no topo é
              atualizada quando isso acontece. Continuar usando o site depois de uma
              mudança significa concordar com a versão nova.
            </p>
          </Secao>

          <Secao titulo="Contato">
            <p>
              Dúvida sobre estes termos? Escreva para{' '}
              <strong>{EMAIL_CONTATO}</strong>.
            </p>
          </Secao>

          <p className="text-sm text-slate-500 border-t border-slate-200 pt-6">
            Estes termos são regidos pela lei brasileira.
          </p>

          <div className="mt-8">
            <Link href="/" className="text-sm text-slate-600 underline hover:text-slate-900">
              ← Voltar para a vitrine
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
