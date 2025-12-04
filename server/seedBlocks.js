import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blocos = [
  {
    nome: "GRES Ki - Fogo do Pontal da Cruz São Sebastião",
    descricao: "Fundado como bloco carnavalesco em 1978 por Walter e Milton Frederico, tornou-se escola de samba em 1981. É a mais antiga e tradicional do município de São Sebastião, detentora do maior número de títulos e atualmente tricampeã. A escola é uma herança familiar.",
    vertenteFeminista: "Empoderamento feminino através da liderança e participação majoritária em espaços tradicionalmente masculinos",
    formacao: "Mista com maioria feminina na bateria e presidência",
    cidade: "São Sebastião",
    estado: "SP",
    contato: "Ana Paula Borges e Willer Borges",
    redesSociais: JSON.stringify({ instagram: "@gres_kifogo" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.7939,
    localLng: -45.4158
  },
  {
    nome: "Sol da Vila Amelia",
    descricao: "Teve início em 2014 e posteriormente tornou-se escola.",
    vertenteFeminista: "Não se declara feminista, mas busca mais apoio para mulheres",
    formacao: "Mista administrado por mulher",
    cidade: "São Sebastião",
    estado: "SP",
    contato: "Dann",
    redesSociais: JSON.stringify({ instagram: "@soldavilaamelia" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.7939,
    localLng: -45.4158
  },
  {
    nome: "Bloco Feminista",
    descricao: "Surgiu em 2021 a partir do desejo de ocupar as ruas com arte e lutar por direitos, reunindo pessoas em manifestações contra o fascismo no Brasil. É um coletivo de artivistas que tem o carnaval como sua principal manifestação artística.",
    vertenteFeminista: "Feminismo interseccional e transfeminista",
    formacao: "Aberto a todas as pessoas com protagonismo de mulheres trans e cis, travestis, homens trans, pessoas transmasculinas e não binárias",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(11) 91866-1488 | blocofeminista@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@blocofeminista", facebook: "Bloco Feminista" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Bloco Sô Fia da Vida",
    descricao: "Formado por mulheres, é um bloco de carnaval de rua que toca samba-enredo autoral em favor da liberdade, da cultura popular e no combate à violência machista, racista e LGBTfóbica. Surgiu no final de 2016.",
    vertenteFeminista: "Resistência ao sexismo e machismo nos espaços culturais",
    formacao: "Exclusivamente mulheres",
    cidade: "São José dos Campos",
    estado: "SP",
    contato: "blocosofiadavida@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@blocosofiadavida" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.1896,
    localLng: -45.8852
  },
  {
    nome: "Filhas de Eva no Jardim das Delícias",
    descricao: "Acredita no poder da festa e da presença como política afetiva de transformação em relação ao machismo, invisibilização e violências.",
    vertenteFeminista: "Feminismo na prática através da ocupação do espaço público",
    formacao: "Coletivo de mulheres instrumentistas",
    cidade: "Florianópolis",
    estado: "SC",
    contato: "(11) 96455-5094",
    redesSociais: JSON.stringify({ instagram: ["@eva_figueiredo_", "@filhasdeevafloripa"] }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -27.5949,
    localLng: -48.5480
  },
  {
    nome: "Bloco Cultural Mulheres Brilhantes",
    descricao: "Surgiu a partir de um coletivo de Mulheres Empreendedoras para dar visibilidade a mulheres que atuam no samba, criando um local onde todas têm voz e espaço.",
    vertenteFeminista: "A cultura é feita por mulheres feministas",
    formacao: "Mulheres",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    contato: "(21) 99694-2088",
    redesSociais: JSON.stringify({ instagram: "@bloco.mulheresbrilhantes" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -22.9068,
    localLng: -43.1729
  },
  {
    nome: "Não Mexe Comigo que Eu Não Ando Só",
    descricao: "Surgiu em 2016 de mulheres que passavam por situações machistas em blocos de carnaval de Porto Alegre. Espaço seguro para mulheres tocarem, cantarem e performarem, e espaço de luta pela igualdade de gênero.",
    vertenteFeminista: "Combate ao machismo e à violência contra a mulher",
    formacao: "Exclusivamente mulheres",
    cidade: "Porto Alegre",
    estado: "RS",
    contato: "(51) 99147-6715 | paulinhamoizes@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@naomexecomigoque", facebook: "Não Mexe Comigo Que Eu Não Ando Só", youtube: "@naomexecomigo" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -30.0326,
    localLng: -51.2302
  },
  {
    nome: "Calcinhas Bélicas",
    descricao: "Coletivo feminino de expressão musical que fez seu primeiro desfile em 2019 e apresenta a luta feminista através da música, do carnaval e da ocupação do espaço público.",
    vertenteFeminista: "Espaço de acolhimento e segurança para mulheres na música",
    formacao: "Mulheres de diferentes cores, identidades e orientações sexuais",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    contato: "+55 21 98346-5775",
    redesSociais: JSON.stringify({ instagram: "@calcinhasbelicas" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -22.9068,
    localLng: -43.1729
  },
  {
    nome: "Maracatu Baque Mulher/RJ",
    descricao: "Movimento de Empoderamento Feminino através da difusão da cultura e das linguagens tradicionais do Maracatu de Baque Virado. Fundado no RJ desde 2016.",
    vertenteFeminista: "Empoderamento feminino e valorização da cultura afro-brasileira",
    formacao: "Mulheres",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    contato: "tenilysilva@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@baquemulherrj" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -22.9068,
    localLng: -43.1729
  },
  {
    nome: "Bloco Siriricando",
    descricao: "Surgiu em 2016 como forma de promover a visibilidade lésbica no carnaval.",
    vertenteFeminista: "Atuação em consonância com os movimentos sociais",
    formacao: "Mulheres",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(11) 97176-3601",
    redesSociais: JSON.stringify({ instagram: "@blocosiriricando" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Bloco Saia de Chita",
    descricao: "Criado por um grupo de amigos em 2007. O bloco foi se tornando feminista à medida que a urgência dessa pauta foi sendo abraçada por seus integrantes.",
    vertenteFeminista: "Priorização de mulheres em liderança e combate à importunação sexual",
    formacao: "Mista com maioria feminina",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(11) 98142-6400 | blocosaiadechita@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@blocosaiadechita" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Bloco Dramas de Sapatão",
    descricao: "Nasceu da necessidade de criar um espaço inclusivo e seguro para mulheres lésbicas, bissexuais, pessoas trans e não binárias.",
    vertenteFeminista: "Espaço seguro para mulheres LBTs e vivências sáficas",
    formacao: "Mulheres lésbicas, bissexuais, pessoas trans e não binárias",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(13) 98123-0242 | blocodramasdesapatao@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@blocodramasdesapatao" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Bloquete",
    descricao: "Bloco de rua sem fins lucrativos fundado em 2013 em Vinhedo para manter viva a tradição do carnaval de rua. Concebido e liderado majoritariamente por mulheres.",
    vertenteFeminista: "Defesa do feminismo, diversidade e direitos LGBTQIA+",
    formacao: "Mista com maioria feminina na liderança",
    cidade: "Vinhedo",
    estado: "SP",
    contato: "(11) 97475-7881 | bloqueteiros@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@bloquetevinhedo" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.0460,
    localLng: -46.9971
  },
  {
    nome: "Bloco Não é Não - Goiânia",
    descricao: "Surgiu em 2017 como forma de afirmar o direito da liberdade e dignidade sexual de meninas, mulheres e pessoas LGBTIAPN+.",
    vertenteFeminista: "Enfrentamento à misoginia, cultura do estupro e defesa da liberdade sexual",
    formacao: "Coletivo ecofeminista",
    cidade: "Goiânia",
    estado: "GO",
    contato: "(62) 98242-4241 | mariaalvescerrado@gmail.com",
    redesSociais: JSON.stringify({ instagram: ["@ccidalves", "@bloconaoenao"] }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -16.6869,
    localLng: -49.2648
  },
  {
    nome: "Vapor de Virilha",
    descricao: "Surgiu em 2025 da vontade de mulheres se juntarem durante o carnaval para tocar sem escolha de repertório prévio, sem ensaio e sem muita organização.",
    vertenteFeminista: "Combate ao perfeccionismo e cobrança que mulheres enfrentam em ambientes de performance",
    formacao: "Mulheres",
    cidade: "Brasília",
    estado: "DF",
    contato: "(61) 98165-3303",
    redesSociais: JSON.stringify({ instagram: "@vapor.de.virilha" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -15.7942,
    localLng: -47.8822
  },
  {
    nome: "Bloca Feminista Ela Pode, Ela Vai",
    descricao: "Nasceu do cansaço do machismo nos blocos de carnaval de rua! Em janeiro de 2018, mulheres batuqueiras, cantoras e produtoras se uniram para construção de uma bloca de mulheres e mulheridades.",
    vertenteFeminista: "Feminismo anticapitalista, decolonial, antirracista",
    formacao: "Mulheres e mulheridades",
    cidade: "Curitiba",
    estado: "PR",
    contato: "(41) 99901-9838 (Renata) | (41) 99911-6604 (Thalita) | (41) 99614-3666 (Rhayane) | (41) 99614-9480 (Simone)",
    redesSociais: JSON.stringify({ instagram: "@elapodeelavai" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -25.4284,
    localLng: -49.2733
  },
  {
    nome: "Maracatu Baque Mulher",
    descricao: "Movimento Nacional de Empoderamento Feminino idealizado e fundado no ano de 2008 por Mestra Joana D'arc Cavalcante. Possui matriz em Recife e 37 filiais.",
    vertenteFeminista: "Enfrentamento e superação das diversas formas de violências contra as mulheres",
    formacao: "Majoritariamente mulheres (em sua expressiva maioria mulheres negras)",
    cidade: "Recife",
    estado: "PE",
    contato: "(81) 9786-2207 | comunicacaobaquemulher@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@movimentoFBV", youtube: "@MovimentoBaqueMulherFBV" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -8.0476,
    localLng: -34.8770
  },
  {
    nome: "Coletivo de Mulheres Negras Sambadeiras de Roda",
    descricao: "Coletivo de estudos do Samba de Roda formado por mulheres negras do Distrito Federal. Realiza oficinas de samba de roda abertas ao público em geral e apresentações em comunidades periféricas.",
    vertenteFeminista: "Fortalecimento de mulheres negras por meio de ações socioculturais",
    formacao: "Mulheres negras",
    cidade: "Brasília",
    estado: "DF",
    contato: "sambadeirasderoda@gmail.com | camila700ambiental@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@sambdeirasderoda", youtube: "@SambadeirasdeRoda" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -15.7942,
    localLng: -47.8822
  },
  {
    nome: "Bloco Maria Sapatão",
    descricao: "Aberto em 2022, pensado como um espaço de luta feito por mulheres. Necessidade de avançar em nossos direitos.",
    vertenteFeminista: "Lutas de pautas feministas",
    formacao: "Mulheres e pessoas trans",
    cidade: "Guarulhos",
    estado: "SP",
    contato: "(11) 95320-2657 | contatomariasapatao@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@bloco_mariaSapatao" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.4615,
    localLng: -46.4873
  },
  {
    nome: "Sagrada Profana",
    descricao: "Bloco de Carnaval feminista que fez seu primeiro desfile em 2017 e surgiu com o objetivo de juntar as mulheres musicistas instrumentistas de sopros e percussão.",
    vertenteFeminista: "Representatividade na música e nas artes, igualdade de oportunidades",
    formacao: "Mulheres instrumentistas",
    cidade: "Belo Horizonte",
    estado: "MG",
    contato: "simpson.shari@gmail.com | narocatorres@gmail.com | contatosagradaprofana@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@sagradaprofanabh" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -19.9191,
    localLng: -43.9386
  },
  {
    nome: "Maluvidas",
    descricao: "Fanfarra feminista surgida em dezembro de 2016 por incentivo do Maestro Spok e busca de empoderamento musical feminino no cenário neofanfarrista de Brasília.",
    vertenteFeminista: "Ocupação de espaços com música, festa, afeto, ativismo e luta",
    formacao: "Mulheres (cis e trans) e pessoas não binárias",
    cidade: "Brasília",
    estado: "DF",
    contato: "(83) 99903-3394",
    redesSociais: JSON.stringify({ instagram: "@maluvidas" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -15.7942,
    localLng: -47.8822
  },
  {
    nome: "Sopre Suas Feras",
    descricao: "Criada em janeiro de 2024 a partir da iniciativa de sopristas de outro bloco carnavalesco da região. Proposta de formar grupo composto exclusivamente por mulheres e pessoas não binárias.",
    vertenteFeminista: "Rompimento com estruturas patriarcais no meio musical",
    formacao: "Mulheres (cis e trans) e pessoas não binárias",
    cidade: "Porto Alegre",
    estado: "RS",
    contato: "(51) 99504-7545 | danicaulfield@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@sopresuasferas" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -30.0326,
    localLng: -51.2302
  },
  {
    nome: "Não é Não!",
    descricao: "Organização de impacto social que surgiu em 2017 como movimento coletivo de mulheres no Rio de Janeiro. Foco no carnaval, tornando-se movimento nacional.",
    vertenteFeminista: "Luta pelos direitos de todas as mulheres através de formações e espaços de troca",
    formacao: "100% feminina",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    contato: "(81) 99945-1416 (Letícia) | (21) 98828-5886 (Julia) | contato@naoenao.com.br",
    redesSociais: JSON.stringify({ instagram: "@naoenao_", linkedin: "@naoenao_" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -22.9068,
    localLng: -43.1729
  },
  {
    nome: "As Obscênicas",
    descricao: "Fanfarra formada exclusivamente por mulheres, nascida em São Paulo no começo de 2019, do desejo de ocupar os espaços da música de rua com potência feminina.",
    vertenteFeminista: "Presença ativa, plural e potente de mulheres na música e no carnaval",
    formacao: "Mulheres",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(21) 98101-6496 | obscenicas@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@asobscenicas", tiktok: "@asobscenicas" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Ilú Obá De Min",
    descricao: "Grupo paulistano fundado em 2004 por mulheres negras com propósito de valorizar e difundir as culturas de matriz africana através da música, dança e artes visuais.",
    vertenteFeminista: "Feminismo negro, antirracista e decolonial",
    formacao: "Mulheres negras",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(11) 98132-9624 (Daiane)",
    redesSociais: JSON.stringify({ instagram: "@iluoba" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Capivara Neon",
    descricao: "Grupo criado em 2021 em meio às manifestações Fora Bolsonaro a partir da Resistência Feminista. Realiza ensaios semanais abertos e gratuitos em espaços públicos.",
    vertenteFeminista: "Protagonismo feminino e valorização das mulheres em cargos de liderança",
    formacao: "Mista com maioria de mulheres na batucada",
    cidade: "Jacareí",
    estado: "SP",
    contato: "(19) 98218-1686 (Amanda) | (12) 99662-0633 (Ana)",
    redesSociais: JSON.stringify({ instagram: ["@amandamenconi", "@naclara_santos"] }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.2988,
    localLng: -45.3267
  },
  {
    nome: "As Batucas - escola de música para mulheres",
    descricao: "Criadas em 2015 pela baterista Biba Meira com a intenção de colocar suas alunas de bateria na rua. Hoje é uma escola de música para mulheres com 19 turmas e mais de 200 alunas.",
    vertenteFeminista: "Empoderamento musical feminino",
    formacao: "Mulheres",
    cidade: "Porto Alegre",
    estado: "RS",
    contato: "(51) 99772-4926 | asbatucas@gmail.com",
    redesSociais: JSON.stringify({ instagram: "@asbatucas" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -30.0326,
    localLng: -51.2302
  },
  {
    nome: "Nu Vuco Vuco",
    descricao: "Criado em 2014 entre amigos de longa data, tem como inspiração a música baiana, com o samba-reagge como ritmo principal.",
    vertenteFeminista: "Maioria feminina",
    formacao: "Mista com maioria feminina",
    cidade: "São Paulo",
    estado: "SP",
    contato: "(11) 98724-9354",
    redesSociais: JSON.stringify({ instagram: "@nuvucovuco" }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -23.5505,
    localLng: -46.6333
  },
  {
    nome: "Bloco Mulheres Rodadas",
    descricao: "Surgiu em 2015 por conta de um post do Facebook que dizia 'não mereço mulher rodada'. A ideia era fazer um protesto e depois virou projeto.",
    vertenteFeminista: "Engajamento em causas, projetos e iniciativas pelos direitos das mulheres",
    formacao: "Mulheres",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    contato: "(21) 98038-2376 | rcarvalhorodrigues@gmail.com",
    redesSociais: JSON.stringify({ instagram: ["@rcarvalhorodrigues", "@blocomulheresrodadas"] }),
    foto: "",
    imagens: JSON.stringify([]),
    videos: JSON.stringify([]),
    localLat: -22.9068,
    localLng: -43.1729
  }
];

async function main() {
  console.log('🌸 Iniciando seed de blocos feministas...');
  
  try {
    // Limpar eventos primeiro (FK constraint)
    await prisma.event.deleteMany({});
    console.log('✓ Eventos anteriores removidos');
    
    // Limpar blocos existentes
    await prisma.block.deleteMany({});
    console.log('✓ Blocos anteriores removidos');
    
    // Criar novos blocos
    for (const bloco of blocos) {
      // Ensure seed blocks are owned by the site (special owner 'site') if not specified
      bloco.ownerId = bloco.ownerId || 'site'
      const created = await prisma.block.create({ data: bloco });
      console.log(`✓ Criado: ${created.nome}`);
    }
    
    console.log('\n✨ Seed concluído com sucesso!');
    console.log(`📊 Total de blocos criados: ${blocos.length}`);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}main();
