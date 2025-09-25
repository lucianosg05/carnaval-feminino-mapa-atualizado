export interface Block {
  id: string;
  nome: string;
  descricao: string;
  contato: string;
  foto: string;
  local: [number, number];
  cidade: string;
  estado: string;
  endereco: string;
  vertenteFeminista: string;
  formacao: string;
  cache?: string;
  historia?: string;
  estilo?: string;
  proximosEventos?: Array<{
    tipo: string;
    data: string;
    local: string;
    descricao: string;
  }>;
}

export const mockBlocks: Block[] = [
  {
    id: "1",
    nome: "Rosas da Resistência",
    descricao: "Bloco feminista de SP que celebra a força das mulheres através da música e do ativismo.",
    contato: "contato@rosas.org",
    foto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    local: [-23.5596, -46.6588],
    cidade: "São Paulo",
    estado: "SP",
    endereco: "Rua Augusta, 1234 - Consolação, São Paulo - SP, 01305-100",
    vertenteFeminista: "Feminismo Interseccional",
    formacao: "20-30 integrantes",
    cache: "R$ 2.000 - R$ 5.000",
    historia: "Fundado em 2018, o Rosas da Resistência nasceu da necessidade de ocupar as ruas com pautas feministas durante o carnaval.",
    estilo: "Frevo feminista com elementos de samba-reggae",
    proximosEventos: [
      { tipo: "Ensaio", data: "2024-01-15", local: "Centro Cultural", descricao: "Ensaio aberto para novas integrantes" },
      { tipo: "Oficina", data: "2024-01-20", local: "Praça da República", descricao: "Oficina de percussão feminina" }
    ]
  },
  {
    id: "2",
    nome: "Vozes Livres",
    descricao: "Marcha musical pela igualdade de gênero em SP com foco na ancestralidade africana.",
    contato: "vozeslivres@email.com",
    foto: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    local: [-23.5432, -46.6299],
    cidade: "São Paulo",
    estado: "SP",
    endereco: "Av. Paulista, 2567 - Bela Vista, São Paulo - SP, 01311-300",
    vertenteFeminista: "Feminismo Negro",
    formacao: "15-25 integrantes",
    cache: "R$ 1.500 - R$ 3.000",
    historia: "Criado por mulheres negras ativistas em 2019, valoriza a cultura afro-brasileira.",
    estilo: "Afoxé feminista com elementos de maracatu",
    proximosEventos: [
      { tipo: "Desfile", data: "2024-02-10", local: "Av. Paulista", descricao: "Desfile do pré-carnaval" }
    ]
  },
  {
    id: "3",
    nome: "As Guerreiras",
    descricao: "Bateria composta exclusivamente por mulheres em SP, quebrando estereótipos musicais.",
    contato: "guerreiras@bloco.com",
    foto: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
    local: [-23.5641, -46.6503],
    cidade: "São Paulo",
    estado: "SP",
    endereco: "Rua da Consolação, 890 - República, São Paulo - SP, 01302-907",
    vertenteFeminista: "Feminismo Liberal",
    formacao: "10-20 integrantes",
    cache: "R$ 1.000 - R$ 2.500",
    historia: "Fundada em 2017 por musicistas que queriam mais espaço para mulheres na percussão.",
    estilo: "Bateria de escola de samba com toques contemporâneos"
  },
  {
    id: "4",
    nome: "Maré Feminista",
    descricao: "Bloco de empoderamento no RJ que une música e ativismo político.",
    contato: "mare@bloco.com",
    foto: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    local: [-22.9068, -43.1729],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    endereco: "Rua das Laranjeiras, 320 - Laranjeiras, Rio de Janeiro - RJ, 22240-006",
    vertenteFeminista: "Feminismo Radical",
    formacao: "30-50 integrantes",
    cache: "R$ 3.000 - R$ 8.000",
    historia: "Nasceu em 2016 durante os protestos contra o impeachment, misturando política e carnaval.",
    estilo: "Samba-enredo feminista com crítica social"
  },
  {
    id: "5",
    nome: "Tambor de Minas",
    descricao: "Bloco de mulheres batuqueiras de BH que celebra a cultura mineira feminina.",
    contato: "tambor@bh.com",
    foto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    local: [-19.9167, -43.9345],
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco: "Av. Afonso Pena, 1500 - Centro, Belo Horizonte - MG, 30130-005",
    vertenteFeminista: "Feminismo Cultural",
    formacao: "25-35 integrantes",
    cache: "R$ 2.500 - R$ 4.000",
    historia: "Criado em 2020 durante a pandemia, nasceu de encontros virtuais de mulheres musicistas.",
    estilo: "Congado feminista com elementos de marchinha"
  },
  {
    id: "6",
    nome: "Axé das Minas",
    descricao: "Bloco de carnaval feminista em Salvador que mistura axé music com empoderamento.",
    contato: "axe@salvador.com",
    foto: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    local: [-12.9777, -38.5016],
    cidade: "Salvador",
    estado: "BA",
    endereco: "Rua Chile, 45 - Pelourinho, Salvador - BA, 40026-250",
    vertenteFeminista: "Feminismo Interseccional",
    formacao: "40-60 integrantes",
    cache: "R$ 4.000 - R$ 10.000",
    historia: "Fundado em 2015, é um dos pioneiros do movimento de blocos feministas no Nordeste.",
    estilo: "Axé music com letras de empoderamento feminino"
  },
  {
    id: "7",
    nome: "Mulheres do Frevo",
    descricao: "Bloco feminista frevando pelas ruas de Recife com muito gingado e resistência.",
    contato: "frevo@recife.com",
    foto: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
    local: [-8.0476, -34.8770],
    cidade: "Recife",
    estado: "PE",
    endereco: "Rua do Bom Jesus, 163 - Recife Antigo, Recife - PE, 50030-170",
    vertenteFeminista: "Feminismo Regional",
    formacao: "20-40 integrantes",
    cache: "R$ 2.000 - R$ 6.000",
    historia: "Surgiu em 2019 para dar mais visibilidade às mulheres no frevo pernambucano.",
    estilo: "Frevo tradicional com coreografias feministas"
  },
  {
    id: "8",
    nome: "Pelas Gurias",
    descricao: "Bloco feminista gaúcho em Porto Alegre que traz o empoderamento para o Sul.",
    contato: "gurias@poa.com",
    foto: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    local: [-30.0346, -51.2177],
    cidade: "Porto Alegre",
    estado: "RS",
    endereco: "Rua dos Andradas, 1001 - Centro Histórico, Porto Alegre - RS, 90020-007",
    vertenteFeminista: "Feminismo Socialista",
    formacao: "15-30 integrantes",
    cache: "R$ 1.500 - R$ 3.500",
    historia: "Criado em 2021, representa a luta feminista no tradicionalismo gaúcho.",
    estilo: "Marchinha gaúcha com elementos de milonga"
  }
];