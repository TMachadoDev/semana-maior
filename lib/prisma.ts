import { PrismaClient } from '@prisma/client'

// Singleton pattern para o Prisma Client em Next.js (Serverless)
// Previne a abertura de demasiadas conexões à base de dados durante o desenvolvimento
// e otimiza a reutilização em produção na Vercel.

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
