// ============================================
// ARQUIVO DE CONFIGURAÇÃO DOS PRODUTOS
// ============================================
// INSTRUÇÕES:
// 1. Copie um produto existente
// 2. Cole no final da lista
// 3. Edite as informações:
//    - id: número único e sequencial
//    - name: nome do produto (curto e direto)
//    - description: descrição curta que vende
//    - image: URL da imagem da Shopee (clique com botão direito > copiar endereço da imagem)
//    - images: [OPCIONAL] Array com 3-5 URLs de imagens adicionais para galeria do produto
//    - affiliateLink: seu link de afiliado da Shopee
//    - category: escolha uma categoria (Cozinha, Quarto, Sala, Banheiro, Eletrônicos, Moda, Beleza, etc)
//               ou crie uma nova digitando o nome
//    - createdAt: data de criação (gerada automaticamente)
// 4. Salve o arquivo
// 5. O site atualiza automaticamente
// ============================================

export interface Product {
  id: number
  name: string
  description: string
  image: string
  images?: string[] // OPCIONAL: Array com 3-5 imagens adicionais para a galeria
  affiliateLink: string
  category: string
  sold?: number // OPCIONAL: unidades vendidas segundo o ranking da Shopee
  createdAt: string
}

export const products: Product[] = [
  {
    "id": 1,
    "name": "Dispenser De Gelo Bandeja Caixa 48 Cubos Com Gaveta Botão Solta Gelo E Pegador Luxo",
    "description": "Transforme a maneira como você faz gelo com esta forma de gelo automática inovadora! Compacta e funcional, ela é perfeita para quem busca praticidade e estilo na cozinha.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m32fcmqrnwg5af.webp",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m32fcmqrnwg5af.webp",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m32fcmqrnwg5af.webp"
    ],
    "affiliateLink": "https://s.shopee.com.br/60KspWCuJ0",
    "category": "Cozinha",
    "createdAt": "2025-12-26T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Parafusadeira e Furadeira de Impacto Reversível PFV 238I Vonder com 2 Bateria 20v e Maleta Broca",
    "description": "Campeão de vendas da Shopee em Furadeira e Parafusadeira. Nota 4,9 de 5 em 8,2 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-81zum-mn1seqg2n18ld4",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-81zum-mn1seqg2n18ld4",
      "https://down-br.img.susercontent.com/file/sg-11134201-81zth-mn1sesjr3ncy53",
      "https://down-br.img.susercontent.com/file/sg-11134201-81zv5-mn1seusutaf543",
      "https://down-br.img.susercontent.com/file/sg-11134201-81zux-mn1sex30errcd0"
    ],
    "affiliateLink": "https://s.shopee.com.br/1BxvHR6N1",
    "category": "Ferramentas",
    "sold": 8202,
    "createdAt": "2026-11-15T03:51:05.859Z"
  },
  {
    "id": 3,
    "name": "Projetor HY300 Magcubic 4K HD WiFi Bluetooth Até 150 Polegadas Bivolt Celular TV Box Xbox PS5 PC",
    "description": "Campeão de vendas da Shopee em Mini projetor portátil. Nota 4,8 de 5 em 55 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-8262d-ml8361lz5mh0b7",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-8262d-ml8361lz5mh0b7",
      "https://down-br.img.susercontent.com/file/sg-11134201-8260h-ml83635jmp6p46",
      "https://down-br.img.susercontent.com/file/sg-11134201-825zw-ml8364wb6scla2",
      "https://down-br.img.susercontent.com/file/sg-11134201-82610-ml8366fk6z9h18"
    ],
    "affiliateLink": "https://s.shopee.com.br/1BNvJQMf0G",
    "category": "Eletrônicos",
    "sold": 9441,
    "createdAt": "2026-11-15T03:50:05.859Z"
  },
  {
    "id": 4,
    "name": "Kit 10 Marmita Potes 800ml com Travas Laterais BPA FREE - Alimentos organizadores de congelador",
    "description": "Campeão de vendas da Shopee em Marmita. Nota 4,6 de 5 em 91 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8z01lbiwfluba",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8z01lbiwfluba",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3yzmphg5mwx9d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-margy2fthmrz29",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-margy2ftetn3f8"
    ],
    "affiliateLink": "https://s.shopee.com.br/114V77NILF",
    "category": "Cozinha",
    "sold": 21718,
    "createdAt": "2026-11-15T03:49:05.859Z"
  },
  {
    "id": 5,
    "name": "Massageador Elétrico Alta Frequência Profissional Muscular Massagem",
    "description": "Campeão de vendas da Shopee em Massageadores. Nota 4,9 de 5 em 32 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rbn0-loeo7ca14v99a4",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rbn0-loeo7ca14v99a4",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rbkz-loeo7e4cftq597",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rbmc-loeo7fx9stkx0a",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rbmb-loeo7i3snbm258"
    ],
    "affiliateLink": "https://s.shopee.com.br/ql4uoNvgE",
    "category": "Beleza",
    "sold": 4644,
    "createdAt": "2026-11-15T03:48:05.859Z"
  },
  {
    "id": 6,
    "name": "ROMANTIC CROWN Meia-Calça Térmica Forrada Peluciada Translúcida De Lã Quente Feminina Para Inverno",
    "description": "Campeão de vendas da Shopee em Meia-Calça Térmica. Nota 4,9 de 5 em 127 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvzh39z154za59",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvzh39z154za59",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvvekuo6s3at60",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvvekuo6xpkld9",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvvekuo6uwfp90"
    ],
    "affiliateLink": "https://s.shopee.com.br/gReiVOZ1D",
    "category": "Moda Feminina",
    "sold": 44989,
    "createdAt": "2026-11-15T03:47:05.859Z"
  },
  {
    "id": 7,
    "name": "Jogo de Lençol 400 Fios Extra Macio c/ Fronhas Ponto Palito Berço Solteiro Casal Queen King 02 e 03",
    "description": "Campeão de vendas da Shopee em Jogo de Cama. Nota 4,8 de 5 em 450 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6peqntiscvk4c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6peqntiscvk4c",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m83k68e8nwup61",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m9q0527m8w8pe7",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6peqnts2o9zfc"
    ],
    "affiliateLink": "https://s.shopee.com.br/7fbP3QwA6z",
    "category": "Quarto",
    "sold": 55551,
    "createdAt": "2026-11-15T03:46:05.859Z"
  },
  {
    "id": 8,
    "name": "Jogo de Lençol 400 Fios Micropercal Com Fronha em Ponto Palito",
    "description": "Campeão de vendas da Shopee em Jogo de Lençol. Nota 4,9 de 5 em 751 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820m5-mo7pypmcmww19c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820m5-mo7pypmcmww19c",
      "https://down-br.img.susercontent.com/file/br-11134207-820m2-mo7pypmcliblf9",
      "https://down-br.img.susercontent.com/file/br-11134207-820la-mo7pypmcobgh48",
      "https://down-br.img.susercontent.com/file/br-11134207-820ln-mo7pypmctxq9cb"
    ],
    "affiliateLink": "https://s.shopee.com.br/7VHyr7wnRy",
    "category": "Quarto",
    "sold": 50516,
    "createdAt": "2026-11-15T03:45:05.859Z"
  },
  {
    "id": 9,
    "name": "Varal De Chão Roupa Calcinha Grade 3 Andares Dobrável Portátil",
    "description": "Campeão de vendas da Shopee em Varal Retrátil. Nota 4,9 de 5 em 119 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7augbm6ixf693",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7augbm6ixf693",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdao2vb777eae1",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdarhuorrgg19a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdao2vb78lyqa8"
    ],
    "affiliateLink": "https://s.shopee.com.br/7KyYeoxQmx",
    "category": "Casa e Limpeza",
    "sold": 9311,
    "createdAt": "2026-11-15T03:44:05.859Z"
  },
  {
    "id": 10,
    "name": "Calça pantalona de lazinho feminina cintura alta com bolso pra inverno",
    "description": "Campeão de vendas da Shopee em Pantalona. Nota 4,7 de 5 em 67 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rd53-lwq8ehdnne7maa",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd53-lwq8ehdnne7maa",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd60-lwq8eiayao93eb",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd51-lwq8ejylvcza0d",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd5c-lwq8el0cc5erf8"
    ],
    "affiliateLink": "https://s.shopee.com.br/7Af8SVy47w",
    "category": "Moda Feminina",
    "sold": 23592,
    "createdAt": "2026-11-15T03:43:05.859Z"
  },
  {
    "id": 11,
    "name": "Kit 10 Cuecas Boxer Domen Microfibra Adulto + 12 Pares Meias Soquete ou Cano longo Algodão Premium",
    "description": "Campeão de vendas da Shopee em Kit Cuecas. Nota 4,8 de 5 em 47 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820m7-mv4rtp9xm0ara5",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820m7-mv4rtp9xm0ara5",
      "https://down-br.img.susercontent.com/file/br-11134207-820ly-mv4pnzibaps33d",
      "https://down-br.img.susercontent.com/file/br-11134207-820mb-mv4roynd6z2bef",
      "https://down-br.img.susercontent.com/file/br-11134207-820lz-mv4roynd45xfdd"
    ],
    "affiliateLink": "https://s.shopee.com.br/70LiGCyhSv",
    "category": "Moda Masculina",
    "sold": 8257,
    "createdAt": "2026-11-15T03:42:05.859Z"
  },
  {
    "id": 12,
    "name": "Kit 3 Calça Moletom Masculina Com Punho E Elastico Muito Confortavel",
    "description": "Campeão de vendas da Shopee em Calças e Bermudas Masculinas. Nota 4,5 de 5 em 20 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ly1nnmc033y78d",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ly1nnmc033y78d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ly1nnmc05wtyde",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ly1nnmc0ik7328",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ly1nnmc033wycb"
    ],
    "affiliateLink": "https://s.shopee.com.br/8Kr5qfBI9R",
    "category": "Moda Masculina",
    "sold": 5463,
    "createdAt": "2026-11-15T03:41:05.859Z"
  },
  {
    "id": 13,
    "name": "Travesseiros Pluma de Ganso Premium 70x50cm Antialérgico Macio Alto Luxo Hotel Toque Suave",
    "description": "Campeão de vendas da Shopee em Travesseiros. Nota 4,7 de 5 em 112 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820li-mprzb78qhcle8e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820li-mprzb78qhcle8e",
      "https://down-br.img.susercontent.com/file/br-11134207-820l7-mprzb78udtdv1c",
      "https://down-br.img.susercontent.com/file/br-11134207-820lj-mprzb78uf7ybbb",
      "https://down-br.img.susercontent.com/file/br-11134207-820m7-mprzb78ugmira2"
    ],
    "affiliateLink": "https://s.shopee.com.br/8AXfeMBvUQ",
    "category": "Quarto",
    "sold": 15134,
    "createdAt": "2026-11-15T03:40:05.859Z"
  },
  {
    "id": 14,
    "name": "Capa Para Colchão Impermeavel Matelado Com Elastico",
    "description": "Campeão de vendas da Shopee em Capa Protetora. Nota 4,5 de 5 em 393 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltwjwwwq5uudff",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltwjwwwq5uudff",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltwjwwwq5v1c0a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltwjwwwq5uvo6f",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltwjwwwq79lsb7"
    ],
    "affiliateLink": "https://s.shopee.com.br/80EFS3CYpP",
    "category": "Quarto",
    "sold": 37440,
    "createdAt": "2026-11-15T03:39:05.859Z"
  },
  {
    "id": 15,
    "name": "Escova Secadora Alisador Elétrica Quente Cabelo Com 3 Em1 Hair Styler 110V",
    "description": "Campeão de vendas da Shopee em Escova secadora. Nota 4,6 de 5 em 140 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/0717fe00f09a2ef32de0e47501845889",
    "images": [
      "https://down-br.img.susercontent.com/file/0717fe00f09a2ef32de0e47501845889",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lqnsfntb3air6f",
      "https://down-br.img.susercontent.com/file/c244833db3dbe184a0e49acbf9653a30",
      "https://down-br.img.susercontent.com/file/3583a488608d082ef11d15e4c6618527"
    ],
    "affiliateLink": "https://s.shopee.com.br/9AQCqC87Se",
    "category": "Beleza",
    "sold": 12539,
    "createdAt": "2026-11-15T03:38:05.859Z"
  },
  {
    "id": 16,
    "name": "Kit 15,12 ou 6 Pares de Meias Cano Alto/Médio Algodão Unissex 36-42",
    "description": "Campeão de vendas da Shopee em Meias. Nota 4,8 de 5 em 196 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lo-mr69e0bzivpif9",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lo-mr69e0bzivpif9",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mh7yjm0i6f4435",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mh7yjm0i27es30",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mh7n1q73kqv8f5"
    ],
    "affiliateLink": "https://s.shopee.com.br/906mdt8knd",
    "category": "Moda Masculina",
    "sold": 26260,
    "createdAt": "2026-11-15T03:37:05.859Z"
  },
  {
    "id": 17,
    "name": "ROMANTIC CROWN Mochila de Viagem Expansível, Bolsa Executiva Notebook Masculina e Feminina",
    "description": "Campeão de vendas da Shopee em Mochila Universitária. Nota 5,0 de 5 em 54 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820la-mu7g0m7pk9vl21",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820la-mu7g0m7pk9vl21",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m20a86un1cys55",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m20a86un8dt0f9",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1w7amozoy4x92"
    ],
    "affiliateLink": "https://s.shopee.com.br/9pftdQMlgH",
    "category": "Papelaria e Mochilas",
    "sold": 4870,
    "createdAt": "2026-11-15T03:36:05.859Z"
  },
  {
    "id": 18,
    "name": "Kit 10 Toalhas Umedecidas Turminha da Bagunça 120 Folhas C/ Tampa 98% Água Lenço Umedecido",
    "description": "Campeão de vendas da Shopee em Lenços Umedecidos. Nota 4,9 de 5 em 61 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lw-mlpaco7am41x1f",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lw-mlpaco7am41x1f",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjyjocfabr43d2",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjspb0s7gr297f",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjspb0s76x35ff"
    ],
    "affiliateLink": "https://s.shopee.com.br/9Kjd2VOfhC",
    "category": "Infantil",
    "sold": 6761,
    "createdAt": "2026-11-15T03:35:05.859Z"
  },
  {
    "id": 19,
    "name": "Jogo De Lençol 400 Fios Com Elástico Tecido Liso Apronta Entrega Luxo",
    "description": "Campeão de vendas da Shopee em Artigos para Cama. Nota 4,6 de 5 em 40 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lg-mtnwbanjmeww49",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lg-mtnwbanjmeww49",
      "https://down-br.img.susercontent.com/file/br-11134207-820me-mtnwbanjgsn416",
      "https://down-br.img.susercontent.com/file/br-11134207-820ll-mtnwbanjnthc57",
      "https://down-br.img.susercontent.com/file/br-11134207-820m9-mtnwbanji77kab"
    ],
    "affiliateLink": "https://s.shopee.com.br/9V33EoO2MF",
    "category": "Quarto",
    "sold": 13525,
    "createdAt": "2026-11-15T03:34:05.859Z"
  },
  {
    "id": 20,
    "name": "Kit C/ 2 Sutiãs Básicos Reforçados Microfibra com Bojo - Lingerie Direto da Fábrica Tamanhos PP ao",
    "description": "Campeão de vendas da Shopee em Lingerie. Nota 4,8 de 5 em 134 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mdyzrzcnte6ba2",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mdyzrzcnte6ba2",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mc6zvqhyacw569",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mdyzrzcp0xs203",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mgxr8b1ldbeve8"
    ],
    "affiliateLink": "https://s.shopee.com.br/AKcAELKrfQ",
    "category": "Moda Feminina",
    "sold": 15749,
    "createdAt": "2026-11-15T03:33:05.859Z"
  },
  {
    "id": 21,
    "name": "40 Peças / 46 Peças Jogo De Chave Catraca Caixa De Ferramentas para Reparo de Carros / Conjuntos de",
    "description": "Campeão de vendas da Shopee em Kit de Ferramentas. Nota 4,8 de 5 em 218 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l9-mqt86n8incape7",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l9-mqt86n8incape7",
      "https://down-br.img.susercontent.com/file/br-11134207-820lb-mr61n2k5fpja63",
      "https://down-br.img.susercontent.com/file/br-11134207-820ly-mr61n2k5h43q81",
      "https://down-br.img.susercontent.com/file/br-11134207-820lv-mr61n2k5eayu21"
    ],
    "affiliateLink": "https://s.shopee.com.br/AUvaQeKEKT",
    "category": "Ferramentas",
    "sold": 15010,
    "createdAt": "2026-11-15T03:32:05.859Z"
  },
  {
    "id": 22,
    "name": "Mesa de Cabeceira Retrô Compacta com Nicho para Quarto Sala Casal ou Solteiro Palma",
    "description": "Campeão de vendas da Shopee em Cabeceiras e Decoração. Nota 4,8 de 5 em 317 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rd6x-luv5vclgwaxb45",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd6x-luv5vclgwaxb45",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd66-luv5vk0e1oxp53",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd72-luv5vm94rjbn91",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7i0w8b1kv5eb9"
    ],
    "affiliateLink": "https://s.shopee.com.br/9Kjd2aEGUI",
    "category": "Quarto",
    "sold": 14485,
    "createdAt": "2026-11-15T03:31:05.859Z"
  },
  {
    "id": 23,
    "name": "Tapete Sala 2,00x1,50 Peludo 4 Cm De Altura Shaggy Promoção",
    "description": "Campeão de vendas da Shopee em Tapete Peludo. Nota 4,8 de 5 em 84 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820me-mly2l74vy39cce",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820me-mly2l74vy39cce",
      "https://down-br.img.susercontent.com/file/br-11134207-820l5-mly3wb7nad50b2",
      "https://down-br.img.susercontent.com/file/br-11134201-820l4-mqzvz3edxm9w89",
      "https://down-br.img.susercontent.com/file/br-11134207-820m4-mly3wb7n8ykka7"
    ],
    "affiliateLink": "https://s.shopee.com.br/9V33EtDd9L",
    "category": "Sala",
    "sold": 6990,
    "createdAt": "2026-11-15T03:30:05.859Z"
  },
  {
    "id": 24,
    "name": "Cortina Voil Gaze De Linho 3,00 x 2,20/2,30/2,40/2,50/2,60/2,70/2,80 C/forro Blackout Grosso",
    "description": "Campeão de vendas da Shopee em Cortina Blackout. Nota 4,9 de 5 em 23 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l7-mtqni748srupa7",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l7-mtqni748srupa7"
    ],
    "affiliateLink": "https://s.shopee.com.br/906mdyFXAG",
    "category": "Quarto",
    "sold": 1736,
    "createdAt": "2026-11-15T03:29:05.859Z"
  },
  {
    "id": 25,
    "name": "Tênis Meia Feminino Calce Fácil Botinha Ortopédico Esportivo Sneaker Slip On Casual confortável",
    "description": "Campeão de vendas da Shopee em Tênis Feminino. Nota 4,7 de 5 em 223 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820ma-mnx8czipq39ea6",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mnx8czipq39ea6",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzjvttlp3x5h7e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzjvttlpjdc121",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lklsn21npbj067"
    ],
    "affiliateLink": "https://s.shopee.com.br/9AQCqHEtpJ",
    "category": "Moda Feminina",
    "sold": 13167,
    "createdAt": "2026-11-15T03:28:05.859Z"
  },
  {
    "id": 26,
    "name": "Blusa De Frio Cacharrel Feminina Gola Alta Tricot",
    "description": "Campeão de vendas da Shopee em Blusa. Nota 4,9 de 5 em 20 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg56wulm5err7e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg56wulm5err7e",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg56wulm172f39",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg56wulm407ba2",
      "https://down-br.img.susercontent.com/file/81a20cde0d292f9aac73aea127cf6cbb"
    ],
    "affiliateLink": "https://s.shopee.com.br/8fTwFMGnqE",
    "category": "Moda Feminina",
    "sold": 9348,
    "createdAt": "2026-11-15T03:27:05.859Z"
  },
  {
    "id": 27,
    "name": "KIT até 10 Calcinhas Empina Bumbum Fio Dental Duplo Conforto Sensual Sem Costura no Bumbum",
    "description": "Campeão de vendas da Shopee em Kit Calcinhas. Nota 4,6 de 5 em 13 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820m7-ml6evok0dzb966",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820m7-ml6evok0dzb966",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz7tuc3y3gh115",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz7tuc3y0nc59d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz7tuc3y4v1h19"
    ],
    "affiliateLink": "https://s.shopee.com.br/2gCj6KvJPf",
    "category": "Moda Feminina",
    "sold": 6254,
    "createdAt": "2026-11-15T03:26:05.859Z"
  },
  {
    "id": 28,
    "name": "Tapete Passadeira Corredor Quarto Sala Felpudo Várias Cores e Tamanhos",
    "description": "Campeão de vendas da Shopee em Tapete passadeira para quarto. Nota 4,7 de 5 em 90 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lb-mlybe3xjfsaoa2",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lb-mlybe3xjfsaoa2",
      "https://down-br.img.susercontent.com/file/br-11134207-820m2-mlyase2po2kk39",
      "https://down-br.img.susercontent.com/file/br-11134207-820lc-mlyase2pigase5",
      "https://down-br.img.susercontent.com/file/br-11134207-820lp-mlyase2pjuv8f2"
    ],
    "affiliateLink": "https://s.shopee.com.br/3qOgUTqs2u",
    "category": "Quarto",
    "sold": 10077,
    "createdAt": "2026-11-15T03:25:05.859Z"
  },
  {
    "id": 29,
    "name": "12/24/36/48/60/80/100 Colors Oily Dual Head Marker Pen Art Assembly for Students School Supplies",
    "description": "Campeão de vendas da Shopee em Caneta. Nota 4,9 de 5 em 36 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7ra39-mb99e6apz4lf14",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7ra39-mb99e6apz4lf14",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rbkr-m5oppr8hr1j42a",
      "https://down-br.img.susercontent.com/file/sg-11134201-7ra3h-mb99e7jo14o9f8",
      "https://down-br.img.susercontent.com/file/sg-11134201-7ra0y-mb99e8xc39bd39"
    ],
    "affiliateLink": "https://s.shopee.com.br/3g5GIArVNt",
    "category": "Papelaria e Mochilas",
    "sold": 21175,
    "createdAt": "2026-11-15T03:24:05.859Z"
  },
  {
    "id": 30,
    "name": "caneca Kit Garrafa Térmica Vacuum Bottle Inox 500ml + 3 Xícaras Bebidas Fria ou Quente",
    "description": "Campeão de vendas da Shopee em Copo Térmico. Nota 4,7 de 5 em 114 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rfgr-m9srcfiqmq8s1a",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rfgr-m9srcfiqmq8s1a",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rfia-m9srchldir3d56",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rfgg-m9srcjfotpk988",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rffr-m9srcllnoz9rfe"
    ],
    "affiliateLink": "https://s.shopee.com.br/3Vlq5rs8is",
    "category": "Cozinha",
    "sold": 11010,
    "createdAt": "2026-11-15T03:23:05.859Z"
  },
  {
    "id": 31,
    "name": "Flat Mop com Refil 6 Litros Esfregão Com Balde Rodo Mágico Lava Seca Tira Pó",
    "description": "Campeão de vendas da Shopee em Esfregão. Nota 4,4 de 5 em 19 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l4-mswqptw27apz35",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-mswqptw27apz35",
      "https://down-br.img.susercontent.com/file/br-11134207-820le-mswqptw28paf48",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m5hbiqb3l0g548"
    ],
    "affiliateLink": "https://s.shopee.com.br/3LSPtYsm3r",
    "category": "Casa e Limpeza",
    "sold": 3365,
    "createdAt": "2026-11-15T03:22:05.859Z"
  },
  {
    "id": 32,
    "name": "Kit Cabides Veludo Para Roupas Adulto 50 Unidades Fino Resistente",
    "description": "Campeão de vendas da Shopee em Cabides. Nota 4,9 de 5 em 33 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6qu5cyuacz443",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6qu5cyuacz443",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6qu5cyubrjk7a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6qu5cyuekog66",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6qu5cyud640c0"
    ],
    "affiliateLink": "https://s.shopee.com.br/4fxnU14odn",
    "category": "Casa e Limpeza",
    "sold": 3528,
    "createdAt": "2026-11-15T03:21:05.859Z"
  },
  {
    "id": 33,
    "name": "Manta Para Sofá Luxo Gigante 210x120cm Tipo Capa Protetora De Sofá Algodão Macio Promocao",
    "description": "Campeão de vendas da Shopee em Manta para Sofá. Nota 4,6 de 5 em 109 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lh-mutat68vdq0zf1",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lh-mutat68vdq0zf1",
      "https://down-br.img.susercontent.com/file/br-11134207-820lu-mutat68v6p6r28",
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-mutat68v9ibnb5",
      "https://down-br.img.susercontent.com/file/br-11134207-820lv-mutcpmv4uwhu87"
    ],
    "affiliateLink": "https://s.shopee.com.br/4VeNHi5Rym",
    "category": "Sala",
    "sold": 8455,
    "createdAt": "2026-11-15T03:20:05.859Z"
  },
  {
    "id": 34,
    "name": "Kit 2 Mantinha Cobertor Manta Casal 2,00m x 1,80m Microfibra Manta Fleece Soft Lisa Inverno",
    "description": "Campeão de vendas da Shopee em Mantas e Cobertores. Nota 4,6 de 5 em 16 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l5-mou4igd17t3483",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l5-mou4igd17t3483",
      "https://down-br.img.susercontent.com/file/br-11134207-820m9-mpibty3xxnur31",
      "https://down-br.img.susercontent.com/file/br-11134207-820lu-mnonobsyi9s0f2",
      "https://down-br.img.susercontent.com/file/br-11134207-820ly-mnonobwykah053"
    ],
    "affiliateLink": "https://s.shopee.com.br/4LKx5P65Jl",
    "category": "Quarto",
    "sold": 4213,
    "createdAt": "2026-11-15T03:19:05.859Z"
  },
  {
    "id": 35,
    "name": "Barbeador-cuidados masculinos e aparador de pelos Maquina cortar cabelo",
    "description": "Campeão de vendas da Shopee em Máquina de cortar cabelo. Nota 4,7 de 5 em 54 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rceq-m6han6bl0x9042",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rceq-m6han6bl0x9042",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rcbu-m6han713zjbu87",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rcf6-m6han870bma18c",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rccw-m6han97ct0kh7f"
    ],
    "affiliateLink": "https://s.shopee.com.br/4B1Wt66iek",
    "category": "Beleza",
    "sold": 16618,
    "createdAt": "2026-11-15T03:18:05.859Z"
  },
  {
    "id": 36,
    "name": "Espelho Redondo Decorativo Adnet Alça Couro Suporte 60cm Sala Quarto Banheiro",
    "description": "Campeão de vendas da Shopee em Espelho Adnet. Nota 4,9 de 5 em 104 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lm-mlpbkz4x4xl360",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lm-mlpbkz4x4xl360",
      "https://down-br.img.susercontent.com/file/br-11134207-820lv-mspubthbkkjq18",
      "https://down-br.img.susercontent.com/file/br-11134207-820lx-mspubthbj5zaea",
      "https://down-br.img.susercontent.com/file/br-11134207-820lo-mspubthbhreuec"
    ],
    "affiliateLink": "https://s.shopee.com.br/40i6gn7Lzj",
    "category": "Sala",
    "sold": 10763,
    "createdAt": "2026-11-15T03:17:05.859Z"
  },
  {
    "id": 37,
    "name": "KIT 2 Body Feminino Manga Longa Gola Alta Cacharrel Segunda Pele Suplex Premium Bory Inverno 2026",
    "description": "Campeão de vendas da Shopee em Body Feminino. Nota 4,8 de 5 em 3,7 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lm-mvc61x7clzpef4",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lm-mvc61x7clzpef4",
      "https://down-br.img.susercontent.com/file/br-11134207-820l6-mopyuojs1qfa46"
    ],
    "affiliateLink": "https://s.shopee.com.br/6L61T6XGSt",
    "category": "Moda Feminina",
    "sold": 4055,
    "createdAt": "2026-11-15T03:16:05.859Z"
  },
  {
    "id": 38,
    "name": "Torneira cozinha parede preta flexível Duplo Jato Cone 1/4 de Volta",
    "description": "Campeão de vendas da Shopee em Torneira de Cozinha. Nota 4,8 de 5 em 97 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lsmxjeg96b0b0e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lsmxjeg96b0b0e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1p07iw0szrca7",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mf0liww1pts529",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1p07iw0t0411c"
    ],
    "affiliateLink": "https://s.shopee.com.br/6q2I41VMS0",
    "category": "Cozinha",
    "sold": 10571,
    "createdAt": "2026-11-15T03:15:05.859Z"
  },
  {
    "id": 39,
    "name": "Pano De Prato Estampado Bainha Kit Com 10 Peças",
    "description": "Campeão de vendas da Shopee em Panos de Prato. Nota 4,7 de 5 em 166 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-23020-1kvzsp966gnv97",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-23020-1kvzsp966gnv97",
      "https://down-br.img.susercontent.com/file/sg-11134201-23020-9cmtlk066gnvdd",
      "https://down-br.img.susercontent.com/file/sg-11134201-23020-opqhefa76gnvd5",
      "https://down-br.img.susercontent.com/file/sg-11134201-23020-ck15ocb76gnva6"
    ],
    "affiliateLink": "https://s.shopee.com.br/6firriVzmz",
    "category": "Cozinha",
    "sold": 6277,
    "createdAt": "2026-11-15T03:14:05.859Z"
  },
  {
    "id": 40,
    "name": "Filtro de Linha Régua de Tomadas 6 Tomadas Tripolar 10 Amperes Com Fusível",
    "description": "Campeão de vendas da Shopee em Extensão Elétrica. Nota 4,9 de 5 em 105 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxbl28z9kzg67e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxbl28z9kzg67e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxbl28yzlebj00",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxbl28z9kzo2f0",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxbl28z9kzpb59"
    ],
    "affiliateLink": "https://s.shopee.com.br/7Af8SdU5m6",
    "category": "Casa e Limpeza",
    "sold": 9363,
    "createdAt": "2026-11-15T03:13:05.859Z"
  },
  {
    "id": 41,
    "name": "Camiseta feminina Segunda Pele Térmica Manga Longa com Proteção UV",
    "description": "Campeão de vendas da Shopee em Camisas Segunda pele. Nota 4,7 de 5 em 37 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-ljueftgyxg9v7a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7qukw-ljueftgyxg9v7a"
    ],
    "affiliateLink": "https://s.shopee.com.br/70LiGKUj75",
    "category": "Moda Feminina",
    "sold": 11646,
    "createdAt": "2026-11-15T03:12:05.859Z"
  },
  {
    "id": 42,
    "name": "KIT 3: Baby Tee Feminina - Blusa Slim Fit Manga Curta - Blusa de Compressão",
    "description": "Campeão de vendas da Shopee em Blusa Feminina. Nota 4,8 de 5 em 30 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0ygzazro8cg77",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0ygzazro8cg77",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0ygzazrim2o8c",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0ygzazqqipsc9",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0ygzazr4ke8c9"
    ],
    "affiliateLink": "https://s.shopee.com.br/80EFSAiWCe",
    "category": "Moda Feminina",
    "sold": 5325,
    "createdAt": "2026-11-15T03:11:05.859Z"
  },
  {
    "id": 43,
    "name": "Conjunto Fitness - Shorts com bolso e Top de alça",
    "description": "Campeão de vendas da Shopee em Roupas de Academia. Nota 4,9 de 5 em 26 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l4-mqci4g7asfls1b",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-mqci4g7asfls1b",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m9bt4nnf0ldlb6",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m9bt4nnez6t53a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0g9u1ht0goxbf"
    ],
    "affiliateLink": "https://s.shopee.com.br/8AXfeThsrh",
    "category": "Moda Feminina",
    "sold": 3126,
    "createdAt": "2026-11-15T03:10:05.859Z"
  },
  {
    "id": 44,
    "name": "Tapete Banheiro Antiderrapante Absorvente de Secagem Rápida entregar Cor e Estampas sortidos",
    "description": "Campeão de vendas da Shopee em Tapete para Banheiro. Nota 4,8 de 5 em 146 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820ly-mv5uk3jmktfm32",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820ly-mv5uk3jmktfm32",
      "https://down-br.img.susercontent.com/file/br-11134207-820lp-mv5uk3jmnmkie7",
      "https://down-br.img.susercontent.com/file/br-11134207-820la-mv5qr3wm6n0jcc",
      "https://down-br.img.susercontent.com/file/br-11134207-820l6-mv5qr3wlzm6bd7"
    ],
    "affiliateLink": "https://s.shopee.com.br/8Kr5qmhFWk",
    "category": "Banheiro",
    "sold": 13963,
    "createdAt": "2026-11-15T03:09:05.859Z"
  },
  {
    "id": 45,
    "name": "Fita de Led Mangueira Neon 5 Metros Alto Brilho Flexivel Siliconada IP65 Com ou Sem Fonte",
    "description": "Campeão de vendas da Shopee em Fita de LED. Nota 4,9 de 5 em 106 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-me0grodb7r434e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-me0grodb7r434e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lugsvpk8p3kw69",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lugsvpk8mag062",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lugm85oj3clw81"
    ],
    "affiliateLink": "https://s.shopee.com.br/8VAW35gcBn",
    "category": "Sala",
    "sold": 13026,
    "createdAt": "2026-11-15T03:08:05.859Z"
  },
  {
    "id": 46,
    "name": "Kit Utensílios de Cozinha Silicone 12 Peças Completo Antiaderente Resistente",
    "description": "Campeão de vendas da Shopee em Kit Utensílios Silicone. Nota 4,7 de 5 em 105 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-822yi-mo9vhd7fb9jge1",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-822yi-mo9vhd7fb9jge1",
      "https://down-br.img.susercontent.com/file/sg-11134201-8262f-mko1fod0lnuu6f",
      "https://down-br.img.susercontent.com/file/sg-11134201-822xu-mo9vhfgwn4sv8a",
      "https://down-br.img.susercontent.com/file/sg-11134201-822wn-mo9vhhblsqvi80"
    ],
    "affiliateLink": "https://s.shopee.com.br/8fTwFOfyqq",
    "category": "Cozinha",
    "sold": 6180,
    "createdAt": "2026-11-15T03:07:05.859Z"
  },
  {
    "id": 47,
    "name": "Assento Sanitário Almofadado Tampa Vaso Oval Universal Redondo Universal Deca Celite Icasa Logasa",
    "description": "Campeão de vendas da Shopee em Assento para vaso sanitário. Nota 4,7 de 5 em 26 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lf-mmki21p71gcm75",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lf-mmki21p71gcm75",
      "https://down-br.img.susercontent.com/file/br-11134207-820la-mvg72ovprapu74",
      "https://down-br.img.susercontent.com/file/br-11134207-820m4-mvg72ovpspaa34",
      "https://down-br.img.susercontent.com/file/br-11134207-820lf-mvg6mz0hor2b4c"
    ],
    "affiliateLink": "https://s.shopee.com.br/9fMTREu7H4",
    "category": "Banheiro",
    "sold": 4264,
    "createdAt": "2026-11-15T03:06:05.859Z"
  },
  {
    "id": 48,
    "name": "Guarda-chuva Sombrinha reforçado unissex",
    "description": "Campeão de vendas da Shopee em Guarda-chuva. Nota 4,8 de 5 em 71 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzdq3odrn4wl6e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzdq3odrn4wl6e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxttcbgjl9kv44",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzdq3odrpy1h03",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxxdyp4bkc52dd"
    ],
    "affiliateLink": "https://s.shopee.com.br/9pftdXtTw7",
    "category": "Casa e Limpeza",
    "sold": 7451,
    "createdAt": "2026-11-15T03:05:05.859Z"
  },
  {
    "id": 49,
    "name": "SHORT CINTA MODELADOR ORIGINAL 4 Barbatanas Alta Compressão Não Enrola Empina Bumbum Plus Size",
    "description": "Campeão de vendas da Shopee em Cinta Modeladora. Nota 4,9 de 5 em 43 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820li-mv3otvf2tfy813",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820li-mv3otvf2tfy813",
      "https://down-br.img.susercontent.com/file/br-11134207-820l7-mv3otvf2uuiof9",
      "https://down-br.img.susercontent.com/file/br-11134207-820mc-mv3otvf2w934c4",
      "https://down-br.img.susercontent.com/file/br-11134207-820md-msm28uobgn46ee"
    ],
    "affiliateLink": "https://s.shopee.com.br/ql4v0RkCO",
    "category": "Moda Feminina",
    "sold": 4026,
    "createdAt": "2026-11-15T03:04:05.859Z"
  },
  {
    "id": 50,
    "name": "KIT Até 15 pares de Meia feminina soquete menor preço direto da fabrica Algodão",
    "description": "Campeão de vendas da Shopee em Kit de Meias. Nota 4,8 de 5 em 24 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134201-820m9-mskoa2ecb1fp0e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134201-820m9-mskoa2ecb1fp0e",
      "https://down-br.img.susercontent.com/file/br-11134201-820mf-mqxzm9p34a9yd9",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7bfgfgk0dde45",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m72wl0cbzcq8e8"
    ],
    "affiliateLink": "https://s.shopee.com.br/gReihSNXN",
    "category": "Moda Feminina",
    "sold": 8013,
    "createdAt": "2026-11-15T03:03:05.859Z"
  },
  {
    "id": 51,
    "name": "Kit 15 Potes Herméticos Plástico com Tampa – Empilháveis Ultra Resistentes Vasilha,Panela, Hermético",
    "description": "Campeão de vendas da Shopee em Kit potes. Nota 4,6 de 5 em 40 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820md-mmsxhxyow2dg2f",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820md-mmsxhxyow2dg2f",
      "https://down-br.img.susercontent.com/file/br-11134207-820lj-mmt0sn93w7bb7f",
      "https://down-br.img.susercontent.com/file/br-11134207-820ll-mmsxhxyokttw95",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mmsxhxyom8ec88"
    ],
    "affiliateLink": "https://s.shopee.com.br/1BNvJcQTWU",
    "category": "Cozinha",
    "sold": 5522,
    "createdAt": "2026-11-15T03:02:05.859Z"
  },
  {
    "id": 52,
    "name": "Mangueira Jardim Trançada Reforçada 5 10 15 20 25 30 50 Metros Completa Esguicho Antitorção Verde",
    "description": "Campeão de vendas da Shopee em Mangueiras de Jardim. Nota 4,7 de 5 em 37 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg2g1m13noqt9a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg2g1m13noqt9a",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg2g1m13rwg5c5",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg2g1m13qhvp8a",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mg2g1m13p3b911"
    ],
    "affiliateLink": "https://s.shopee.com.br/3Vlq5vq2gQ",
    "category": "Casa e Limpeza",
    "sold": 7054,
    "createdAt": "2026-11-15T03:01:05.859Z"
  },
  {
    "id": 53,
    "name": "Fone De Ouvido Earcuffs Condução De Ossos Sem Fio Bluetooth Auriculares TWS Earbuds",
    "description": "Campeão de vendas da Shopee em Fone Bluetooth. Nota 4,5 de 5 em 59 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lyz7v0ak0ev5a6",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lyz7v0ak0ev5a6",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lwekhmwwm5iu96",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lwekhmwwdq460b",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lwekhmwwgj92fa"
    ],
    "affiliateLink": "https://s.shopee.com.br/3LSPtcqg1P",
    "category": "Eletrônicos",
    "sold": 6554,
    "createdAt": "2026-11-15T03:00:05.859Z"
  },
  {
    "id": 54,
    "name": "Kit Meias Infantis Masculina 12 Pares Cano Médio Algodão Menino",
    "description": "Campeão de vendas da Shopee em Kit Meias Infantis. Nota 4,9 de 5 em 24 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lw3ctqkqcmfma0",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lw3ctqkqcmfma0"
    ],
    "affiliateLink": "https://s.shopee.com.br/7Af8Sfc5FA",
    "category": "Infantil",
    "sold": 4471,
    "createdAt": "2026-11-15T02:59:05.859Z"
  },
  {
    "id": 55,
    "name": "Balança Digital Cozinha 10Kg Precisão Balança de Alimentos Cozinha pilhas inclusas",
    "description": "Campeão de vendas da Shopee em Balança Digital. Nota 4,9 de 5 em 154 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820ls-mqg6n5hzpc037f",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820ls-mqg6n5hzpc037f",
      "https://down-br.img.susercontent.com/file/br-11134207-820ld-mqg6n5hzqqkj29",
      "https://down-br.img.susercontent.com/file/br-11134207-820lk-mqg6n5hzs54z78",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mqg6n5hztjpfc0"
    ],
    "affiliateLink": "https://s.shopee.com.br/70LiGMcia9",
    "category": "Cozinha",
    "sold": 9170,
    "createdAt": "2026-11-15T02:58:05.859Z"
  },
  {
    "id": 56,
    "name": "1/2/3/4/7 PEÇAS Prateleiras Suporte Com Alto Adesivos Para Parede Banheiro Cozinha Lavanderia",
    "description": "Campeão de vendas da Shopee em Prateleiras e Organizadores. Nota 4,8 de 5 em 116 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lyi3xrpelfl10a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lyi3xrpelfl10a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8dlp2429lapb4",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8dlp242azv523",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-ls8ie4av7j7xc6"
    ],
    "affiliateLink": "https://s.shopee.com.br/6q2I43dLv8",
    "category": "Banheiro",
    "sold": 11666,
    "createdAt": "2026-11-15T02:57:05.859Z"
  },
  {
    "id": 57,
    "name": "Kit 4 Panos Mágico de Chão Grande Super Absorvente de Microfibra para Limpeza Geral 50x60cm",
    "description": "Campeão de vendas da Shopee em Pano de Chão. Nota 4,7 de 5 em 41 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-82606-ml18eaile8le9c",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-82606-ml18eaile8le9c",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mah6ry1r95vd56",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mah6ry1rg6pl48",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mah6ry1rbz09cd"
    ],
    "affiliateLink": "https://s.shopee.com.br/3LSPtd8cTD",
    "category": "Casa e Limpeza",
    "sold": 4265,
    "createdAt": "2026-11-15T02:56:05.859Z"
  },
  {
    "id": 58,
    "name": "1/2/3 Formas de Silicone Quadrada 18x18cm Assadeira Air Fryer e Forno Forma para Fritadeira",
    "description": "Campeão de vendas da Shopee em Acessórios para Air Fryer. Nota 4,8 de 5 em 162 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rcc8-lsk6nq2atlh5cd",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rcc8-lsk6nq2atlh5cd",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mldl1nvly2v8cd",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lvnsn6o5fzs625",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rcda-lsk6nrp4fhzn11"
    ],
    "affiliateLink": "https://s.shopee.com.br/3B8zhK9FoC",
    "category": "Cozinha",
    "sold": 10221,
    "createdAt": "2026-11-15T02:55:05.859Z"
  },
  {
    "id": 59,
    "name": "Papel de Parede 10 METROS x 45CM Adesivo Autocolante para Sala, Quarto",
    "description": "Campeão de vendas da Shopee em Papel de Parede. Nota 4,9 de 5 em 4 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m60ekwhkkg4y85",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m60ekwhkkg4y85"
    ],
    "affiliateLink": "https://s.shopee.com.br/30pZV19t9B",
    "category": "Sala",
    "sold": 1623,
    "createdAt": "2026-11-15T02:54:05.859Z"
  },
  {
    "id": 60,
    "name": "4 OU 2 PELÍCULAS DE VIDRO 3D PARA IPHONE TODOS MODELOS PARA IOS 7 8 XS XR 11 12 13 14 15 16 17 MAX",
    "description": "Campeão de vendas da Shopee em Película de Vidro. Nota 4,9 de 5 em 63 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mk1lv954z3ep3a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mk1lv954z3ep3a",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mfhewzzbvl6s24",
      "https://down-br.img.susercontent.com/file/e2b6c4cc2a7b33f3dc0268e56419d700",
      "https://down-br.img.susercontent.com/file/c262ed2b41461c455b1cdf169e04c289"
    ],
    "affiliateLink": "https://s.shopee.com.br/2qW9IiAWUA",
    "category": "Eletrônicos",
    "sold": 7052,
    "createdAt": "2026-11-15T02:53:05.859Z"
  },
  {
    "id": 61,
    "name": "Projetor 4K HD 150 Polegadas Celular, Xbox, PS, Pc, Wifi HY300 Pro Magcubic Envio Imediato",
    "description": "Entre os mais vendidos da Shopee em Mini projetor portátil. Nota 4,8 de 5 em 58 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-meph30jn0vszaa",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-meph30jn0vszaa",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd6j-lvkvdcfs84hq0d",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd61-lvkvdd3d9lxld0",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd4h-lvkvdds29h0keb"
    ],
    "affiliateLink": "https://s.shopee.com.br/2gCj6PB9p9",
    "category": "Eletrônicos",
    "sold": 7938,
    "createdAt": "2026-11-15T02:52:05.859Z"
  },
  {
    "id": 62,
    "name": "Parafusadeira Furadeira 68V/26V Baterias Sem Fio Impacto Com Maleta Completo Broca Bits Maleta",
    "description": "Entre os mais vendidos da Shopee em Furadeira e Parafusadeira. Nota 4,9 de 5 em 6 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/cn-11134207-7ras8-m6m71cqh805v88",
    "images": [
      "https://down-br.img.susercontent.com/file/cn-11134207-7ras8-m6m71cqh805v88"
    ],
    "affiliateLink": "https://s.shopee.com.br/40i6grNgEY",
    "category": "Ferramentas",
    "sold": 1978,
    "createdAt": "2026-11-15T02:51:05.859Z"
  },
  {
    "id": 63,
    "name": "Jogo de Cama Lençol 400 Fios Micropercal",
    "description": "Entre os mais vendidos da Shopee em Jogo de Lençol. Nota 4,8 de 5 em 61 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lg-mtliod5oxk3m9c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lg-mtliod5oxk3m9c",
      "https://down-br.img.susercontent.com/file/br-11134207-820lq-mtliod5ihsebf1",
      "https://down-br.img.susercontent.com/file/br-11134207-820mf-mtliod5ij6yr45",
      "https://down-br.img.susercontent.com/file/br-11134207-820l5-mtliod5iot8jb7"
    ],
    "affiliateLink": "https://s.shopee.com.br/4B1WtAN2tb",
    "category": "Quarto",
    "sold": 19514,
    "createdAt": "2026-11-15T02:50:05.859Z"
  },
  {
    "id": 64,
    "name": "Kit Com 10 Cuecas Boxer Adulto",
    "description": "Entre os mais vendidos da Shopee em Kit Cuecas. Nota 4,3 de 5 em 18 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820la-mn22k8mtiio05d",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820la-mn22k8mtiio05d",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjoajdn02ewzbc",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7asdlv8zwp8a0",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-meozf0eubu9t31"
    ],
    "affiliateLink": "https://s.shopee.com.br/3g5GIFOwuW",
    "category": "Moda Masculina",
    "sold": 5515,
    "createdAt": "2026-11-15T02:49:05.859Z"
  },
  {
    "id": 65,
    "name": "Escova Secadora Alisador Elétrica Quente Cabelo Com 3 Em1 Hair Styler Marisa APENAS 110",
    "description": "Entre os mais vendidos da Shopee em Escova secadora. Nota 4,7 de 5 em 74 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbo6vkr7mxqx56",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbo6vkr7mxqx56",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbo6vkr82dzt01",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbo6vkr8hu8p1a",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbo6363agfa195"
    ],
    "affiliateLink": "https://s.shopee.com.br/3qOgUYOJZZ",
    "category": "Beleza",
    "sold": 11434,
    "createdAt": "2026-11-15T02:48:05.859Z"
  },
  {
    "id": 66,
    "name": "Kit 5 Toalhas Umedecidas Turminha da Bagunça 120 Folhas com Tampa Lenço Umedecido",
    "description": "Entre os mais vendidos da Shopee em Lenços Umedecidos. Nota 4,9 de 5 em 119 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lf-mutdymfnjqiq85",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lf-mutdymfnjqiq85",
      "https://down-br.img.susercontent.com/file/br-11134207-820lr-mutdymfnl536a0",
      "https://down-br.img.susercontent.com/file/br-11134207-820l5-mutdymfnmjnmab",
      "https://down-br.img.susercontent.com/file/br-11134207-820lh-mutdymfnny826f"
    ],
    "affiliateLink": "https://s.shopee.com.br/3LSPtdQDaU",
    "category": "Infantil",
    "sold": 10339,
    "createdAt": "2026-11-15T02:47:05.859Z"
  },
  {
    "id": 67,
    "name": "Kit Travesseiro Pluma de Ganso Confortavel e Macio Antiacaro 70x50cm",
    "description": "Entre os mais vendidos da Shopee em Travesseiros. Nota 4,7 de 5 em 148 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6nf0kpaoje8a6",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6nf0kpaoje8a6",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6nf0kpapxyocc",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6nf0kpalq9cd3",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6nf0kpan4ts79"
    ],
    "affiliateLink": "https://s.shopee.com.br/7KyYf0jvEK",
    "category": "Quarto",
    "sold": 11150,
    "createdAt": "2026-11-15T02:46:05.859Z"
  },
  {
    "id": 68,
    "name": "Blusa Feminina Manga Longa Cacharrel Confortável Básico Gola Alta Canelada",
    "description": "Entre os mais vendidos da Shopee em Blusa. Nota 4,6 de 5 em 15 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6r6r47lr5uv98",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6r6r47lr5uv98",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6r6r47lskfb7c",
      "https://down-br.img.susercontent.com/file/br-11134201-820md-mr0wmv75p7nq57",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6r6r47lmy5j37"
    ],
    "affiliateLink": "https://s.shopee.com.br/7VHyrJjHtN",
    "category": "Moda Feminina",
    "sold": 13476,
    "createdAt": "2026-11-15T02:45:05.859Z"
  },
  {
    "id": 69,
    "name": "Tapete Sala Grande 2,00 x 2,50 Peludo Felpudo Várias Cores Promoção",
    "description": "Entre os mais vendidos da Shopee em Tapete Peludo. Nota 4,8 de 5 em 22 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l9-mlzflr9m6adcae",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l9-mlzflr9m6adcae"
    ],
    "affiliateLink": "https://s.shopee.com.br/7fbP3cieYQ",
    "category": "Sala",
    "sold": 2322,
    "createdAt": "2026-11-15T02:44:05.859Z"
  },
  {
    "id": 70,
    "name": "Varal De Chão Vertical 3 Andares Grande Prateleira Dobrável Rodinha Retratil Portatil Roupas",
    "description": "Entre os mais vendidos da Shopee em Varal Retrátil. Nota 4,8 de 5 em 4,6 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-82600-mjps0v8ac6x09d",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-82600-mjps0v8ac6x09d",
      "https://down-br.img.susercontent.com/file/sg-11134201-8260i-mjps0xudalfp63",
      "https://down-br.img.susercontent.com/file/sg-11134201-8261k-mjps104gxxjaaa",
      "https://down-br.img.susercontent.com/file/sg-11134201-8261c-mjps12g9avpe8d"
    ],
    "affiliateLink": "https://s.shopee.com.br/7pupFvi1DT",
    "category": "Casa e Limpeza",
    "sold": 2492,
    "createdAt": "2026-11-15T02:43:05.859Z"
  },
  {
    "id": 71,
    "name": "Calça Pantalona Alfaiataria Premium Wide Leg-Tendência Luxo",
    "description": "Entre os mais vendidos da Shopee em Pantalona. Nota 4,8 de 5 em 9,4 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7reqe-m242q4buzlmk30",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7reqe-m242q4buzlmk30",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-madec15xcn3t8e",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-madec15xe1o995",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-madec15xfg8p8a"
    ],
    "affiliateLink": "https://s.shopee.com.br/5LDUHKrXI0",
    "category": "Moda Feminina",
    "sold": 7809,
    "createdAt": "2026-11-15T02:42:05.859Z"
  },
  {
    "id": 72,
    "name": "Calça Masculina Sport Fino Luxo Acetinada Cos Italiano Alfaiataria Tecido Premium Nao Amassa",
    "description": "Entre os mais vendidos da Shopee em Calças e Bermudas Masculinas. Nota 4,9 de 5 em 8,4 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-luplcr6sfa8k8e",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-luplcr6sfa8k8e"
    ],
    "affiliateLink": "https://s.shopee.com.br/5LDUHL948b",
    "category": "Moda Masculina",
    "sold": 2071,
    "createdAt": "2026-11-15T02:41:05.859Z"
  },
  {
    "id": 73,
    "name": "Kit Lencol Extra Macio 400 Fios Micropercal Com Ponto Palito Vários Tamanhos",
    "description": "Entre os mais vendidos da Shopee em Artigos para Cama. Nota 4,8 de 5 em 22 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l4-msvzzd7gdw5ia3",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-msvzzd7gdw5ia3",
      "https://down-br.img.susercontent.com/file/br-11134207-820m3-msvzzd7gchl2e9",
      "https://down-br.img.susercontent.com/file/br-11134207-820ln-msvzzd3bc2rpd0",
      "https://down-br.img.susercontent.com/file/br-11134207-820ll-msvzzd7i9c7b82"
    ],
    "affiliateLink": "https://s.shopee.com.br/5q9ksG7A7i",
    "category": "Quarto",
    "sold": 11492,
    "createdAt": "2026-11-15T02:40:05.859Z"
  },
  {
    "id": 74,
    "name": "Mochila Unissex para Viagem Cabo de Aço Reforçado Resistente Elegantes Moderno RC9801",
    "description": "Entre os mais vendidos da Shopee em Mochila Universitária. Nota 4,8 de 5 em 113 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81zte-mkmj72iwhjb5b4",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81zte-mkmj72iwhjb5b4",
      "https://down-br.img.susercontent.com/file/br-11134207-81zu3-mkmj72iwg4qp10",
      "https://down-br.img.susercontent.com/file/br-11134207-81zte-mkmj72iwbx1da8",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m5u26suwd8jp4b"
    ],
    "affiliateLink": "https://s.shopee.com.br/5fqKfx7nSh",
    "category": "Papelaria e Mochilas",
    "sold": 7580,
    "createdAt": "2026-11-15T02:39:05.859Z"
  },
  {
    "id": 76,
    "name": "Kit De Ferramentas 40/46 Peças Jogo De Soquetes Chave Catraca Reversível Com Maleta Jogo De",
    "description": "Entre os mais vendidos da Shopee em Kit de Ferramentas. Nota 4,8 de 5 em 42 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lv3di9c52zdp38",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lv3di9c52zdp38",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lv3di9c55sil28",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lv3di9c5773182",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lv3di9c58lnh34"
    ],
    "affiliateLink": "https://s.shopee.com.br/AAIk2DqfKa",
    "category": "Ferramentas",
    "sold": 2893,
    "createdAt": "2026-11-15T02:37:05.859Z"
  },
  {
    "id": 77,
    "name": "ROMANTIC CROWN Copo Térmico Inox Portátil 1200ml/600ml/1.2L Garrafa Térmica Inoxidável com Tampa e",
    "description": "Entre os mais vendidos da Shopee em Copo Térmico. Nota 5,0 de 5 em 68 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lw-mrsfn2n1nkec7c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lw-mrsfn2n1nkec7c",
      "https://down-br.img.susercontent.com/file/br-11134207-820m2-mqgyizs7qo74ab",
      "https://down-br.img.susercontent.com/file/br-11134207-820lq-mqgyizs7s2rke8",
      "https://down-br.img.susercontent.com/file/br-11134207-820mc-mqgyizs7nv28ca"
    ],
    "affiliateLink": "https://s.shopee.com.br/9zzJpurIfZ",
    "category": "Cozinha",
    "sold": 7178,
    "createdAt": "2026-11-15T02:36:05.859Z"
  },
  {
    "id": 78,
    "name": "Tapete Passadeira 2,00 x 0,60 Corredor Quarto Sala Beira de Cama Felpudo Peludo",
    "description": "Entre os mais vendidos da Shopee em Tapete passadeira para quarto. Nota 4,8 de 5 em 55 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lr-mvdf20b774761c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lr-mvdf20b774761c",
      "https://down-br.img.susercontent.com/file/br-11134207-820l6-mly592n7g5q867",
      "https://down-br.img.susercontent.com/file/br-11134207-820m7-mly592n77qbkcc",
      "https://down-br.img.susercontent.com/file/br-11134207-820lc-mly592n7ajgg8c"
    ],
    "affiliateLink": "https://s.shopee.com.br/7KyYf1J7Tw",
    "category": "Quarto",
    "sold": 6019,
    "createdAt": "2026-11-15T02:35:05.859Z"
  },
  {
    "id": 79,
    "name": "Jogo de Lençol Premium Com Elástico 400 fios Percal 3 Peças Ponto Palito",
    "description": "Entre os mais vendidos da Shopee em Jogo de Cama. Nota 4,8 de 5 em 91 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mje1s2nv7y827b",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mje1s2nv7y827b",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mje1s2nv6jnm0e",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjjpxgvjnthi97",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mje1s2nv3qiq07"
    ],
    "affiliateLink": "https://s.shopee.com.br/7VHyrKIU8z",
    "category": "Quarto",
    "sold": 14059,
    "createdAt": "2026-11-15T02:34:05.859Z"
  },
  {
    "id": 80,
    "name": "Cortina Blackout Para Quarto Sala Cozinha PVC Corta 100% Luz 2,80 Largura X 2,30 Altura Grande",
    "description": "Entre os mais vendidos da Shopee em Cortina Blackout. Nota 4,7 de 5 em 61 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m84shxe4v8c1d9",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m84shxe4v8c1d9",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m7die869hkr01f",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m84shxe4ttrl9d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m84shxe5oq9dce"
    ],
    "affiliateLink": "https://s.shopee.com.br/7fbP3dHqo2",
    "category": "Quarto",
    "sold": 6434,
    "createdAt": "2026-11-15T02:33:05.859Z"
  },
  {
    "id": 81,
    "name": "Kit até 10 Cabeceira De Cama Casal - Envio FULL 20x40cm",
    "description": "Entre os mais vendidos da Shopee em Cabeceiras e Decoração. Nota 4,8 de 5 em 66 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mct9733wmipe55",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mct9733wmipe55",
      "https://down-br.img.susercontent.com/file/br-11134207-820l8-mlz1tw2s6uioa1",
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-mlz1kossuux32d",
      "https://down-br.img.susercontent.com/file/br-11134207-820lz-mlz1tw2s41dsd8"
    ],
    "affiliateLink": "https://s.shopee.com.br/7pupFwHDT5",
    "category": "Quarto",
    "sold": 8358,
    "createdAt": "2026-11-15T02:32:05.859Z"
  },
  {
    "id": 82,
    "name": "Protetor Impermeável para Colchão SUPER SILENCIOSO 100% Impermeável Tecido Jacquard Premium Tamanhos",
    "description": "Entre os mais vendidos da Shopee em Capa Protetora. Nota 4,9 de 5 em 74 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-luid8vxkfyqca0",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-luid8vxkfyqca0"
    ],
    "affiliateLink": "https://s.shopee.com.br/5LDUHLQjXc",
    "category": "Quarto",
    "sold": 3919,
    "createdAt": "2026-11-15T02:31:05.859Z"
  },
  {
    "id": 83,
    "name": "Manta Super King Microfibra 2,80m x 2,50m Coberta Cobertor Grosso Felpudo",
    "description": "Entre os mais vendidos da Shopee em Mantas e Cobertores. Nota 4,8 de 5 em 12 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lq-mvelyhrago3n77",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lq-mvelyhrago3n77",
      "https://down-br.img.susercontent.com/file/br-11134207-820lg-mps9v6n7rqwwe0",
      "https://down-br.img.susercontent.com/file/br-11134207-820lk-mps9v6n7qccg5f",
      "https://down-br.img.susercontent.com/file/br-11134207-820md-mps9v6n7t5hca0"
    ],
    "affiliateLink": "https://s.shopee.com.br/9fMTRKnMTB",
    "category": "Quarto",
    "sold": 2108,
    "createdAt": "2026-11-15T02:30:05.859Z"
  },
  {
    "id": 84,
    "name": "Espelho Orgânico 110x50cm Pinterest Polido",
    "description": "Entre os mais vendidos da Shopee em Espelho Adnet. Nota 4,9 de 5 em 8,9 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1sbhdamc8mi2c",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1sbhdamc8mi2c"
    ],
    "affiliateLink": "https://s.shopee.com.br/9V33F1nzoA",
    "category": "Sala",
    "sold": 1499,
    "createdAt": "2026-11-15T02:29:05.859Z"
  },
  {
    "id": 85,
    "name": "Conjunto top e calça legging fitness zero transparência feminino premium roupa de academia feminino",
    "description": "Entre os mais vendidos da Shopee em Roupas de Academia. Nota 4,8 de 5 em 17 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mkbrps2mgpogfd",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mkbrps2mgpogfd",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mkbrps2m9ou8f9",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mjxuoi9r4f0jf1",
      "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mkbrps2mb3eoc8"
    ],
    "affiliateLink": "https://s.shopee.com.br/9Kjd2iod99",
    "category": "Moda Feminina",
    "sold": 3196,
    "createdAt": "2026-11-15T02:28:05.859Z"
  },
  {
    "id": 86,
    "name": "Mop Com Centrifuga Inox Com Refil de Microfibra e Cabo em Inox 9 Litros Mopi cabo 115 cm Giratório",
    "description": "Entre os mais vendidos da Shopee em Esfregão. Nota 4,4 de 5 em 60 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81ztw-ml3fz9tb8pvl56",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81ztw-ml3fz9tb8pvl56",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-msxj0b0wsdms09",
      "https://down-br.img.susercontent.com/file/br-11134207-820ll-mvhs1fj9cmwx72",
      "https://down-br.img.susercontent.com/file/br-11134207-820lb-mvhs1fjecete6c"
    ],
    "affiliateLink": "https://s.shopee.com.br/AUvaQrkBmO",
    "category": "Casa e Limpeza",
    "sold": 4874,
    "createdAt": "2026-11-15T02:27:05.859Z"
  },
  {
    "id": 87,
    "name": "Tapete para Banheiro de Secagem Rápida e Super Absorvente - Ideal para Chuveiro, Cozinha e Varanda",
    "description": "Entre os mais vendidos da Shopee em Tapete para Banheiro. Nota 4,5 de 5 em 118 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820l4-mrx0xujp2sxwca",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820l4-mrx0xujp2sxwca",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mrx0xujp47ic7e",
      "https://down-br.img.susercontent.com/file/br-11134207-820m8-mrx0xujp70n820",
      "https://down-br.img.susercontent.com/file/br-11134207-820mb-mrx0xujp5m2sbb"
    ],
    "affiliateLink": "https://s.shopee.com.br/AKcAEYkp7N",
    "category": "Banheiro",
    "sold": 16646,
    "createdAt": "2026-11-15T02:26:05.859Z"
  },
  {
    "id": 88,
    "name": "Kit Calcinhas Confortável Sem Costura Leve Poliamida",
    "description": "Entre os mais vendidos da Shopee em Kit Calcinhas. Nota 4,9 de 5 em 66 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3nfnopd3mew0b",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3nfnopd3mew0b",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3nfnopd27ug19",
      "https://down-br.img.susercontent.com/file/br-11134207-820lb-mujo8cvwfugx17",
      "https://down-br.img.susercontent.com/file/br-11134207-820ma-mujo8cvwh91d96"
    ],
    "affiliateLink": "https://s.shopee.com.br/8Kr5qt5hop",
    "category": "Moda Feminina",
    "sold": 8193,
    "createdAt": "2026-11-15T02:25:05.859Z"
  },
  {
    "id": 89,
    "name": "Máquina De Cortar Cabelo Para Barba Masculina Designer Aleatório Elétrico Profissional",
    "description": "Entre os mais vendidos da Shopee em Máquina de cortar cabelo. Nota 4,7 de 5 em 367 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-822zi-mi5zp6u7jd3c55",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-822zi-mi5zp6u7jd3c55",
      "https://down-br.img.susercontent.com/file/sg-11134201-822z8-mi5zp89u54hw9e",
      "https://down-br.img.susercontent.com/file/sg-11134201-822yw-mi5zp9sxiygy34",
      "https://down-br.img.susercontent.com/file/sg-11134201-822y9-mi5zpb9c6o787c"
    ],
    "affiliateLink": "https://s.shopee.com.br/8pnMRo3nnw",
    "category": "Beleza",
    "sold": 11212,
    "createdAt": "2026-11-15T02:24:05.859Z"
  },
  {
    "id": 90,
    "name": "Mini Guarda-Chuva Portátil Dobrável Compacto UV UPF50+ Anti Chuva Sol Bolsa Feminina",
    "description": "Entre os mais vendidos da Shopee em Guarda-chuva. Nota 4,6 de 5 em 26 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-820l5-mo416gwsn2f794",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-820l5-mo416gwsn2f794",
      "https://down-br.img.susercontent.com/file/sg-11134201-820n7-mo416ida9jb9e4",
      "https://down-br.img.susercontent.com/file/sg-11134201-820nx-mo416ksb4rnm90",
      "https://down-br.img.susercontent.com/file/sg-11134201-820mq-mo416muqubk67e"
    ],
    "affiliateLink": "https://s.shopee.com.br/8fTwFV4R8v",
    "category": "Casa e Limpeza",
    "sold": 7221,
    "createdAt": "2026-11-15T02:23:05.859Z"
  },
  {
    "id": 91,
    "name": "Assento Sanitário Tampa Vaso Almofadado Classic Oval Redondo Deca Celite Logasa Incepa",
    "description": "Entre os mais vendidos da Shopee em Assento para vaso sanitário. Nota 4,5 de 5 em 74 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820mh-mrrlwnea7h1h35",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820mh-mrrlwnea7h1h35",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mi4q1v77ck5e50",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m5x9cwuslcj65d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m5x9cwusijeaa2"
    ],
    "affiliateLink": "https://s.shopee.com.br/9AQCqQ2X82",
    "category": "Banheiro",
    "sold": 4541,
    "createdAt": "2026-11-15T02:22:05.859Z"
  },
  {
    "id": 92,
    "name": "Torneira Cozinha Gourmet Bancada Parede Flexível 1/4 Volta Cromo",
    "description": "Entre os mais vendidos da Shopee em Torneira de Cozinha. Nota 4,7 de 5 em 41 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0pxt0lrej4t33",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m0pxt0lrej4t33"
    ],
    "affiliateLink": "https://s.shopee.com.br/906me73AT1",
    "category": "Cozinha",
    "sold": 1668,
    "createdAt": "2026-11-15T02:21:05.859Z"
  },
  {
    "id": 93,
    "name": "30 unidades cabide redondo resistente adulto",
    "description": "Entre os mais vendidos da Shopee em Cabides. Nota 4,8 de 5 em 92 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8owujawf6ohd6",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8owujawf6ohd6",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3l4k4nbmn1xdb",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3l4k4nb05yw76",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m3l4k4nbfm7p6e"
    ],
    "affiliateLink": "https://s.shopee.com.br/4fxnU9fasQ",
    "category": "Casa e Limpeza",
    "sold": 8299,
    "createdAt": "2026-11-15T02:20:05.859Z"
  },
  {
    "id": 94,
    "name": "Body Collant Feminino Regata Blusa Decote Quadrado Com Forro Estilo Blogueira",
    "description": "Entre os mais vendidos da Shopee em Body Feminino. Nota 4,8 de 5 em 29 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m61shr2hjtqoed",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m61shr2hjtqoed",
      "https://down-br.img.susercontent.com/file/br-11134207-820lk-msa94vqmevb8a3",
      "https://down-br.img.susercontent.com/file/br-11134207-820lh-msa94vqn2q6ee0",
      "https://down-br.img.susercontent.com/file/br-11134207-820lx-msa94vqpov0nda"
    ],
    "affiliateLink": "https://s.shopee.com.br/4qHDgSexXT",
    "category": "Moda Feminina",
    "sold": 6112,
    "createdAt": "2026-11-15T02:19:05.859Z"
  },
  {
    "id": 95,
    "name": "Tênis Casual Feminino Leve Confortável Sapatênis Feminino Calce Fácil Envio Imediato",
    "description": "Entre os mais vendidos da Shopee em Tênis Feminino. Nota 4,5 de 5 em 30 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820li-mnyesm4m0c8w5f",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820li-mnyesm4m0c8w5f",
      "https://down-br.img.susercontent.com/file/br-11134207-820mf-moofivcsmvb457",
      "https://down-br.img.susercontent.com/file/br-11134207-820lx-mo79nem8d0jkf9",
      "https://down-br.img.susercontent.com/file/br-11134207-820ll-mnyesm4m1qtccf"
    ],
    "affiliateLink": "https://s.shopee.com.br/30pZV5lwG8",
    "category": "Moda Feminina",
    "sold": 6603,
    "createdAt": "2026-11-15T02:18:05.859Z"
  },
  {
    "id": 96,
    "name": "Manta Para Sofá Super Gigante 300x180cm Tipo Capa de Sofá 3 Lugares Protetora Decorativa Algodão",
    "description": "Entre os mais vendidos da Shopee em Manta para Sofá. Nota 4,8 de 5 em 45 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820m4-mus5b54oioe9e0",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820m4-mus5b54oioe9e0",
      "https://down-br.img.susercontent.com/file/br-11134207-820m3-mus5b54r1zb45a",
      "https://down-br.img.susercontent.com/file/br-11134207-820lb-mus5b54olhj5d7",
      "https://down-br.img.susercontent.com/file/br-11134207-820lx-mus5b54ok2yp88"
    ],
    "affiliateLink": "https://s.shopee.com.br/3B8zhOlIvB",
    "category": "Sala",
    "sold": 3210,
    "createdAt": "2026-11-15T02:17:05.859Z"
  },
  {
    "id": 97,
    "name": "Blusa Feminina Manga Longa Gola V Segunda Pele Basica T-shirt",
    "description": "Entre os mais vendidos da Shopee em Blusa Feminina. Nota 4,8 de 5 em 50 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lq-mox62xoz747928",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lq-mox62xoz747928",
      "https://down-br.img.susercontent.com/file/br-11134207-820lz-mox62xoz2whx64",
      "https://down-br.img.susercontent.com/file/br-11134207-820li-mox62xoz4b2d3d",
      "https://down-br.img.susercontent.com/file/br-11134207-820lp-mox5nicq1jpcae"
    ],
    "affiliateLink": "https://s.shopee.com.br/2gCj6TnCw6",
    "category": "Moda Feminina",
    "sold": 5380,
    "createdAt": "2026-11-15T02:16:05.859Z"
  },
  {
    "id": 98,
    "name": "Kit com 4 Camiseta Uv Segunda Pele Proteção Solar Fator 50+ Cores Variadas Manga Longa Masculina",
    "description": "Entre os mais vendidos da Shopee em Camisas Segunda pele. Nota 4,3 de 5 em 39 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lr-msx544menoxz16",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lr-msx544menoxz16",
      "https://down-br.img.susercontent.com/file/br-11134207-820md-msx544mcctfo19",
      "https://down-br.img.susercontent.com/file/br-11134207-820mc-muw80nemcbnl4f",
      "https://down-br.img.susercontent.com/file/br-11134207-820m5-muw7ivl5ff9fcf"
    ],
    "affiliateLink": "https://s.shopee.com.br/4B1WtGBxcs",
    "category": "Moda Feminina",
    "sold": 2637,
    "createdAt": "2026-11-15T02:15:05.859Z"
  },
  {
    "id": 99,
    "name": "Meias Masculina Cano Longo Algodão Confortável Premium Kit com 3, 6 ou 12 pares",
    "description": "Entre os mais vendidos da Shopee em Meias. Nota 4,7 de 5 em 49 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rdw5-lxj6hp1opxt231",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rdw5-lxj6hp1opxt231",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mgecgj2x143r12",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rdxt-lxj6hr0fszty2f",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mgecgj2wzpjb79"
    ],
    "affiliateLink": "https://s.shopee.com.br/40i6gxCaxr",
    "category": "Moda Masculina",
    "sold": 9341,
    "createdAt": "2026-11-15T02:14:05.859Z"
  },
  {
    "id": 100,
    "name": "Kit 15 Potes Bowl Plástico com Tampa – Marmita Cozinha, Freezer, Micro-ondas e Lava-Louças.",
    "description": "Entre os mais vendidos da Shopee em Kit potes. Nota 4,8 de 5 em 27 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820m9-mttubjnsypz7d5",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820m9-mttubjnsypz7d5",
      "https://down-br.img.susercontent.com/file/br-11134207-820lt-mttubjnvt9fmc7",
      "https://down-br.img.susercontent.com/file/br-11134207-820ld-mttubjnvuo02cb",
      "https://down-br.img.susercontent.com/file/br-11134207-820m1-mttubjnw0a9ube"
    ],
    "affiliateLink": "https://s.shopee.com.br/6VPRfY34tM",
    "category": "Cozinha",
    "sold": 4155,
    "createdAt": "2026-11-15T02:13:05.859Z"
  },
  {
    "id": 101,
    "name": "Fita de LED Mangueira Neon 5 Metros IP65 Flexível Com ou Sem Fonte | 8 Cores",
    "description": "Entre os mais vendidos da Shopee em Fita de LED. Nota 4,9 de 5 em 63 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rff0-m3wg4rvxyqqt4e",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rff0-m3wg4rvxyqqt4e",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rdy7-lyazqktd4x0s64",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rdwg-lyazqncdfqij0f",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rdvg-lyazqq2vflpm6d"
    ],
    "affiliateLink": "https://s.shopee.com.br/6L61TF3iEL",
    "category": "Sala",
    "sold": 6320,
    "createdAt": "2026-11-15T02:12:05.859Z"
  },
  {
    "id": 102,
    "name": "Pistola de Massagem Muscular Portátil Elétrica Profissional Recarregável USB com Múltiplas",
    "description": "Entre os mais vendidos da Shopee em Massageadores. Nota 4,8 de 5 em 28 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-82282-mhjox12tmpl412",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-82282-mhjox12tmpl412",
      "https://down-br.img.susercontent.com/file/sg-11134201-8227q-mhjox394wpac9d",
      "https://down-br.img.susercontent.com/file/sg-11134201-8227g-mhjox5x18079d5",
      "https://down-br.img.susercontent.com/file/sg-11134201-8227b-mhjox8avr6de83"
    ],
    "affiliateLink": "https://s.shopee.com.br/6AmbGw4LZK",
    "category": "Beleza",
    "sold": 4364,
    "createdAt": "2026-11-15T02:11:05.859Z"
  },
  {
    "id": 103,
    "name": "Kit com 3 Sutiãs Básicos sem Bojo com Alça Larga Reforçados | Confortável e Modelador | Uso Diário",
    "description": "Entre os mais vendidos da Shopee em Lingerie. Nota 4,8 de 5 em 1 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8xszdyq7h8i3f",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8xszdyq7h8i3f"
    ],
    "affiliateLink": "https://s.shopee.com.br/60TB4dMa12",
    "category": "Moda Feminina",
    "sold": 2033,
    "createdAt": "2026-11-15T02:10:05.859Z"
  },
  {
    "id": 104,
    "name": "Kit 10 Potes Marmita Fit 400ML Retangular Com Tampa 4 Travas Jogo de Potes Livres de BPA",
    "description": "Entre os mais vendidos da Shopee em Marmita. Nota 4,3 de 5 em 22 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-824iu-mpdw2dc82t5b17",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-824iu-mpdw2dc82t5b17",
      "https://down-br.img.susercontent.com/file/sg-11134201-824hj-mpdw2dvfd728d7",
      "https://down-br.img.susercontent.com/file/sg-11134201-824gg-mpdw2dcqgemj2b",
      "https://down-br.img.susercontent.com/file/sg-11134201-824i7-mpdw2d7srkeaa1"
    ],
    "affiliateLink": "https://s.shopee.com.br/6AmbGwLwg5",
    "category": "Cozinha",
    "sold": 4008,
    "createdAt": "2026-11-15T02:09:05.859Z"
  },
  {
    "id": 105,
    "name": "Kit 2 Meia-Calça Térmica Forrada Peluciada Translúcida de Lã Feminina Super Elástica Slim 220g MANIA",
    "description": "Entre os mais vendidos da Shopee em Kit de Meias. Nota 4,9 de 5 em 6,3 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134201-820lg-mqxwqu58purrba",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134201-820lg-mqxwqu58purrba",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd5n-lufcowf9donma7",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd6j-lufcozqajhr997",
      "https://down-br.img.susercontent.com/file/sg-11134201-7rd45-lufcp2nq97bk97"
    ],
    "affiliateLink": "https://s.shopee.com.br/6L61TFLJL8",
    "category": "Moda Feminina",
    "sold": 3036,
    "createdAt": "2026-11-15T02:08:05.859Z"
  },
  {
    "id": 106,
    "name": "Kit Utensílios de Cozinha Silicone 12 Peças Completo Antiaderente Resistente com Suporte",
    "description": "Entre os mais vendidos da Shopee em Kit Utensílios Silicone. Nota 4,7 de 5 em 18 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-822wi-mo9wtg8wlte3fb",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-822wi-mo9wtg8wlte3fb",
      "https://down-br.img.susercontent.com/file/sg-11134201-822xt-mo9wtian59tsba",
      "https://down-br.img.susercontent.com/file/sg-11134201-822wg-mo9wtka0tmoda4",
      "https://down-br.img.susercontent.com/file/sg-11134201-8260p-mko1f6h55e6845"
    ],
    "affiliateLink": "https://s.shopee.com.br/6VPRfYKg0B",
    "category": "Cozinha",
    "sold": 4069,
    "createdAt": "2026-11-15T02:07:05.859Z"
  },
  {
    "id": 107,
    "name": "Balança Digital Cozinha 10kg 1g Tara Alimentos Pilhas Inclusas",
    "description": "Entre os mais vendidos da Shopee em Balança Digital. Nota 4,8 de 5 em 47 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lq-ms9wbvpz1ts46a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lq-ms9wbvpz1ts46a",
      "https://down-br.img.susercontent.com/file/br-11134207-820lv-ms9wbvpz61hgcc",
      "https://down-br.img.susercontent.com/file/br-11134207-820lr-ms9wbvpz38ck58",
      "https://down-br.img.susercontent.com/file/br-11134207-820lk-ms9wbvpza96s2b"
    ],
    "affiliateLink": "https://s.shopee.com.br/5LDUHPP7My",
    "category": "Cozinha",
    "sold": 7738,
    "createdAt": "2026-11-15T02:06:05.859Z"
  },
  {
    "id": 108,
    "name": "Meia-Calça Térmica Forrada Grosso Translúcida de Lã Feminina Super Elástica Slim 245g",
    "description": "Entre os mais vendidos da Shopee em Meia-Calça Térmica. Nota 4,8 de 5 em 16 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134201-820m8-mqxzjk0ezev9c3",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134201-820m8-mqxzjk0ezev9c3",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lw1vfvb9ncs6ed",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbv12ojktvhjbc",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbv12ojkva1zd7"
    ],
    "affiliateLink": "https://s.shopee.com.br/5VWuTig58m",
    "category": "Moda Feminina",
    "sold": 6717,
    "createdAt": "2026-11-15T02:05:05.859Z"
  },
  {
    "id": 109,
    "name": "Meia infantil Menino ou menina 0 A 10 Anos Ótima Qualidade e Confortável.",
    "description": "Entre os mais vendidos da Shopee em Kit Meias Infantis. Nota 4,8 de 5 em 35 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-825a8-mv2spodaufif65",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-825a8-mv2spodaufif65",
      "https://down-br.img.susercontent.com/file/sg-11134201-82597-mv2sponqpiitd3",
      "https://down-br.img.susercontent.com/file/sg-11134201-8257x-mv2spnvo3bbdf3",
      "https://down-br.img.susercontent.com/file/sg-11134201-825ad-mv2spntsh151c6"
    ],
    "affiliateLink": "https://s.shopee.com.br/5LDUHPgiTl",
    "category": "Infantil",
    "sold": 10941,
    "createdAt": "2026-11-15T02:04:05.859Z"
  },
  {
    "id": 110,
    "name": "Kit 10 Panos de Prato e Copa 100% Algodão Guardanapos Sem Estampa",
    "description": "Entre os mais vendidos da Shopee em Panos de Prato. Nota 4,7 de 5 em 13 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820lk-mqm0b0r5w26a04",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820lk-mqm0b0r5w26a04",
      "https://down-br.img.susercontent.com/file/br-11134207-820mh-mqm0b0r5aznn95",
      "https://down-br.img.susercontent.com/file/br-11134207-820me-mqm0b0r5unluda",
      "https://down-br.img.susercontent.com/file/br-11134207-820mc-mqm0b0r5nmrmc7"
    ],
    "affiliateLink": "https://s.shopee.com.br/5q9ksKeoSs",
    "category": "Cozinha",
    "sold": 2877,
    "createdAt": "2026-11-15T02:03:05.859Z"
  },
  {
    "id": 111,
    "name": "KIT 3 Suporte Prateleira De Canto Para Banheiro / Cozinha-Uso multifuncional",
    "description": "Entre os mais vendidos da Shopee em Prateleiras e Organizadores. Nota 4,8 de 5 em 24 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4ir19i44g5d1d",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4ir19i44g5d1d",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4ir19i479a989",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4ir19i48nup87",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4ir19i4a2f54e"
    ],
    "affiliateLink": "https://s.shopee.com.br/5fqKg1fRnr",
    "category": "Banheiro",
    "sold": 2494,
    "createdAt": "2026-11-15T02:02:05.859Z"
  },
  {
    "id": 112,
    "name": "Cinta Modeladora Redutora 33 Barbatana Lipo Pós Cirúrgica Afina a Cintura Alta Compressão",
    "description": "Entre os mais vendidos da Shopee em Cinta Modeladora. Nota 4,8 de 5 em 13 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxybfhsp26baf9",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxybfhsp26baf9"
    ],
    "affiliateLink": "https://s.shopee.com.br/7VHyrOYT5E",
    "category": "Moda Feminina",
    "sold": 547,
    "createdAt": "2026-11-15T02:01:05.859Z"
  },
  {
    "id": 113,
    "name": "Régua Filtro de Linha com 7 Tomadas Extensão Elétrica 1 Universal 4 USB Bivolt 10A 110v/220v Cabo",
    "description": "Entre os mais vendidos da Shopee em Extensão Elétrica. Nota 4,9 de 5 em 85 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lo4mequ479gpff",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lo4mequ479gpff",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lo4mequ478wc26",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lo4mf4byga18b1"
    ],
    "affiliateLink": "https://s.shopee.com.br/4B1WtI1s65",
    "category": "Casa e Limpeza",
    "sold": 3122,
    "createdAt": "2026-11-15T02:00:05.859Z"
  },
  {
    "id": 114,
    "name": "Fone Bluetooth Sem Fio com Power Bank Display Digital Touch TWS Caixa Carregadora Alta Bateria",
    "description": "Entre os mais vendidos da Shopee em Fone Bluetooth. Nota 4,7 de 5 em 111 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-8260f-mlgfsn3jkohx28",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-8260f-mlgfsn3jkohx28",
      "https://down-br.img.susercontent.com/file/sg-11134201-8262c-mlgfsppk9m2tf3",
      "https://down-br.img.susercontent.com/file/sg-11134201-8262r-mlgfsrwg2i2ofd",
      "https://down-br.img.susercontent.com/file/sg-11134201-8260u-mlgfsud73eo34e"
    ],
    "affiliateLink": "https://s.shopee.com.br/4LKx5b1El8",
    "category": "Eletrônicos",
    "sold": 5374,
    "createdAt": "2026-11-15T01:59:05.859Z"
  },
  {
    "id": 115,
    "name": "Papel De Parede 3D Linho Texturizado 10 METROS x 45CM Adesivo Autocolante para Sala,Quarto",
    "description": "Entre os mais vendidos da Shopee em Papel de Parede. Nota 4,9 de 5 em 32 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-81z1k-miltkgr0nhfm95",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-miltkgr0nhfm95",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mfv96kqmhxxc56",
      "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mfmle34177r46f",
      "https://down-br.img.susercontent.com/file/br-11134207-820l7-mtfouarjvt34b4"
    ],
    "affiliateLink": "https://s.shopee.com.br/4VeNHu0bQB",
    "category": "Sala",
    "sold": 2809,
    "createdAt": "2026-11-15T01:58:05.859Z"
  },
  {
    "id": 116,
    "name": "Mangueira Antitorção Resistente e Reforçada Preta para Jardim",
    "description": "Entre os mais vendidos da Shopee em Mangueiras de Jardim. Nota 4,7 de 5 em 41 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m71artsdtzs7dc",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m71artsdtzs7dc",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m71artsdvecna0",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m71b6qsqap2f5b",
      "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m71artsdy7hjc1"
    ],
    "affiliateLink": "https://s.shopee.com.br/4fxnUCzy5E",
    "category": "Casa e Limpeza",
    "sold": 5072,
    "createdAt": "2026-11-15T01:57:05.859Z"
  },
  {
    "id": 117,
    "name": "Rodo Mágico Limpa Vidro de Janelas Esponja 2 Em 1",
    "description": "Entre os mais vendidos da Shopee em Pano de Chão. Nota 4,6 de 5 em 3,6 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/sg-11134201-7rfia-m35c22zvvlq344",
    "images": [
      "https://down-br.img.susercontent.com/file/sg-11134201-7rfia-m35c22zvvlq344"
    ],
    "affiliateLink": "https://s.shopee.com.br/4qHDgVzKkH",
    "category": "Casa e Limpeza",
    "sold": 985,
    "createdAt": "2026-11-15T01:56:05.859Z"
  },
  {
    "id": 118,
    "name": "Película de vidro 3D Privacidade Anti Spy Para IPhone Todos Modelos XS XR 11 12 13 14 15 16 Pro Max",
    "description": "Entre os mais vendidos da Shopee em Película de Vidro. Nota 4,9 de 5 em 171 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/6004f5e80ce5f6491572ed917b69271a",
    "images": [
      "https://down-br.img.susercontent.com/file/6004f5e80ce5f6491572ed917b69271a",
      "https://down-br.img.susercontent.com/file/4df34cfd87a9c305cc82cdb3ce85c8bf",
      "https://down-br.img.susercontent.com/file/995fe5291487a666f01e3be8fe45aa27",
      "https://down-br.img.susercontent.com/file/275bc5b80ce3099baccbd799cc98a196"
    ],
    "affiliateLink": "https://s.shopee.com.br/4LKx5bJJjw",
    "category": "Eletrônicos",
    "sold": 10163,
    "createdAt": "2026-11-15T01:55:05.859Z"
  },
  {
    "id": 119,
    "name": "Mesa Mesinha Petisqueira Dobrável Portátil Bandeja Churrasco Praia Bar Bares Piscina Área de Lazer",
    "description": "Entre os mais vendidos da Shopee em Acessórios para Air Fryer. Nota 4,9 de 5 em 6,3 mil avaliações.",
    "image": "https://down-br.img.susercontent.com/file/br-11134207-820mb-munx1xxf2znm1a",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134207-820mb-munx1xxf2znm1a"
    ],
    "affiliateLink": "https://s.shopee.com.br/4VeNHuIgOz",
    "category": "Cozinha",
    "sold": 704,
    "createdAt": "2026-11-15T01:54:05.859Z"
  }
]
