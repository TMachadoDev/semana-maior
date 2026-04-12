import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection...')
  const count = await prisma.school.count()
  console.log(`Connection successful. School count: ${count}`)
}

main()
  .catch(e => {
    console.error('Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
