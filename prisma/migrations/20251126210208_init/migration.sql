-- Migração inicial: cria tabelas do banco de dados PostgreSQL
-- Gerada por Prisma em: 26/11/2025

-- Tabela de usuários: armazena credenciais de autenticação
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY, -- UUID único do usuário
    "email" TEXT NOT NULL, -- Email (único)
    "password" TEXT NOT NULL, -- Senha criptografada com bcrypt
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP -- Data/hora de criação
);

-- Tabela de blocos carnavalescos: informações dos blocos feministas
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY, -- UUID único
    "nome" TEXT NOT NULL, -- Nome do bloco (obrigatório)
    "descricao" TEXT, -- Descrição breve
    "contato" TEXT, -- Email ou telefone de contato
    "foto" TEXT, -- URL da foto principal
    "localLat" REAL, -- Latitude da localização no mapa
    "localLng" REAL, -- Longitude da localização no mapa
    "cidade" TEXT, -- Cidade onde o bloco atua
    "estado" TEXT, -- Estado (UF)
    "endereco" TEXT, -- Endereço completo
    "vertenteFeminista" TEXT, -- Vertente ou proposta feminista
    "formacao" TEXT, -- Informação sobre formação
    "imagens" TEXT, -- JSON array de URLs de imagens adicionais
    "videos" TEXT, -- JSON array de URLs de vídeos
    "redesSociais" TEXT -- Redes sociais (handles)
);

-- Tabela de eventos: festas e atividades dos blocos
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY, -- UUID único
    "nome" TEXT NOT NULL, -- Nome do evento
    "data" DATETIME NOT NULL, -- Data e hora do evento
    "descricao" TEXT, -- Descrição do evento
    "foto" TEXT, -- URL da foto do evento
    "blocoId" TEXT NOT NULL, -- ID do bloco ao qual pertence
    "local" TEXT, -- Local do evento
    "cidade" TEXT, -- Cidade
    "estado" TEXT, -- Estado
    -- Chave estrangeira: relacionamento com tabela Block
    CONSTRAINT "Event_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices: melhoram performance nas buscas
-- Email único: garante que não haja duplicatas
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
