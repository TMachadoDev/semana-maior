import { PrismaClient, EventType, TournamentStatus, MatchStatus, TournamentMode } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const YEAR = 2026
const MONTH = 2 // março = 2 no JS Date.UTC

function lisbonDate(day: number, hhmm: string) {
  const [hour, minute] = hhmm.split(':').map(Number)
  return new Date(Date.UTC(YEAR, MONTH, day, hour, minute))
}

async function main() {
  console.log('🌱 A semear a base de dados completa da Semana Maior 2026...')

  // Limpeza
  await prisma.account.deleteMany()
  await prisma.scheduleEvent.deleteMany()
  await prisma.talent.deleteMany()
  await prisma.match.deleteMany()
  await prisma.leaderboardEntry.deleteMany()
  await prisma.player.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.user.deleteMany()
  await prisma.school.deleteMany()

  // Escolas
  const secundaria = await prisma.school.create({
    data: { name: 'Secundária', slug: 'secundaria' },
  })

  const frei = await prisma.school.create({
    data: { name: 'Frei', slug: 'frei' },
  })

  const carmo = await prisma.school.create({
    data: { name: 'Carmo', slug: 'carmo' },
  })

  // Admin
  const hashedPassword = await bcrypt.hash('semanamaior26', 12)

  await prisma.user.create({
    data: {
      email: 'admin@semanamaior.pt',
      name: 'Administrador',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  // =========================
  // TORNEIOS
  // =========================
  const futsalTournament = await prisma.tournament.create({
    data: {
      name: 'Torneio de Futsal',
      sport: 'Futsal',
      mode: TournamentMode.FUTSAL,
      status: TournamentStatus.GROUP_STAGE,
    },
  })

  const volleyTournament = await prisma.tournament.create({
    data: {
      name: 'Torneio de Vólei',
      sport: 'Voleibol',
      mode: TournamentMode.VOLLEY,
      status: TournamentStatus.UPCOMING,
    },
  })

  // Grupos Futsal
  const groupA = await prisma.group.create({
    data: { name: 'Grupo A', tournamentId: futsalTournament.id },
  })

  const groupB = await prisma.group.create({
    data: { name: 'Grupo B', tournamentId: futsalTournament.id },
  })

  // =========================
  // EQUIPAS (TEAMS)
  // =========================
  const teamsData: Array<{
    name: string
    course: string
    color: string
    schoolId: string
    groupId?: string
    tournamentId: string
    points: number
    wins: number
    losses: number
    draws: number
  }> = [
    {
      name: 'Informática FC',
      course: 'TGPSI',
      color: '#1d4ed8',
      schoolId: secundaria.id,
      groupId: groupA.id,
      tournamentId: futsalTournament.id,
      points: 6,
      wins: 2,
      losses: 0,
      draws: 0,
    },
    {
      name: 'Audiovisuais Utd',
      course: 'AUDIO',
      color: '#374151',
      schoolId: secundaria.id,
      groupId: groupA.id,
      tournamentId: futsalTournament.id,
      points: 3,
      wins: 1,
      losses: 1,
      draws: 0,
    },
    {
      name: 'Turismo SC',
      course: 'TUR',
      color: '#059669',
      schoolId: secundaria.id,
      groupId: groupB.id,
      tournamentId: futsalTournament.id,
      points: 4,
      wins: 1,
      losses: 0,
      draws: 1,
    },
    {
      name: 'Massagem CP',
      course: 'MEBE',
      color: '#b45309',
      schoolId: secundaria.id,
      groupId: groupB.id,
      tournamentId: futsalTournament.id,
      points: 1,
      wins: 0,
      losses: 1,
      draws: 1,
    },
    {
      name: 'CT Vólei',
      course: 'CT',
      color: '#be123c',
      schoolId: secundaria.id,
      tournamentId: volleyTournament.id,
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    },
  ]

  const createdTeams: Array<{
    id: string
    name: string
    course: string
    points: number
  }> = []

  for (const t of teamsData) {
    const team = await prisma.team.create({
      data: {
        name: t.name,
        course: t.course,
        color: t.color,
        schoolId: t.schoolId,
        tournamentId: t.tournamentId,
        points: t.points,
        wins: t.wins,
        losses: t.losses,
        draws: t.draws,
        ...(t.groupId ? { groupId: t.groupId } : {}),
      },
    })

    createdTeams.push(team)

    await prisma.leaderboardEntry.create({
      data: {
        teamId: team.id,
        teamName: team.name,
        course: team.course,
        points: team.points,
        rank: 1,
        category: 'overall',
      },
    })
  }

  // =========================
  // PARTIDAS (MATCHES)
  // =========================
  await prisma.match.createMany({
    data: [
      {
        tournamentId: futsalTournament.id,
        teamAId: createdTeams[0].id,
        teamBId: createdTeams[1].id,
        teamAScore: 3,
        teamBScore: 1,
        status: MatchStatus.FINISHED,
        scheduledAt: lisbonDate(25, '14:30'),
        location: 'Pavilhão ESSMM',
        phase: 'INITIAL_STAGE',
        schoolId: secundaria.id,
      },
      {
        tournamentId: futsalTournament.id,
        teamAId: createdTeams[2].id,
        teamBId: createdTeams[3].id,
        teamAScore: 2,
        teamBScore: 2,
        status: MatchStatus.FINISHED,
        scheduledAt: lisbonDate(25, '15:30'),
        location: 'Pavilhão ESSMM',
        phase: 'INITIAL_STAGE',
        schoolId: secundaria.id,
      },
      {
        tournamentId: futsalTournament.id,
        teamAId: createdTeams[0].id,
        teamBId: createdTeams[2].id,
        status: MatchStatus.SCHEDULED,
        scheduledAt: lisbonDate(26, '15:00'),
        location: 'Pavilhão ESSMM',
        phase: 'QUARTER_FINAL',
        schoolId: secundaria.id,
      },
    ],
  })

  // =========================
  // TALENTOS
  // =========================
  await prisma.talent.createMany({
    data: [
      {
        name: 'Duo Acústico',
        description: 'Voz e Violão com covers de Rock Português.',
        type: 'Música',
        venue: 'Palco Principal',
        featured: true,
        schoolId: secundaria.id,
        performAt: lisbonDate(26, '15:00'),
      },
      {
        name: 'The FlyDancers',
        description: 'Grupo de dança urbana contemporânea.',
        type: 'Dança',
        venue: 'Polivalente',
        featured: true,
        schoolId: frei.id,
        performAt: lisbonDate(26, '15:30'),
      },
    ],
  })

  // =========================
  // GALERIA
  // =========================
  await prisma.galleryImage.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
        caption: 'Concerto de Abertura',
        featured: true,
        schoolId: secundaria.id,
      },
      {
        url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a',
        caption: 'Torneio de Voleibol',
        featured: false,
        schoolId: frei.id,
      },
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
        caption: 'Workshop de Flores',
        featured: true,
        schoolId: carmo.id,
      },
    ],
  })

  // =========================
  // AGENDA (SCHEDULE EVENTS)
  // =========================
  const scheduleData = [
    // =========================
    // SEGUNDA-FEIRA - 23 MARÇO
    // =========================
    {
      title: 'Dia do Francês',
      description: 'Ao longo do dia.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(23, '17:00'),
      venue: 'Escola Frei',
      day: 1,
      schoolId: frei.id,
      featured: true,
    },
    {
      title: 'Ocean of Inclusion – Criar Pontes',
      description: 'Público: 5º C, 5º D, 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:15'),
      endTime: lisbonDate(23, '10:00'),
      venue: 'Hall de entrada e Biblioteca',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Gira Vólei',
      description: 'Alunos do 6º ao 9º ano.',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(23, '12:30'),
      venue: 'Escola Frei',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Pontes de Amizade',
      description: 'Público: 5º C, 5º D, 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '10:30'),
      endTime: lisbonDate(23, '11:45'),
      venue: 'Diversos espaços escolares',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – We Act Green',
      description: 'Público: 8º B.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '11:55'),
      endTime: lisbonDate(23, '13:25'),
      venue: 'S A08',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Ementa típica francesa',
      description: 'Cantina.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '12:00'),
      endTime: lisbonDate(23, '14:00'),
      venue: 'Cantina (Frei)',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Gira Vólei',
      description: 'Alunos do 5º ano.',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(23, '13:00'),
      endTime: lisbonDate(23, '16:00'),
      venue: 'Escola Frei',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Eco Walk',
      description: 'Peddy-Paper. Público: 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '14:30'),
      endTime: lisbonDate(23, '17:00'),
      venue: 'Centro Histórico',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'La Nuit Blanche',
      description: 'Cantina.',
      type: EventType.CEREMONY,
      startTime: lisbonDate(23, '19:00'),
      endTime: lisbonDate(23, '21:00'),
      venue: 'Cantina (Frei)',
      day: 1,
      schoolId: frei.id,
      featured: true,
    },

    // ========================
    // TERÇA-FEIRA - 24 MARÇO
    // ========================
    {
      title: 'Eleição Miúdos a Votos',
      description: 'Biblioteca ESSMM.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '08:30'),
      endTime: lisbonDate(24, '10:00'),
      venue: 'Biblioteca ESSMM',
      day: 2,
      schoolId: secundaria.id,
    },
    {
      title: 'Marcha pelo Ambiente',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '10:00'),
      endTime: lisbonDate(24, '12:00'),
      venue: 'ESSMM',
      day: 2,
      schoolId: secundaria.id,
    },
    {
      title: 'A fibra ótica e suas aplicações',
      description: 'Alunos do 11º ano do curso de CT e 12º ano de Física.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '16:00'),
      endTime: lisbonDate(24, '17:30'),
      venue: 'Sala de Conferências (ESSMM)',
      day: 2,
      schoolId: secundaria.id,
    },

    {
      title: 'Dia do Alemão',
      description: 'Ao longo do dia.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '08:30'),
      endTime: lisbonDate(24, '17:00'),
      venue: 'Escola Frei',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Harmonia das Culturas',
      description: 'Público: 8º B.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '08:30'),
      endTime: lisbonDate(24, '10:00'),
      venue: 'Ginásio',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Marcha pelo Ambiente',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '10:00'),
      endTime: lisbonDate(24, '12:00'),
      venue: 'Escola Frei',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Ementa típica alemã',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '12:00'),
      endTime: lisbonDate(24, '14:00'),
      venue: 'Cantina (Frei)',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Passeio de bicicletas',
      description: 'Alunos do 2º ciclo.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '14:00'),
      endTime: lisbonDate(24, '17:00'),
      venue: 'Escola Frei',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Caça ao Mapa',
      description: 'Público: 8º B.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '14:30'),
      endTime: lisbonDate(24, '15:10'),
      venue: 'S A3',
      day: 2,
      schoolId: frei.id,
    },
    {
      title: 'Bandas na Maior',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(24, '15:30'),
      endTime: lisbonDate(24, '16:15'),
      venue: 'Polivalente',
      day: 2,
      schoolId: frei.id,
    },

    {
      title: 'Marcha pelo Ambiente',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '10:00'),
      endTime: lisbonDate(24, '12:00'),
      venue: 'Escola do Carmo',
      day: 2,
      schoolId: carmo.id,
    },
    {
      title: 'Faz acontecer',
      description: 'Alunos por anos do 1º ciclo.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '14:00'),
      endTime: lisbonDate(24, '15:30'),
      venue: 'Escola do Carmo',
      day: 2,
      schoolId: carmo.id,
    },
    {
      title: 'Eleição “Miúdo a Votos”',
      description: 'Biblioteca. Alunos do 4º A.',
      type: EventType.OTHER,
      startTime: lisbonDate(24, '14:00'),
      endTime: lisbonDate(24, '15:30'),
      venue: 'Biblioteca (Carmo)',
      day: 2,
      schoolId: carmo.id,
    },

    // ==========================
    // QUARTA-FEIRA - 25 MARÇO
    // ==========================
    {
      title: 'Sessão Solene – Viagem à Maiorlândia',
      type: EventType.CEREMONY,
      startTime: lisbonDate(25, '10:00'),
      endTime: lisbonDate(25, '12:00'),
      venue: 'Auditório Benjamim Moreira (ABM)',
      day: 3,
      schoolId: secundaria.id,
      featured: true,
    },
    {
      title: 'Verde d’Honra',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '13:00'),
      endTime: lisbonDate(25, '14:15'),
      venue: 'ESSMM',
      day: 3,
      schoolId: secundaria.id,
    },
    {
      title: 'Torneio de Futsal',
      description: 'Associação de Estudantes – ESSMM.',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(25, '14:30'),
      endTime: lisbonDate(25, '17:30'),
      venue: 'ESSMM',
      day: 3,
      schoolId: secundaria.id,
    },
    {
      title: 'E Depois da Escola? – Transição para a Vida Ativa',
      description: 'Ação de Sensibilização.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '17:30'),
      endTime: lisbonDate(25, '18:30'),
      venue: 'Sala de Conferências (ESSMM)',
      day: 3,
      schoolId: secundaria.id,
    },
    {
      title: 'Convívio noturno',
      description: 'Associação de Estudantes.',
      type: EventType.CEREMONY,
      startTime: lisbonDate(25, '18:00'),
      endTime: lisbonDate(25, '22:00'),
      venue: 'ESSMM',
      day: 3,
      schoolId: secundaria.id,
    },

    {
      title: 'Dia do Espanhol',
      description: 'Ao longo do dia.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '08:30'),
      endTime: lisbonDate(25, '18:00'),
      venue: 'Escola Frei',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Taller con Cervantes',
      description: 'Ao longo do dia.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '08:30'),
      endTime: lisbonDate(25, '18:00'),
      venue: 'Escola Frei',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Laboratórios Abertos',
      description: 'Turmas do 5º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '08:30'),
      endTime: lisbonDate(25, '12:00'),
      venue: 'Laboratórios',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Litoral sobre Rodas',
      description: 'Alunos do 6º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '08:30'),
      endTime: lisbonDate(25, '13:00'),
      venue: 'Escola Frei',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Ciência Divertida',
      description: '7º e 8º anos.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '09:00'),
      endTime: lisbonDate(25, '12:00'),
      venue: 'Escola Frei',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Wind Experts',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '11:30'),
      endTime: lisbonDate(25, '13:00'),
      venue: 'Pavilhão B',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Ementa típica espanhola',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '12:00'),
      endTime: lisbonDate(25, '14:00'),
      venue: 'Cantina (Frei)',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Quebra-cucas',
      description: 'Polivalente e salas de aula. Turmas do 3º ciclo.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '14:00'),
      endTime: lisbonDate(25, '17:30'),
      venue: 'Polivalente e salas de aula',
      day: 3,
      schoolId: frei.id,
    },
    {
      title: 'Chá das Línguas',
      description: 'Docentes Frei e docentes do Departamento de Línguas Estrangeiras.',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '16:30'),
      endTime: lisbonDate(25, '18:00'),
      venue: 'Sala de Professores',
      day: 3,
      schoolId: frei.id,
    },

    {
      title: 'Workshop de flores “Flores com Amor”',
      type: EventType.OTHER,
      startTime: lisbonDate(25, '14:00'),
      endTime: lisbonDate(25, '15:30'),
      venue: 'Escola do Carmo',
      day: 3,
      schoolId: carmo.id,
    },

    // ========================
    // QUINTA-FEIRA - 26 MARÇO
    // ========================
    {
      title: 'Visita guiada à ESSMM',
      description: '9º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '09:00'),
      endTime: lisbonDate(26, '17:00'),
      venue: 'Auditório Benjamim Moreira (ABM)',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Atividades Multidisciplinares – Frei',
      description:
        'Inclui: Espaço Nímio, Expressa-te em liberdade, 50 anos da Constituição da República Portuguesa, Taller con Cervantes, English Task Master, Workshop Deutsch ist cool!, atividades laboratoriais, aula de modelo, Crescer em Liberdade, Jogos Filosóficos, Economia Divertida, Stand de Matemática, Descobrir o Mundo: Aprender com Alegria, Crescer com Valores, Aprender, partilhar, crescer, A nossa escola, o nosso futuro!, Ambiente – Cultura e Tradição, Ambiente – Bem-Estar e emoções, apresentação do Curso Profissional (TGPSI), demonstração de impressão 3D, demonstrações com plataformas Arduino e Gabinete Municipal da Juventude.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '09:00'),
      endTime: lisbonDate(26, '17:00'),
      venue: 'ESSMM',
      day: 4,
      schoolId: secundaria.id,
      featured: true,
    },
    {
      title: 'Mega aula de EF para o 1º ciclo',
      description: 'Alunos dos 3º e 4º anos.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '09:30'),
      endTime: lisbonDate(26, '10:10'),
      venue: 'Fórum Exterior',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Mega aula de EF para o 1º ciclo',
      description: 'Alunos dos 1º e 2º anos.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:15'),
      endTime: lisbonDate(26, '10:55'),
      venue: 'Fórum Exterior',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Dança do 1º ciclo',
      description: '2º B.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '11:00'),
      endTime: lisbonDate(26, '11:20'),
      venue: 'Fórum Exterior',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Danças na Maior',
      description: 'Alunos da ESSMM / Escola da Frei.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '11:30'),
      endTime: lisbonDate(26, '12:00'),
      venue: 'Fórum Exterior',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Almoço de confraternização',
      description: 'Alunos ESSMM + Alunos Frei.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '13:00'),
      endTime: lisbonDate(26, '14:00'),
      venue: 'Cantina',
      day: 4,
      schoolId: secundaria.id,
    },
    {
      title: 'Concurso de Talentos',
      description: 'Associação de Estudantes.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '14:30'),
      endTime: lisbonDate(26, '16:30'),
      venue: 'Fórum Exterior',
      day: 4,
      schoolId: secundaria.id,
      featured: true,
    },
    {
      title: 'Tertúlia – Aprender com Alegria, Crescer com Valores',
      type: EventType.CEREMONY,
      startTime: lisbonDate(26, '19:30'),
      endTime: lisbonDate(26, '21:00'),
      venue: 'ESSMM',
      day: 4,
      schoolId: secundaria.id,
    },

    {
      title: 'Dia do Inglês',
      description: 'Ao longo do dia.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '08:30'),
      endTime: lisbonDate(26, '17:00'),
      venue: 'Escola Frei',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Uma Viagem Musical Colaborativa',
      description: 'Público: 6º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '08:30'),
      endTime: lisbonDate(26, '09:15'),
      venue: 'S113',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Workshop de flores “Flores com Amor”',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '09:30'),
      endTime: lisbonDate(26, '12:00'),
      venue: 'Escola Frei',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Ciência Divertida',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '09:30'),
      endTime: lisbonDate(26, '12:00'),
      venue: 'Escola Frei',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Orquestra Jazz da ARTEAM',
      description: 'Turmas do 6º ano.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '09:30'),
      endTime: lisbonDate(26, '10:00'),
      venue: 'Polivalente',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Be a FACT-IVIST! For the Global Goals',
      description: 'Público: 6º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:20'),
      endTime: lisbonDate(26, '11:15'),
      venue: 'S105',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Amigo é caminho – Poesia Multilingue',
      description: 'Alunos estrangeiros.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:20'),
      endTime: lisbonDate(26, '11:55'),
      venue: 'Biblioteca e salas de aula',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Spelling Bee Competition',
      description: 'Turmas do 7º e 8º anos.',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(26, '10:30'),
      endTime: lisbonDate(26, '12:45'),
      venue: 'Biblioteca',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Momentos de Poesia em Inglês',
      description: 'Turmas em aulas.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:30'),
      endTime: lisbonDate(26, '12:30'),
      venue: 'Salas de aula',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'À Descoberta das Praias Rochosas',
      description: 'Público: 8º B.',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:30'),
      endTime: lisbonDate(26, '16:30'),
      venue: 'Praia Norte',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Visita das turmas do 4º ano da EB1 do Carmo',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '10:45'),
      endTime: lisbonDate(26, '13:00'),
      venue: 'Escola Frei',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Ementa típica inglesa',
      type: EventType.OTHER,
      startTime: lisbonDate(26, '12:00'),
      endTime: lisbonDate(26, '14:00'),
      venue: 'Cantina (Frei)',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'Peça de Teatro “Alice no País das Maravilhas”',
      description: '5º D e turmas escalonadas.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '12:00'),
      endTime: lisbonDate(26, '12:30'),
      venue: 'Polivalente',
      day: 4,
      schoolId: frei.id,
    },
    {
      title: 'FlyDancer',
      description: 'Grupo de dança do Desporto Escolar.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(26, '15:00'),
      endTime: lisbonDate(26, '15:45'),
      venue: 'Polivalente',
      day: 4,
      schoolId: frei.id,
    },

    {
      title: 'Receção aos finalistas do jardim de infância',
      type: EventType.CEREMONY,
      startTime: lisbonDate(26, '14:00'),
      endTime: lisbonDate(26, '15:30'),
      venue: 'Escola do Carmo',
      day: 4,
      schoolId: carmo.id,
    },
    {
      title: 'Receção aos Pais dos finalistas do jardim de infância',
      type: EventType.CEREMONY,
      startTime: lisbonDate(26, '18:00'),
      endTime: lisbonDate(26, '19:30'),
      venue: 'Escola do Carmo',
      day: 4,
      schoolId: carmo.id,
    },

    // =======================
    // SEXTA-FEIRA - 27 MARÇO
    // =======================
    {
      title: 'Visita guiada à ESSMM',
      description: '9º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Auditório BM',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Atividades Multidisciplinares – Abelheira',
      description:
        'Inclui: Espaço Nímio, Expressa-te em liberdade, 50 anos da Constituição da República Portuguesa, Taller con Cervantes, Workshop Deutsch ist cool!, English Task Master, atividades laboratoriais, aula de modelo, Crescer em Liberdade, Jogos Filosóficos, Economia Divertida, Stand de Matemática, Descobrir o Mundo: Aprender com Alegria, Crescer com Valores, Aprender, partilhar, crescer, A nossa escola, o nosso futuro!, Ambiente – Cultura e Tradição, Ambiente – Bem-Estar e emoções, apresentação do Curso Profissional (TGPSI), demonstração de impressão 3D, demonstrações com plataformas Arduino e Gabinete Municipal da Juventude.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'ESSMM',
      day: 5,
      schoolId: secundaria.id,
      featured: true,
    },
    {
      title: 'Adote uma planta – 4ª Edição',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '09:30'),
      endTime: lisbonDate(27, '12:00'),
      venue: 'Átrio de acesso piso 0',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Torneio-Triplas de Voleibol',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(27, '08:30'),
      endTime: lisbonDate(27, '12:00'),
      venue: 'Relvado sintético',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Workshop de flores “Flores com Amor”',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '09:30'),
      endTime: lisbonDate(27, '12:00'),
      venue: 'Átrio de acesso piso 0',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Danças na Maior',
      description: 'Alunos da ESSMM / Escola da Abelheira.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(27, '11:45'),
      endTime: lisbonDate(27, '12:15'),
      venue: 'Fórum Exterior',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Almoço de confraternização',
      description: 'Alunos ESSMM + Alunos Abelheira.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '13:00'),
      endTime: lisbonDate(27, '14:00'),
      venue: 'Cantina',
      day: 5,
      schoolId: secundaria.id,
    },
    {
      title: 'Espetáculo Maior',
      description: 'Dependente das condições climáticas.',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(27, '21:30'),
      endTime: lisbonDate(27, '23:00'),
      venue: 'Fórum Exterior',
      day: 5,
      schoolId: secundaria.id,
      featured: true,
    },

    {
      title: 'Marcha da Montanha',
      description: 'Alunos do 5º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '08:30'),
      endTime: lisbonDate(27, '13:00'),
      venue: 'Escola Frei',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Taller Con Cervantes',
      description: 'Biblioteca. Alunos do 6º ano.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '08:30'),
      endTime: lisbonDate(27, '13:00'),
      venue: 'Biblioteca',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Química Sustentável',
      description: 'Público: 8º B.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '08:30'),
      endTime: lisbonDate(27, '09:30'),
      venue: 'Laboratório',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Pegadas de valores – caminho com mistério',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '10:20'),
      endTime: lisbonDate(27, '11:55'),
      venue: 'Espaços Sociais',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Visita ao Museu do Traje',
      description: 'Público: 8º B e 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '10:30'),
      endTime: lisbonDate(27, '12:00'),
      venue: 'Centro da cidade',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Spelling Bee Competition',
      description: 'Turmas do 9º ano.',
      type: EventType.TOURNAMENT,
      startTime: lisbonDate(27, '10:30'),
      endTime: lisbonDate(27, '11:30'),
      venue: 'Biblioteca',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Be a FACT-IVIST! For The Global Goals',
      description: 'Público: 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '13:45'),
      endTime: lisbonDate(27, '14:30'),
      venue: 'Polivalente',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Cultura Siciliana',
      description: 'Público: 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '14:30'),
      endTime: lisbonDate(27, '15:00'),
      venue: 'Polivalente',
      day: 5,
      schoolId: frei.id,
    },
    {
      title: 'Ocean of Inclusion – Memórias Verdes – Partilhar a Europa, Construir Futuros',
      description: 'Público: 6º C, 8º B, 8º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '15:00'),
      endTime: lisbonDate(27, '16:30'),
      venue: 'Polivalente',
      day: 5,
      schoolId: frei.id,
    },

    {
      title: 'Desfile de chapéus da Maior pela cidade',
      type: EventType.SHOWCASE,
      startTime: lisbonDate(27, '09:30'),
      endTime: lisbonDate(27, '12:00'),
      venue: 'Pela cidade',
      day: 5,
      schoolId: carmo.id,
    },
    {
      title: 'Caça à palavra',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '14:00'),
      endTime: lisbonDate(27, '14:45'),
      venue: 'Escola do Carmo',
      day: 5,
      schoolId: carmo.id,
    },
    {
      title: 'Lanche',
      description: 'Em parceria com a Associação de Pais.',
      type: EventType.OTHER,
      startTime: lisbonDate(27, '14:45'),
      endTime: lisbonDate(27, '15:30'),
      venue: 'Escola do Carmo',
      day: 5,
      schoolId: carmo.id,
    },

    // =================================
    // EXPOSIÇÕES E ATIVIDADES PERMANENTES
    // =================================
    {
      title: 'Exposição de trabalhos elaborados pelos alunos de Espanhol',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'ESSMM',
      day: 1,
      schoolId: secundaria.id,
    },
    {
      title: 'Diário Gráfico',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Corredor das Artes',
      day: 1,
      schoolId: secundaria.id,
    },
    {
      title: 'Exposição de Trabalhos de Desenho, Oficinas e Geometria Descritiva',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Corredor e parede do sino',
      day: 1,
      schoolId: secundaria.id,
    },
    {
      title: 'Exposição de poemas “Escrever em Liberdade”',
      description: 'Escritos pelos alunos do 9º C.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Biblioteca',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Exposição “Expressões Artísticas”',
      description: 'Trabalhos elaborados pelos alunos dos 2º e 3º ciclos.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Corredor de acesso sala Professores',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Exposição “G.E.T. GREEN: Growing Environment Together Green”',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Escola Frei',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Exposição “Monumentos”',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Escola Frei',
      day: 1,
      schoolId: frei.id,
    },
    {
      title: 'Mobilidade “Ocean of Inclusion”',
      description: 'Atividade permanente da Semana Maior.',
      type: EventType.OTHER,
      startTime: lisbonDate(23, '09:00'),
      endTime: lisbonDate(27, '17:00'),
      venue: 'Áreas Sociais',
      day: 1,
      schoolId: frei.id,
    },
  ]

  await prisma.scheduleEvent.createMany({
    data: scheduleData,
  })

  console.log(`✅ Seed finalizada com sucesso!`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
