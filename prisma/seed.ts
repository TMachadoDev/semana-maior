// prisma/seed.ts
import { PrismaClient, EventType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean the database
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.scheduleEvent.deleteMany()
  await prisma.talent.deleteMany()
  await prisma.match.deleteMany()
  await prisma.leaderboardEntry.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.tournament.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@semanamaior.edu',
      name: 'Machado',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  // Create an account entry for the admin user
  await prisma.account.create({
    data: {
      userId: adminUser.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: adminUser.id,
    },
  })

  // Create schedule events
  const events = [
    {
      title: 'Cerimônia de Abertura',
      description: 'Abertura oficial da Semana Maior com discursos e apresentações',
      type: EventType.CEREMONY,
      startTime: new Date('2025-03-26T09:00:00'),
      endTime: new Date('2025-03-26T10:00:00'),
      venue: 'Auditório Principal',
      day: 1,
      featured: true,
    },
    {
      title: 'Torneio de Futsal - Fase de Grupos',
      description: 'Partidas da fase de grupos do torneio de futsal',
      type: EventType.TOURNAMENT,
      startTime: new Date('2025-03-26T10:00:00'),
      endTime: new Date('2025-03-26T13:00:00'),
      venue: 'Quadra Principal',
      day: 1,
      featured: true,
    },
    {
      title: 'Show de Talentos',
      description: 'Apresentações das bandas e talentos da escola',
      type: EventType.CONCERT,
      startTime: new Date('2025-03-26T14:00:00'),
      endTime: new Date('2025-03-26T16:00:00'),
      venue: 'Palco Principal',
      day: 1,
      featured: true,
    },
  ]

  for (const event of events) {
    await prisma.scheduleEvent.create({ data: event })
  }

  // Create tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Torneio de Futsal',
      sport: 'Futsal',
      status: 'GROUP_STAGE',
    },
  })

  // Create teams and associated leaderboard entries
  const teamData = [
    { name: 'Informática FC', course: 'Informática', color: '#bc2a24', points: 42, rank: 1, change: 1 },
    { name: 'Administração United', course: 'Administração', color: '#1a1a2e', points: 31, rank: 3, change: -1 },
    { name: 'Mecânica Bravos', course: 'Mecânica', color: '#16213e', points: 27, rank: 4, change: 2 },
    { name: 'Eletro Warriors', course: 'Eletrotécnica', color: '#0f3460', points: 15, rank: 6, change: -1 },
    { name: 'Contabilidade Stars', course: 'Contabilidade', color: '#533483', points: 38, rank: 2, change: 0 },
    { name: 'Logística Eagles', course: 'Logística', color: '#2b4162', points: 24, rank: 5, change: -1 },
  ]

  const groupA = await prisma.group.create({
    data: { name: 'Grupo A', tournamentId: tournament.id },
  })
  const groupB = await prisma.group.create({
    data: { name: 'Grupo B', tournamentId: tournament.id },
  })

  for (let i = 0; i < teamData.length; i++) {
    const { points, rank, change, ...data } = teamData[i]
    const team = await prisma.team.create({
      data: {
        ...data,
        points: points,
        groupId: i < 3 ? groupA.id : groupB.id,
      },
    })

    // Create linked leaderboard entry
    await prisma.leaderboardEntry.create({
      data: {
        teamId: team.id,
        teamName: team.name,
        course: team.course,
        points: team.points,
        rank: rank,
        change: change,
      },
    })
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
