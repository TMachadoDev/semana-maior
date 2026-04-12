// lib/courses-data.ts

export interface Course {
  id: string
  name: string
  shortName: string
  color: string
  accentColor: string
  emoji: string
  description: string
  about: string
  classes: number // Número de turmas
  years: number
  area: string
}

export const courses: Course[] = [
  // Cursos Profissionais
  {
    id: 'informatica',
    name: 'Técnico de Informática',
    shortName: 'TGPSI',
    color: '#1d4ed8',
    accentColor: '#60a5fa',
    emoji: '💻',
    description: 'Desenvolvimento de software, redes e sistemas informáticos.',
    about:
      'O curso de Gestão e Programação de Sistemas Informáticos (TGPSI) foca-se no desenvolvimento de aplicações, gestão de bases de dados e manutenção de redes e equipamentos. Ideal para quem procura uma carreira na tecnologia.',
    classes: 3,
    years: 3,
    area: 'Profissional',
  },
  {
    id: 'massagem',
    name: 'Técnico de Massagem',
    shortName: 'MEBE',
    color: '#b45309',
    accentColor: '#f59e0b',
    emoji: '💆',
    description: 'Técnicas de massagem, estética e cuidados de saúde e bem-estar.',
    about:
      'Formação técnica em massagem de relaxamento, estética e cuidados de corpo. Prepara os alunos para trabalhar em spas, centros de estética e unidades de saúde e bem-estar, com foco no cuidado ao próximo.',
    classes: 3,
    years: 3,
    area: 'Profissional',
  },
  {
    id: 'audiovisuais',
    name: 'Técnico de Audiovisuais',
    shortName: 'AUDIO',
    color: '#374151',
    accentColor: '#6b7280',
    emoji: '🎬',
    description: 'Produção de vídeo, som, fotografia e conteúdos multimédia.',
    about:
      'Este curso foca-se na operação de equipamentos de vídeo e áudio, edição de imagem e som, e produção de conteúdos para diversos canais de comunicação, aliando a técnica à criatividade visual e sonora.',
    classes: 3,
    years: 3,
    area: 'Profissional',
  },
  {
    id: 'turismo',
    name: 'Técnico de Turismo',
    shortName: 'TUR',
    color: '#059669',
    accentColor: '#10b981',
    emoji: '🧳',
    description: 'Gestão turística, acolhimento e organização de eventos e viagens.',
    about:
      'O curso de Técnico de Turismo prepara profissionais para intervir no planeamento, organização e execução de atividades turísticas. Foca-se no acolhimento de clientes, informação turística e promoção do património.',
    classes: 3,
    years: 3,
    area: 'Profissional',
  },

  // Cursos Regulares
  {
    id: 'ciencias-tecnologias',
    name: 'Ciências e Tecnologias',
    shortName: 'CT',
    color: '#be123c',
    accentColor: '#fb7185',
    emoji: '🧪',
    description: 'Estudo aprofundado de matemática, física, química e biologia.',
    about:
      'O curso de Ciências e Tecnologias é vocacionado para quem pretende seguir carreiras nas áreas da engenharia, medicina, investigação científica e tecnologias, com uma forte componente experimental e teórica.',
    classes: 16,
    years: 3,
    area: 'Regular',
  },
  {
    id: 'artes',
    name: 'Artes Visuais',
    shortName: 'ART',
    color: '#7e22ce',
    accentColor: '#c084fc',
    emoji: '🎨',
    description: 'Expressão artística, desenho, geometria e história da arte.',
    about:
      'Focado na sensibilidade estética e capacidade criativa, este curso prepara os alunos nas áreas do desenho, design, artes plásticas e património cultural, incentivando a expressão individual e técnica.',
    classes: 5,
    years: 3,
    area: 'Regular',
  },
  {
    id: 'ciencias-socioeconomicas',
    name: 'Ciências Socioeconómicas',
    shortName: 'ECO',
    color: '#ea580c',
    accentColor: '#fdba74',
    emoji: '📈',
    description: 'Análise económica, matemática aplicada e compreensão dos mercados.',
    about:
      'Indicado para alunos interessados em economia, gestão, contabilidade e finanças. Aborda o funcionamento das sociedades contemporâneas e das organizações sob uma perspetiva económica e social.',
    classes: 6,
    years: 3,
    area: 'Regular',
  },
  {
    id: 'humanidades',
    name: 'Línguas e Humanidades',
    shortName: 'HUM',
    color: '#15803d',
    accentColor: '#4ade80',
    emoji: '📚',
    description: 'Estudo de línguas, literatura, história e filosofia.',
    about:
      'O curso de Línguas e Humanidades foca-se na compreensão da cultura, do pensamento humano e das sociedades através do estudo da história, literatura, filosofia e domínio de diversas línguas estrangeiras.',
    classes: 10,
    years: 3,
    area: 'Regular',
  },
]
