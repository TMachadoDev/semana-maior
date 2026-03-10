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
    id: 'informatica',
    name: 'Informática',
    shortName: 'INFO',
    color: '#bc2a24',
    accentColor: '#e85d58',
    emoji: '💻',
    description: 'Desenvolvimento de sistemas, redes e programação',
    about:
      'O curso de Informática forma profissionais capacitados a desenvolver sistemas, gerir redes e trabalhar com as mais recentes tecnologias do mercado. Com laboratórios modernos e professores experientes, o curso prepara os alunos para os desafios do mundo digital.',
    classes: 6,
    years: 3,
    area: 'Tecnologia da Informação',
  },
  {
    id: 'administracao',
    name: 'Administração',
    shortName: 'ADM',
    color: '#1a1a2e',
    accentColor: '#3d3d6b',
    emoji: '📊',
    description: 'Gestão empresarial, finanças e liderança',
    about:
      'O curso de Administração prepara líderes e gestores prontos para o mercado de trabalho. Abordando desde finanças e marketing até gestão de pessoas, o curso forma profissionais versáteis capazes de transformar organizações.',
    classes: 5,
    years: 3,
    area: 'Gestão e Negócios',
  },
  {
    id: 'mecanica',
    name: 'Mecânica',
    shortName: 'MEC',
    color: '#374151',
    accentColor: '#6b7280',
    emoji: '⚙️',
    description: 'Manutenção industrial, automação e projetos mecânicos',
    about:
      'O curso de Mecânica Industrial forma técnicos especializados em manutenção de máquinas, automação e fabricação. Com oficinas completas e equipamentos modernos, os alunos aprendem na prática tudo sobre o universo industrial.',
    classes: 4,
    years: 3,
    area: 'Indústria e Manufatura',
  },
  {
    id: 'eletrotecnica',
    name: 'Eletrotécnica',
    shortName: 'ELET',
    color: '#d97706',
    accentColor: '#f59e0b',
    emoji: '⚡',
    description: 'Instalações elétricas, automação e energia',
    about:
      'O curso de Eletrotécnica capacita profissionais para atuar em instalações elétricas residenciais, comerciais e industriais. Com foco em segurança e inovação, o curso aborda desde fundamentos até automação e energias renováveis.',
    classes: 4,
    years: 3,
    area: 'Energia e Automação',
  },
  {
    id: 'contabilidade',
    name: 'Contabilidade',
    shortName: 'CONT',
    color: '#6366f1',
    accentColor: '#818cf8',
    emoji: '🧾',
    description: 'Contabilidade, fiscal, auditoria e finanças',
    about:
      'O curso Técnico em Contabilidade forma profissionais para atuar em escritórios contábeis, departamentos financeiros e empresas de todos os setores. Com ênfase em legislação tributária, contabilidade gerencial e uso de softwares do mercado.',
    classes: 5,
    years: 3,
    area: 'Gestão Financeira',
  },
  {
    id: 'logistica',
    name: 'Logística',
    shortName: 'LOG',
    color: '#059669',
    accentColor: '#10b981',
    emoji: '🚚',
    description: 'Cadeia de suprimentos, transporte e gestão de estoque',
    about:
      'O curso Técnico em Logística prepara profissionais para gerenciar cadeias de suprimentos, otimizar transportes e controlar estoques com eficiência. Cada vez mais essencial no e-commerce e na indústria moderna.',
    classes: 4,
    years: 3,
    area: 'Transporte e Logística',
  },
]
