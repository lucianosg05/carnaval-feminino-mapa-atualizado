// Cliente Prisma: conexão com banco de dados PostgreSQL
import { PrismaClient } from '@prisma/client'

// Instancia o cliente Prisma: cria conexão com DATABASE_URL do .env
// Prisma mapeia as tabelas SQL em objetos/classes JavaScript
const prisma = new PrismaClient()

// Exporta de forma que otros arquivos do servidor importem como:
// import prisma from './prismaClient.js'
export default prisma
