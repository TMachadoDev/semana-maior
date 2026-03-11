import { PrismaClient, EventType, TournamentStatus, MatchStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 A semear a melhor Semana Maior de sempre...')

  // Limpeza profunda da base de dados
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.scheduleEvent.deleteMany()
  await prisma.talent.deleteMany()
  await prisma.match.deleteMany()
  await prisma.leaderboardEntry.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.galleryImage.deleteMany()

  // 1. Utilizador Admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@semanamaior.edu',
      name: 'Machado',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  await prisma.account.create({
    data: {
      userId: adminUser.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: adminUser.id,
    },
  })

  // 2. Equipas Criativas e Cursos
  const teams = [
    { name: 'Os Leões de Aço', course: 'Mecânica', color: '#3b82f6' }, // Blue
    { name: 'Byte Busters', course: 'Informática', color: '#10b981' }, // Green
    { name: 'Redes de Elite', course: 'Informática/Redes', color: '#f59e0b' }, // Amber
    { name: 'Os Magnatas', course: 'Administração', color: '#8b5cf6' }, // Violet
    { name: 'Turbo Titãs', course: 'Mecânica Auto', color: '#ef4444' }, // Red
    { name: 'Visionários', course: 'Design/Multimédia', color: '#ec4899' }, // Pink
    { name: 'Saúde & Companhia', course: 'Auxiliar de Saúde', color: '#06b6d4' }, // Cyan
    { name: 'Alquimistas', course: 'Análises Laboratoriais', color: '#f97316' }, // Orange
  ]

  // 3. Torneios
  const futsal = await prisma.tournament.create({
    data: {
      name: 'Torneio de Futsal',
      sport: 'Futsal',
      status: TournamentStatus.GROUP_STAGE,
    },
  })

  const volley = await prisma.tournament.create({
    data: {
      name: 'Torneio de Voleibol',
      sport: 'Voleibol',
      status: TournamentStatus.UPCOMING,
    },
  })

  const groupA = await prisma.group.create({
    data: { name: 'Grupo A', tournamentId: futsal.id },
  })

  const createdTeams = []
  for (let i = 0; i < teams.length; i++) {
    const t = await prisma.team.create({
      data: {
        ...teams[i],
        points: Math.floor(Math.random() * 30) + 10,
        wins: Math.floor(Math.random() * 5),
        losses: Math.floor(Math.random() * 2),
        draws: Math.floor(Math.random() * 2),
        groupId: groupA.id,
      },
    })
    createdTeams.push(t)

    // Leaderboard Entry
    await prisma.leaderboardEntry.create({
      data: {
        teamId: t.id,
        teamName: t.name,
        course: t.course,
        points: t.points,
        rank: i + 1,
        change: Math.floor(Math.random() * 3) - 1,
      },
    })
  }

  // 4. Jogos (Matches)
  await prisma.match.create({
    data: {
      tournamentId: futsal.id,
      homeTeamId: createdTeams[0].id,
      awayTeamId: createdTeams[1].id,
      homeScore: 3,
      awayScore: 1,
      status: MatchStatus.FINISHED,
      scheduledAt: new Date('2026-03-26T10:30:00'),
      venue: 'Recinto Escolar',
      stage: 'Fase de Grupos',
    },
  })

  await prisma.match.create({
    data: {
      tournamentId: futsal.id,
      homeTeamId: createdTeams[2].id,
      awayTeamId: createdTeams[3].id,
      status: MatchStatus.LIVE,
      homeScore: 0,
      awayScore: 0,
      scheduledAt: new Date('2026-03-26T14:30:00'),
      venue: 'Recinto Escolar',
      stage: 'Fase de Grupos',
    },
  })

  // 5. Calendário (Schedule)
  const schedule = [
    // Dia 1 - 26 de Março
    {
      title: 'Sessão de Abertura',
      description: 'Arranque oficial da Semana Maior com surpresas e muita energia!',
      type: EventType.CEREMONY,
      startTime: new Date('2026-03-26T09:00:00'),
      endTime: new Date('2026-03-26T10:00:00'),
      venue: 'Auditório',
      day: 1,
      featured: true,
    },
    {
      title: 'Torneio de Futsal - Eliminatórias',
      description: 'O início da competição mais aguardada do ano.',
      type: EventType.TOURNAMENT,
      startTime: new Date('2026-03-26T10:30:00'),
      endTime: new Date('2026-03-26T13:00:00'),
      venue: 'Recinto Escolar',
      day: 1,
      featured: true,
    },
    {
      title: 'Workshop: Criatividade & Carreira',
      description: 'Uma conversa sobre o futuro profissional nas diversas áreas da escola.',
      type: EventType.OTHER,
      startTime: new Date('2026-03-26T11:00:00'),
      endTime: new Date('2026-03-26T12:30:00'),
      venue: 'Sala de Conferências',
      day: 1,
      featured: false,
    },
    {
      title: 'Apresentação de Curso: Informática & Mecânica',
      description: 'Demonstração de projetos inovadores feitos pelos alunos.',
      type: EventType.SHOWCASE,
      startTime: new Date('2026-03-26T14:00:00'),
      endTime: new Date('2026-03-26T15:30:00'),
      venue: 'Recinto Escolar',
      day: 1,
      featured: false,
    },
    {
      title: 'Danças na Maior - 1ª Eliminatória',
      description: 'As coreografias mais incríveis da escola entram em cena.',
      type: EventType.SHOWCASE,
      startTime: new Date('2026-03-26T16:00:00'),
      endTime: new Date('2026-03-26T17:30:00'),
      venue: 'Recinto Escolar',
      day: 1,
      featured: true,
    },
    {
      title: 'Concerto: Lagostas do Roque',
      description: 'A banda da casa promete abalar as estruturas do auditório!',
      type: EventType.CONCERT,
      startTime: new Date('2026-03-26T18:00:00'),
      endTime: new Date('2026-03-26T19:30:00'),
      venue: 'Auditório',
      day: 1,
      featured: true,
    },
    // Dia 2 - 27 de Março
    {
      title: 'Torneio de Voleibol',
      description: 'O segundo dia começa com a rede bem alta.',
      type: EventType.TOURNAMENT,
      startTime: new Date('2026-03-27T09:30:00'),
      endTime: new Date('2026-03-27T12:00:00'),
      venue: 'Recinto Escolar',
      day: 2,
      featured: true,
    },
    {
      title: 'Apresentação de Curso: Saúde & Administração',
      description: 'Conhece o trabalho desenvolvido nestas áreas vitais.',
      type: EventType.SHOWCASE,
      startTime: new Date('2026-03-27T14:00:00'),
      endTime: new Date('2026-03-27T15:30:00'),
      venue: 'Recinto Escolar',
      day: 2,
      featured: false,
    },
    {
      title: 'Danças na Maior - Grande Final',
      description: 'Quem levará o troféu de melhor coreografia do ano?',
      type: EventType.SHOWCASE,
      startTime: new Date('2026-03-27T16:00:00'),
      endTime: new Date('2026-03-27T17:00:00'),
      venue: 'Recinto Escolar',
      day: 2,
      featured: true,
    },
    {
      title: 'Sessão de Encerramento',
      description: 'Entrega de prémios e as palavras finais desta edição épica.',
      type: EventType.CEREMONY,
      startTime: new Date('2026-03-27T17:30:00'),
      endTime: new Date('2026-03-27T18:30:00'),
      venue: 'Auditório',
      day: 2,
      featured: true,
    },
    {
      title: 'After-Party Semana Maior',
      description: 'Celebração final com DJ no pátio da escola.',
      type: EventType.CONCERT,
      startTime: new Date('2026-03-27T19:00:00'),
      endTime: new Date('2026-03-27T21:00:00'),
      venue: 'Recinto Escolar',
      day: 2,
      featured: true,
    },
  ]

  for (const event of schedule) {
    await prisma.scheduleEvent.create({ data: event })
  }

  // 6. Talentos (Bandas e Performances)
  const talents = [
    {
      name: 'Lagostas do Roque',
      description: 'A banda rock que define o espírito da nossa escola. Energia pura e riffs pesados.',
      type: 'Banda',
      venue: 'Auditório',
      performAt: new Date('2026-03-26T18:00:00'),
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Os Acordes de Março',
      description: 'Fusão de jazz e pop com alunos do curso de Multimédia.',
      type: 'Banda',
      venue: 'Auditório',
      performAt: new Date('2026-03-27T14:30:00'),
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Grupo de Dança SM',
      description: 'Vencedores do ano passado, regressam com uma coreografia de Hip-Hop.',
      type: 'Dança',
      venue: 'Recinto Escolar',
      performAt: new Date('2026-03-26T16:00:00'),
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1000&auto=format&fit=crop',
    },
  ]

  for (const talent of talents) {
    await prisma.talent.create({ data: talent })
  }

  // 7. Galeria (Imagens Unsplash)
  const gallery = [
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop', caption: 'Finais de Futsal' },
    { url: 'https://images.unsplash.com/photo-1533443042983-47f45bf8c718?q=80&w=1000&auto=format&fit=crop', caption: 'Momento de união' },
    { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop', caption: 'Auditório lotado' },
    { url: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a7?q=80&w=1000&auto=format&fit=crop', caption: 'Festa de Encerramento' },
  ]

  for (const img of gallery) {
    await prisma.galleryImage.create({ data: img })
  }

  console.log('✅ Seed finalizada com sucesso! A Semana Maior está pronta para começar.')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
