import type { Metadata } from 'next'
import Link from 'next/link'

// Troque pelo e-mail que voce quer publicar como contato.
// Ele fica visivel para qualquer pessoa que abrir esta pagina.
const EMAIL_CONTATO = 'SEU-EMAIL-AQUI'

const ATUALIZADO_EM = '17 de novembro de 2026'

export const metadata: Metadata = {
  title: 'Política de Privacidade · Vitrine Certa',
  description:
    'Como a Vitrine Certa trata os dados de quem comenta, manda mensagem ou navega pela vitrine.',
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{titulo}</h2>
      <div className="space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Política de Privacidade
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Vitrine Certa · atualizada em {ATUALIZADO_EM}
          </p>

          <Secao titulo="Quem somos">
            <p>
              A Vitrine Certa é uma vitrine de produtos que reúne ofertas de marketplaces
              parceiros, principalmente a Shopee. Também mantemos o perfil{' '}
              <strong>@vitrinecertaooficial</strong> no Instagram.
            </p>
            <p>
              Somos afiliados: quando alguém compra por um link nosso, recebemos uma
              comissão do marketplace. Isso não altera o preço para quem compra.
            </p>
          </Secao>

          <Secao titulo="O que coletamos">
            <p>
              <strong>No site.</strong> Não pedimos cadastro, não temos login e não pedimos
              dado pessoal. Você navega e, ao clicar num produto, é levado ao site do
              marketplace, que passa a seguir a política dele.
            </p>
            <p>
              <strong>No Instagram.</strong> Respondemos comentários e mensagens diretas de
              forma automática. Para isso, tratamos o que a própria pessoa nos envia:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>o nome de usuário público de quem escreveu;</li>
              <li>o texto do comentário ou da mensagem;</li>
              <li>o identificador e o horário daquela interação.</li>
            </ul>
            <p>
              Não coletamos CPF, endereço, telefone, e-mail, dado bancário nem dado de
              cartão. Nunca pedimos essas informações, e se alguém as enviar por mensagem,
              não as utilizamos.
            </p>
          </Secao>

          <Secao titulo="Para que usamos">
            <p>
              Só para responder quem entrou em contato: identificar o produto perguntado,
              enviar o link correspondente e manter um registro do atendimento, que nos
              permite conferir o que foi respondido e corrigir erros.
            </p>
            <p>Não vendemos, alugamos nem cedemos esses dados para terceiros.</p>
          </Secao>

          <Secao titulo="Com quem compartilhamos">
            <p>
              Para funcionar, o atendimento automático usa serviços de terceiros, que
              recebem apenas o necessário:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Meta (Instagram).</strong> É de onde a mensagem vem e para onde a
                resposta vai.
              </li>
              <li>
                <strong>Provedor de inteligência artificial.</strong> O texto da pergunta é
                enviado para um modelo de linguagem, que redige a resposta.
              </li>
              <li>
                <strong>Google (Planilhas).</strong> O registro do atendimento fica numa
                planilha privada, acessível apenas por nós.
              </li>
            </ul>
          </Secao>

          <Secao titulo="Por quanto tempo guardamos">
            <p>
              O registro de atendimento é mantido enquanto for útil para acompanhar a
              qualidade das respostas. Você pode pedir a exclusão do seu a qualquer momento.
            </p>
          </Secao>

          <Secao titulo="Seus direitos">
            <p>
              Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para confirmar se
              tratamos algum dado seu, acessá-lo, corrigi-lo ou excluí-lo. Basta pedir pelo
              contato abaixo, e respondemos em até 15 dias.
            </p>
          </Secao>

          <Secao titulo="Compras e suporte">
            <p>
              Não vendemos nada diretamente. A compra, o pagamento, a entrega, a troca e a
              devolução acontecem dentro do marketplace, sob as regras e a política de
              privacidade dele. Não temos acesso aos seus dados de compra.
            </p>
          </Secao>

          <Secao titulo="Contato">
            <p>
              Para qualquer pedido sobre seus dados, escreva para{' '}
              <strong>{EMAIL_CONTATO}</strong>.
            </p>
          </Secao>

          <p className="text-sm text-slate-500 border-t border-slate-200 pt-6">
            Se esta política mudar, a data no topo é atualizada.
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
