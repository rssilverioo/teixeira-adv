export interface Podcast {
  id: string;
  title: string;
  description: string;
  episode: number;
  guests: string[];
  duration: string;
  date: string;
  youtubeUrl: string;
  thumbnail: string;
  tags: string[];
}

export const podcasts: Podcast[] = [
  {
    id: 'podcast-1',
    title: 'O Futuro da Privacidade de Dados no Brasil',
    description: 'Conversamos com especialistas sobre os próximos passos da LGPD, tendências internacionais e como empresas podem se preparar para o futuro da proteção de dados.',
    episode: 1,
    guests: ['Ana Silva', 'Especialista Convidado'],
    duration: '45 min',
    date: '2024-01-10',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    tags: ['LGPD', 'Privacidade', 'Tecnologia'],
  },
  {
    id: 'podcast-2',
    title: 'Startups e Venture Capital: Navegando o Novo Cenário',
    description: 'Uma discussão profunda sobre as mudanças no mercado de venture capital, como startups devem se adaptar e quais são as melhores práticas para levantar investimento em 2024.',
    episode: 2,
    guests: ['Carlos Mendes', 'Rafael Costa', 'VC Partner'],
    duration: '52 min',
    date: '2024-01-24',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    tags: ['Startups', 'Investimentos', 'Empreendedorismo'],
  },
  {
    id: 'podcast-3',
    title: 'Esports: Aspectos Jurídicos e Regulatórios',
    description: 'Exploramos os desafios legais do ecossistema de esports, desde contratos de atletas até questões de propriedade intelectual e regulamentação da atividade.',
    episode: 3,
    guests: ['Beatriz Santos', 'Pro Player', 'Gestor de Org'],
    duration: '48 min',
    date: '2024-02-07',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    tags: ['Esports', 'Gaming', 'Regulação'],
  },
  {
    id: 'podcast-4',
    title: 'Criptoativos e Tributação: Guia Prático',
    description: 'Um guia completo sobre tributação de criptoativos, incluindo as últimas atualizações da Receita Federal e estratégias de planejamento tributário.',
    episode: 4,
    guests: ['Juliana Oliveira', 'Contador Especialista'],
    duration: '41 min',
    date: '2024-02-21',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
    tags: ['Criptoativos', 'Tributário', 'Compliance'],
  },
  {
    id: 'podcast-5',
    title: 'Legal Design: Inovação na Prática Jurídica',
    description: 'Como o legal design está transformando a forma como criamos e apresentamos documentos jurídicos, com exemplos práticos e cases de sucesso.',
    episode: 5,
    guests: ['Fernando Alves', 'Designer', 'Head de Inovação'],
    duration: '38 min',
    date: '2024-03-06',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
    tags: ['Legal Design', 'Inovação', 'Contratos'],
  },
  {
    id: 'podcast-6',
    title: 'Crimes Digitais: Prevenção e Resposta a Incidentes',
    description: 'Discutimos as principais ameaças digitais enfrentadas por empresas, como prevenir ataques e como responder adequadamente quando incidentes ocorrem.',
    episode: 6,
    guests: ['Pedro Rodrigues', 'CISO', 'Perito Digital'],
    duration: '50 min',
    date: '2024-03-20',
    youtubeUrl: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    tags: ['Segurança', 'Crimes Digitais', 'Compliance'],
  },
];
