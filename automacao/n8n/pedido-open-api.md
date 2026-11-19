# Pedido de acesso à Open API de Afiliados

## Onde achar o ID de Afiliado

É o que o formulário chama de "ID do usuário". Pelo Centro de Ajuda da
própria Shopee, o caminho é:

**Portal do Afiliado → Conta → ícone de Configurações (canto superior
direito) → Configurações da Conta.** O ID aparece **logo abaixo do Nome
de Usuário**, e é só número.

No celular o caminho é o mesmo. Se não aparecer, conta recém-aprovada
pode levar até 48h para o ID surgir no painel — aí o próprio suporte de
afiliados resolve.

---

## A mensagem

Troque as três linhas entre colchetes e envie. Vale tanto para o
formulário de contato da página de Open API quanto para e-mail.

**Assunto:**

```
Solicitação de acesso à Plataforma de Open API de Afiliados
```

**Mensagem:**

```
Olá,

Sou afiliado Shopee e gostaria de solicitar acesso à Plataforma de
Open API de Afiliados, que hoje aparece como indisponível na minha
conta.

ID de Afiliado: [SEU ID]
Telefone cadastrado no programa: [SEU TELEFONE]
E-mail da conta: [SEU E-MAIL]

Divulgo produtos da Shopee no Instagram @vitrinecertaooficial e em uma
vitrine própria na web, com publicações diárias e um catálogo de cerca
de 165 produtos já montado. A operação é automatizada: as publicações
saem em horários programados e as dúvidas de quem comenta ou responde
story são atendidas com o link do produto.

Preciso da API para três coisas, todas dentro da minha própria conta:

1. Gerar os links de afiliado com sub-IDs, para saber de qual
   publicação veio cada clique;
2. Acompanhar o relatório de conversão, para entender quais produtos
   realmente vendem e priorizá-los na programação;
3. Consultar preço, comissão e disponibilidade antes de publicar, para
   não anunciar produto esgotado ou com preço desatualizado.

Hoje faço a conferência de preço e disponibilidade manualmente, item
por item, e sem os sub-IDs não tenho como saber o que converte. O
volume de chamadas seria baixo: uma rotina diária de atualização e as
consultas pontuais antes de cada publicação.

Os dados serão usados apenas na minha própria operação, sem
redistribuição a terceiros.

Fico à disposição para qualquer informação adicional.

Atenciosamente,
[SEU NOME]
```

---

## Quando a resposta chegar

As credenciais entram como variável de ambiente no n8n, no Easypanel:

```
SHOPEE_APP_ID=...
SHOPEE_APP_SECRET=...
```

Cole você mesmo no painel, e cuidado para não levar espaço no fim do
Secret — quebra a assinatura e o erro que volta é só "Invalid
Signature", que não ajuda em nada.

Depois disso é reiniciar o n8n e ligar os fluxos **VC 6** e **VC 7**,
que já estão importados e esperando.
