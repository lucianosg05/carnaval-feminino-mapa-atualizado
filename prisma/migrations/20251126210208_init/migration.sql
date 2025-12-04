-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "contato" TEXT,
    "foto" TEXT,
    "localLat" REAL,
    "localLng" REAL,
    "cidade" TEXT,
    "estado" TEXT,
    "endereco" TEXT,
    "vertenteFeminista" TEXT,
    "formacao" TEXT,
    "imagens" TEXT,
    "videos" TEXT,
    "redesSociais" TEXT
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "descricao" TEXT,
    "foto" TEXT,
    "blocoId" TEXT NOT NULL,
    "local" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    CONSTRAINT "Event_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
