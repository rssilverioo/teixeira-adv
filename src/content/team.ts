export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image: string;
  linkedin: string;
  email: string;
}

export const team: TeamMember[] = [
  {
    slug: 'ana-silva',
    name: 'Ana Silva',
    role: 'Sócia Fundadora',
    bio: `Ana Silva é sócia fundadora e lidera a prática de Direito Digital e Proteção de Dados. Com mais de 15 anos de experiência, Ana é reconhecida como uma das principais especialistas em LGPD do país.

Formada pela Universidade de São Paulo, com mestrado em Direito Digital pela Universidade de Coimbra, Ana assessora grandes corporações e startups em suas jornadas de adequação à LGPD e transformação digital.

Autora de diversos artigos sobre privacidade e proteção de dados, Ana é palestrante frequente em eventos do setor e professora convidada em programas de pós-graduação.`,
    expertise: ['LGPD', 'Direito Digital', 'Compliance', 'Transformação Digital'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    linkedin: 'https://linkedin.com',
    email: 'ana.silva@exemplo.com',
  },
  {
    slug: 'carlos-mendes',
    name: 'Carlos Mendes',
    role: 'Sócio',
    bio: `Carlos Mendes é sócio responsável pela área de Societário e M&A. Com vasta experiência em transações complexas, Carlos já liderou operações que somam mais de R$ 5 bilhões em valor.

Graduado pela FGV Direito SP e com MBA pela Columbia Business School, Carlos combina expertise jurídica com profundo conhecimento de negócios.

Sua atuação abrange desde startups em rodadas seed até grandes operações de fusões e aquisições, sempre com foco em soluções criativas e eficientes.`,
    expertise: ['M&A', 'Direito Societário', 'Venture Capital', 'Governança Corporativa'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    linkedin: 'https://linkedin.com',
    email: 'carlos.mendes@exemplo.com',
  },
  {
    slug: 'beatriz-santos',
    name: 'Beatriz Santos',
    role: 'Sócia',
    bio: `Beatriz Santos lidera a prática de Propriedade Intelectual e Gaming. Com formação em Direito e Ciência da Computação, Beatriz traz uma perspectiva única para questões de tecnologia e inovação.

Reconhecida internacionalmente por sua expertise em direito de games e esports, Beatriz assessora as principais organizações e desenvolvedoras do setor no Brasil e América Latina.

Beatriz é co-autora do livro "Direito e Games: Aspectos Jurídicos da Indústria" e ministra cursos sobre o tema em diversas instituições.`,
    expertise: ['Propriedade Intelectual', 'Gaming', 'Esports', 'Inovação'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600',
    linkedin: 'https://linkedin.com',
    email: 'beatriz.santos@exemplo.com',
  },
  {
    slug: 'rafael-costa',
    name: 'Rafael Costa',
    role: 'Advogado Sênior',
    bio: `Rafael Costa é advogado sênior especializado em Startups e Venture Capital. Sua paixão por empreendedorismo e inovação o levou a trabalhar diretamente com o ecossistema de startups.

Com passagens por aceleradoras e fundos de investimento, Rafael entende profundamente os desafios jurídicos enfrentados por empresas em crescimento acelerado.

Rafael é mentor em diversos programas de aceleração e contribui ativamente para o desenvolvimento do ecossistema de inovação brasileiro.`,
    expertise: ['Startups', 'Venture Capital', 'Contratos', 'Investimentos'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
    linkedin: 'https://linkedin.com',
    email: 'rafael.costa@exemplo.com',
  },
  {
    slug: 'juliana-oliveira',
    name: 'Juliana Oliveira',
    role: 'Advogada Sênior',
    bio: `Juliana Oliveira é advogada sênior com foco em Direito Tributário e Nova Economia. Especialista em tributação de tecnologia e criptoativos, Juliana está na vanguarda das discussões sobre tributação da economia digital.

Mestre em Direito Tributário pela USP, Juliana combina sólida formação acadêmica com experiência prática em planejamento tributário complexo.

Autora de diversos artigos sobre tributação de criptoativos e economia digital, Juliana é referência no tema e palestrante em eventos nacionais e internacionais.`,
    expertise: ['Direito Tributário', 'Criptoativos', 'Planejamento Tributário', 'Compliance Fiscal'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    linkedin: 'https://linkedin.com',
    email: 'juliana.oliveira@exemplo.com',
  },
  {
    slug: 'fernando-alves',
    name: 'Fernando Alves',
    role: 'Advogado',
    bio: `Fernando Alves atua na área de Contratos e Direito Digital. Com expertise em elaboração e negociação de contratos complexos de tecnologia, Fernando utiliza metodologias de legal design para criar documentos mais claros e efetivos.

Graduado pela PUC-SP com especialização em Direito Contratual, Fernando tem especial interesse em contratos de software, cloud computing e transformação digital.

Fernando também contribui para o desenvolvimento de ferramentas de automação contratual no Innovation Lab do escritório.`,
    expertise: ['Contratos', 'Legal Design', 'Direito Digital', 'Automação'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    linkedin: 'https://linkedin.com',
    email: 'fernando.alves@exemplo.com',
  },
  {
    slug: 'mariana-pereira',
    name: 'Mariana Pereira',
    role: 'Advogada',
    bio: `Mariana Pereira é advogada com foco em Resolução de Conflitos e Arbitragem. Certificada como mediadora e árbitro, Mariana acredita na resolução eficiente de disputas como forma de preservar relacionamentos e reduzir custos.

Formada pela FGV com especialização em Métodos Alternativos de Resolução de Conflitos, Mariana atua tanto em mediações quanto em arbitragens comerciais complexas.

Mariana também ministra treinamentos sobre técnicas de negociação e resolução de conflitos para equipes jurídicas corporativas.`,
    expertise: ['Arbitragem', 'Mediação', 'Negociação', 'Resolução de Conflitos'],
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
    linkedin: 'https://linkedin.com',
    email: 'mariana.pereira@exemplo.com',
  },
  {
    slug: 'pedro-rodrigues',
    name: 'Pedro Rodrigues',
    role: 'Advogado',
    bio: `Pedro Rodrigues é advogado especializado em Crimes Digitais e Segurança da Informação. Com formação complementar em Segurança Cibernética, Pedro combina conhecimento jurídico e técnico para oferecer soluções abrangentes.

Sua atuação envolve desde a prevenção de fraudes digitais até a condução de investigações forenses e litígio em casos de crimes cibernéticos.

Pedro também atua como consultor em compliance de segurança da informação, ajudando empresas a implementar políticas e procedimentos de proteção de dados.`,
    expertise: ['Crimes Digitais', 'Segurança da Informação', 'Perícia Digital', 'Compliance'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600',
    linkedin: 'https://linkedin.com',
    email: 'pedro.rodrigues@exemplo.com',
  },
];
