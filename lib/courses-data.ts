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
  {
    id: 'tgpsi',
    name: 'Téc. de Gestão e Programação de Sistemas Informáticos',
    shortName: 'TGPSI',
    color: '#bc2a24',
    accentColor: '#e85d58',
    emoji: '💻',
    description: 'Programação, desenvolvimento de software e sistemas informáticos',
    about:
      'Curso profissional orientado para o desenvolvimento de software, gestão de sistemas e bases técnicas da informática. Ideal para alunos com interesse em programação, tecnologia e resolução de problemas digitais.',
   classes: 3,
    years: 3,
    area: 'Tecnologias de Informação',
  },
  {
    id: 'massagem-estetica-bem-estar',
    name: 'Téc. de Massagem de Estética e Bem-Estar',
    shortName: 'MEBE',
    color: '#b45309',
    accentColor: '#f59e0b',
    emoji: '💆',
    description: 'Massagem, estética e cuidados de bem-estar',
    about:
      'Curso profissional focado em técnicas de massagem, estética e promoção do bem-estar. Indicado para quem tem interesse na área dos cuidados pessoais, saúde estética e atendimento ao público.',
   classes: 3,
    years: 3,
    area: 'Estética e Bem-Estar',
  },
  {
    id: 'audiovisuais',
    name: 'Técnico de Audiovisuais',
    shortName: 'AUDIO',
    color: '#374151',
    accentColor: '#6b7280',
    emoji: '🎬',
    description: 'Imagem, vídeo, som e produção audiovisual',
    about:
      'Curso profissional vocacionado para a captação, edição e produção de conteúdos audiovisuais. Adequado para alunos com interesse em vídeo, fotografia, som, criatividade e comunicação visual.',
   classes: 3,
    years: 3,
    area: 'Audiovisual e Multimédia',
  },
  {
    id: 'turismo',
    name: 'Técnico de Turismo',
    shortName: 'TUR',
    color: '#059669',
    accentColor: '#10b981',
    emoji: '🧳',
    description: 'Turismo, acolhimento e organização de atividades turísticas',
    about:
      'Curso profissional preparado para formar alunos na área do turismo, atendimento, acompanhamento de visitantes e dinamização de experiências turísticas. Bom para quem gosta de comunicação, cultura e contacto com pessoas.',
   classes: 3,
    years: 3,
    area: 'Turismo',
  },
   {
    id: 'humanidades',
    name: 'Linguas e Humanidades',
    shortName: 'HUM',
    color: '#749605',
    accentColor: '#a2b910',
    emoji: '📚',
    description: 'Sei lá, línguas, cultura e humanidades',
    about:
      'Também não sei bem o que é, mas deve ser algo relacionado com línguas, cultura e humanidades. Deve ser bom para quem gosta de ler, escrever e aprender sobre o mundo.',
   classes: 9,
    years: 3,
    area: 'Humanidades',
  },
]
