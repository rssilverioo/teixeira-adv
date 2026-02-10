import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // ─── Users ───────────────────────────────────────────────────
  const masterPassword = await bcrypt.hash('admin123', 10)
  const master = await prisma.user.upsert({
    where: { email: 'rodrigo.silverio@inovitdigital.com.br' },
    update: { password: masterPassword, role: 'MASTER' },
    create: {
      name: 'Rodrigo Silverio',
      email: 'rodrigo.silverio@inovitdigital.com.br',
      password: masterPassword,
      role: 'MASTER',
    },
  })
  console.log('Master user created:', master.email)

  const adminPassword = await bcrypt.hash('123mudar', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.email)

  // ─── Site Settings (singleton) ────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      siteName: 'LEX',
      siteTitle: 'LEX - Escritório de Advocacia Premium',
      siteDescription:
        'Escritório de advocacia especializado em direito digital, tecnologia e inovação. Soluções jurídicas para a nova economia.',
      colorPrimary: '#0B0F1A',
      colorPrimaryLight: '#1A1F2E',
      colorAccent: '#C9A227',
      colorAccentLight: '#D4B550',
      colorAccentDark: '#A68519',
      keywords: [
        'advocacia',
        'direito digital',
        'LGPD',
        'startups',
        'tecnologia',
        'inovação',
      ],
      address:
        'Avenida Paulista, 1000, Conjunto 1501, São Paulo - SP, 01310-100',
      phone: '+55 (11) 3333-4444',
      email: 'contato@exemplo.com',
      workingHours: 'Segunda a Sexta, 9h às 18h',
      copyrightText: '© 2024 LEX. Todos os direitos reservados.',
    },
    create: {
      id: 'default',
      siteName: 'LEX',
      siteTitle: 'LEX - Escritório de Advocacia Premium',
      siteDescription:
        'Escritório de advocacia especializado em direito digital, tecnologia e inovação. Soluções jurídicas para a nova economia.',
      colorPrimary: '#0B0F1A',
      colorPrimaryLight: '#1A1F2E',
      colorAccent: '#C9A227',
      colorAccentLight: '#D4B550',
      colorAccentDark: '#A68519',
      keywords: [
        'advocacia',
        'direito digital',
        'LGPD',
        'startups',
        'tecnologia',
        'inovação',
      ],
      address:
        'Avenida Paulista, 1000, Conjunto 1501, São Paulo - SP, 01310-100',
      phone: '+55 (11) 3333-4444',
      email: 'contato@exemplo.com',
      workingHours: 'Segunda a Sexta, 9h às 18h',
      copyrightText: '© 2024 LEX. Todos os direitos reservados.',
    },
  })
  console.log('Site settings seeded')

  // ─── Hero Section (singleton) ─────────────────────────────────
  await prisma.heroSection.upsert({
    where: { id: 'default' },
    update: {
      title: 'Direito para a',
      highlight: 'Nova Economia',
      subtitle:
        'Soluções jurídicas estratégicas para empresas de tecnologia, startups e negócios inovadores',
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '/contato',
      ctaSecondaryText: 'Conheça os serviços',
      ctaSecondaryLink: '/servicos',
    },
    create: {
      id: 'default',
      title: 'Direito para a',
      highlight: 'Nova Economia',
      subtitle:
        'Soluções jurídicas estratégicas para empresas de tecnologia, startups e negócios inovadores',
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '/contato',
      ctaSecondaryText: 'Conheça os serviços',
      ctaSecondaryLink: '/servicos',
    },
  })
  console.log('Hero section seeded')

  // ─── Stats ────────────────────────────────────────────────────
  await prisma.stat.deleteMany()
  await prisma.stat.createMany({
    data: [
      { number: '+12', label: 'Anos de experiência', order: 0 },
      { number: '+200', label: 'Clientes atendidos', order: 1 },
      { number: '+50', label: 'Soluções entregues', order: 2 },
      { number: '98%', label: 'Satisfação', order: 3 },
    ],
  })
  console.log('Stats seeded')

  // ─── Services ─────────────────────────────────────────────────
  await prisma.service.deleteMany()
  const services = [
    {
      slug: 'ambiental',
      title: 'Direito Ambiental',
      icon: 'Leaf',
      excerpt:
        'Consultoria especializada em conformidade ambiental e sustentabilidade corporativa.',
      content:
        '# Direito Ambiental\n\nConsultoria especializada em conformidade ambiental e sustentabilidade corporativa, ajudando empresas a operarem de forma responsável e em conformidade com a legislação vigente.\n\n## Áreas de Atuação\n\n- Licenciamento ambiental\n- Compliance ambiental corporativo\n- Auditoria e due diligence ambiental\n- Gestão de riscos ambientais\n- Contencioso ambiental\n\n## Expertise\n\nNossa equipe possui ampla experiência em assessorar empresas de diversos setores na adequação às normas ambientais, promovendo práticas sustentáveis e minimizando riscos regulatórios.',
      imageUrl:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      order: 0,
    },
    {
      slug: 'contratos',
      title: 'Contratos',
      icon: 'FileText',
      excerpt:
        'Elaboração e revisão de contratos complexos para transações nacionais e internacionais.',
      content:
        '# Contratos\n\nElaboração e revisão de contratos complexos para transações nacionais e internacionais, garantindo segurança jurídica e proteção aos interesses dos nossos clientes.\n\n## Áreas de Atuação\n\n- Contratos de tecnologia e licenciamento\n- Contratos de prestação de serviços\n- Acordos comerciais internacionais\n- Contratos de franquia e distribuição\n- Due diligence contratual\n\n## Expertise\n\nUtilizamos metodologias de legal design para criar contratos claros, eficientes e que refletem fielmente a intenção das partes envolvidas.',
      imageUrl:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      order: 1,
    },
    {
      slug: 'crimes-fraudes-digitais',
      title: 'Crimes e Fraudes Digitais',
      icon: 'Lock',
      excerpt:
        'Prevenção e combate a crimes cibernéticos e fraudes digitais.',
      content:
        '# Crimes e Fraudes Digitais\n\nPrevenção e combate a crimes cibernéticos e fraudes digitais, oferecendo suporte jurídico completo para empresas e indivíduos afetados.\n\n## Áreas de Atuação\n\n- Investigação de crimes cibernéticos\n- Resposta a incidentes de segurança\n- Perícia digital forense\n- Compliance em segurança da informação\n- Defesa em processos criminais digitais\n\n## Expertise\n\nNossa equipe combina conhecimento jurídico com expertise técnica em segurança da informação para oferecer soluções abrangentes contra ameaças digitais.',
      imageUrl:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      order: 2,
    },
    {
      slug: 'gaming-experience',
      title: 'Gaming & Experience',
      icon: 'Gamepad2',
      excerpt:
        'Assessoria jurídica especializada para a indústria de games e entretenimento digital.',
      content:
        '# Gaming & Experience\n\nAssessoria jurídica especializada para a indústria de games e entretenimento digital, abrangendo todos os aspectos legais do ecossistema.\n\n## Áreas de Atuação\n\n- Contratos de desenvolvimento e publicação\n- Propriedade intelectual em games\n- Regulação de jogos e apostas online\n- Proteção de dados em plataformas digitais\n- Direito do consumidor digital\n\n## Expertise\n\nSomos pioneiros na assessoria jurídica para a indústria de games no Brasil, com profundo conhecimento das dinâmicas e desafios do setor.',
      imageUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      order: 3,
    },
    {
      slug: 'esports',
      title: 'Esports',
      icon: 'Trophy',
      excerpt:
        'Consultoria jurídica especializada no ecossistema de esportes eletrônicos.',
      content:
        '# Esports\n\nConsultoria jurídica especializada no ecossistema de esportes eletrônicos, atendendo atletas, organizações e empresas do setor.\n\n## Áreas de Atuação\n\n- Contratos de atletas e streamers\n- Regulamentação de competições\n- Patrocínio e licenciamento de marcas\n- Direitos de transmissão e conteúdo\n- Governança de organizações de esports\n\n## Expertise\n\nAcompanhamos o crescimento do cenário competitivo brasileiro e oferecemos suporte jurídico adaptado às necessidades específicas do ecossistema de esports.',
      imageUrl:
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      order: 4,
    },
    {
      slug: 'imobiliario',
      title: 'Direito Imobiliário',
      icon: 'Building2',
      excerpt:
        'Assessoria completa em transações imobiliárias e desenvolvimento urbano.',
      content:
        '# Direito Imobiliário\n\nAssessoria completa em transações imobiliárias e desenvolvimento urbano, com foco em empreendimentos de base tecnológica.\n\n## Áreas de Atuação\n\n- Transações de compra e venda\n- Incorporações imobiliárias\n- Locações comerciais e built-to-suit\n- Due diligence imobiliária\n- Regularização fundiária\n\n## Expertise\n\nNossa equipe possui vasta experiência em operações imobiliárias complexas, combinando conhecimento técnico com visão estratégica de negócios.',
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      order: 5,
    },
    {
      slug: 'lgpd-direito-digital',
      title: 'LGPD & Direito Digital',
      icon: 'ShieldCheck',
      excerpt:
        'Conformidade com LGPD e assessoria em direito digital e tecnologia.',
      content:
        '# LGPD & Direito Digital\n\nConformidade com LGPD e assessoria em direito digital e tecnologia, garantindo que sua empresa esteja adequada às exigências legais.\n\n## Áreas de Atuação\n\n- Programa de adequação à LGPD\n- DPO as a Service\n- Políticas de privacidade e termos de uso\n- Gestão de incidentes de dados\n- Treinamento e conscientização\n\n## Expertise\n\nSomos referência nacional em proteção de dados e direito digital, com uma abordagem prática e orientada a resultados.',
      imageUrl:
        'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800',
      order: 6,
    },
    {
      slug: 'propriedade-intelectual',
      title: 'Propriedade Intelectual',
      icon: 'Lightbulb',
      excerpt:
        'Proteção e gestão estratégica de ativos de propriedade intelectual.',
      content:
        '# Propriedade Intelectual\n\nProteção e gestão estratégica de ativos de propriedade intelectual, maximizando o valor dos ativos intangíveis dos nossos clientes.\n\n## Áreas de Atuação\n\n- Registro de marcas e patentes\n- Direitos autorais e software\n- Segredos de negócio e know-how\n- Licenciamento de tecnologia\n- Contencioso de PI\n\n## Expertise\n\nNossa equipe multidisciplinar combina conhecimento jurídico com entendimento técnico para proteger e valorizar os ativos intelectuais das empresas.',
      imageUrl:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      order: 7,
    },
    {
      slug: 'societario-ma',
      title: 'Societário & M&A',
      icon: 'BarChart3',
      excerpt:
        'Assessoria em operações societárias, fusões e aquisições.',
      content:
        '# Societário & M&A\n\nAssessoria em operações societárias, fusões e aquisições, oferecendo suporte completo em todas as etapas das transações.\n\n## Áreas de Atuação\n\n- Fusões e aquisições\n- Reestruturações societárias\n- Joint ventures e parcerias estratégicas\n- Governança corporativa\n- Due diligence societária\n\n## Expertise\n\nPossumimos vasta experiência em transações complexas envolvendo empresas de tecnologia, com histórico de operações que somam bilhões em valor.',
      imageUrl:
        'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800',
      order: 8,
    },
    {
      slug: 'resolucao-de-conflitos',
      title: 'Resolução de Conflitos',
      icon: 'Scale',
      excerpt:
        'Mediação, arbitragem e métodos alternativos de resolução de disputas.',
      content:
        '# Resolução de Conflitos\n\nMediação, arbitragem e métodos alternativos de resolução de disputas, buscando soluções eficientes e menos adversariais.\n\n## Áreas de Atuação\n\n- Arbitragem nacional e internacional\n- Mediação empresarial\n- Negociação estratégica\n- Dispute boards\n- Contencioso estratégico\n\n## Expertise\n\nNossa equipe é reconhecida pela excelência em resolução alternativa de disputas, com ampla experiência em câmaras arbitrais e mediações complexas.',
      imageUrl:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      order: 9,
    },
    {
      slug: 'startups',
      title: 'Startups',
      icon: 'Rocket',
      excerpt:
        'Assessoria jurídica especializada para startups e ecossistema de inovação.',
      content:
        '# Startups\n\nAssessoria jurídica especializada para startups e ecossistema de inovação, acompanhando empreendedores em todas as fases do negócio.\n\n## Áreas de Atuação\n\n- Constituição e estruturação societária\n- Rodadas de investimento\n- Vesting e stock options\n- Contratos de tecnologia\n- Compliance regulatório\n\n## Expertise\n\nEntendemos a dinâmica das startups e oferecemos assessoria jurídica ágil, prática e alinhada às necessidades do ecossistema de inovação.',
      imageUrl:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      order: 10,
    },
    {
      slug: 'trabalhista-estrategico',
      title: 'Trabalhista Estratégico',
      icon: 'Users',
      excerpt:
        'Consultoria trabalhista preventiva e estratégica para empresas.',
      content:
        '# Trabalhista Estratégico\n\nConsultoria trabalhista preventiva e estratégica para empresas, com foco na prevenção de passivos e otimização de relações de trabalho.\n\n## Áreas de Atuação\n\n- Consultoria trabalhista preventiva\n- Relações sindicais e negociações coletivas\n- Contencioso trabalhista estratégico\n- Modelos de contratação flexíveis\n- Compliance trabalhista\n\n## Expertise\n\nNossa abordagem estratégica em direito trabalhista ajuda empresas de tecnologia a navegar as complexidades das relações de trabalho modernas.',
      imageUrl:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      order: 11,
    },
    {
      slug: 'tributario-nova-economia',
      title: 'Tributário & Nova Economia',
      icon: 'Coins',
      excerpt:
        'Planejamento tributário especializado para empresas de tecnologia e inovação.',
      content:
        '# Tributário & Nova Economia\n\nPlanejamento tributário especializado para empresas de tecnologia e inovação, otimizando a carga fiscal de forma legal e estratégica.\n\n## Áreas de Atuação\n\n- Planejamento tributário para tech companies\n- Tributação de criptoativos e tokens\n- Incentivos fiscais para inovação\n- Contencioso tributário\n- Compliance fiscal\n\n## Expertise\n\nNossa equipe possui profundo conhecimento da tributação aplicável à nova economia, oferecendo soluções criativas e seguras para otimização fiscal.',
      imageUrl:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      order: 12,
    },
  ]
  await prisma.service.createMany({ data: services })
  console.log('Services seeded:', services.length)

  // ─── Team Members ─────────────────────────────────────────────
  await prisma.teamMember.deleteMany()
  const teamMembers = [
    {
      slug: 'ana-silva',
      name: 'Ana Silva',
      role: 'Sócia Fundadora',
      expertise: ['LGPD', 'Direito Digital', 'Compliance', 'Transformação Digital'],
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
      linkedinUrl: 'https://linkedin.com',
      email: 'ana.silva@exemplo.com',
      bio: 'Ana Silva é sócia fundadora e lidera a prática de Direito Digital e Proteção de Dados. Com mais de 15 anos de experiência, Ana é reconhecida como uma das principais especialistas em LGPD do país.',
      order: 0,
    },
    {
      slug: 'carlos-mendes',
      name: 'Carlos Mendes',
      role: 'Sócio',
      expertise: [
        'M&A',
        'Direito Societário',
        'Venture Capital',
        'Governança Corporativa',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      email: 'carlos.mendes@exemplo.com',
      bio: 'Carlos Mendes é sócio responsável pela área de Societário e M&A. Com vasta experiência em transações complexas, Carlos já liderou operações que somam mais de R$ 5 bilhões em valor.',
      order: 1,
    },
    {
      slug: 'beatriz-santos',
      name: 'Beatriz Santos',
      role: 'Sócia',
      expertise: ['Propriedade Intelectual', 'Gaming', 'Esports', 'Inovação'],
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600',
      email: 'beatriz.santos@exemplo.com',
      bio: 'Beatriz Santos lidera a prática de Propriedade Intelectual e Gaming. Com formação em Direito e Ciência da Computação, traz uma perspectiva única.',
      order: 2,
    },
    {
      slug: 'rafael-costa',
      name: 'Rafael Costa',
      role: 'Advogado Sênior',
      expertise: ['Startups', 'Venture Capital', 'Contratos', 'Investimentos'],
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
      email: 'rafael.costa@exemplo.com',
      bio: 'Rafael Costa é advogado sênior especializado em Startups e Venture Capital.',
      order: 3,
    },
    {
      slug: 'juliana-oliveira',
      name: 'Juliana Oliveira',
      role: 'Advogada Sênior',
      expertise: [
        'Direito Tributário',
        'Criptoativos',
        'Planejamento Tributário',
        'Compliance Fiscal',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
      email: 'juliana.oliveira@exemplo.com',
      bio: 'Juliana Oliveira é advogada sênior com foco em Direito Tributário e Nova Economia.',
      order: 4,
    },
    {
      slug: 'fernando-alves',
      name: 'Fernando Alves',
      role: 'Advogado',
      expertise: ['Contratos', 'Legal Design', 'Direito Digital', 'Automação'],
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
      email: 'fernando.alves@exemplo.com',
      bio: 'Fernando Alves atua na área de Contratos e Direito Digital com expertise em legal design.',
      order: 5,
    },
    {
      slug: 'mariana-pereira',
      name: 'Mariana Pereira',
      role: 'Advogada',
      expertise: [
        'Arbitragem',
        'Mediação',
        'Negociação',
        'Resolução de Conflitos',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
      email: 'mariana.pereira@exemplo.com',
      bio: 'Mariana Pereira é advogada com foco em Resolução de Conflitos e Arbitragem.',
      order: 6,
    },
    {
      slug: 'pedro-rodrigues',
      name: 'Pedro Rodrigues',
      role: 'Advogado',
      expertise: [
        'Crimes Digitais',
        'Segurança da Informação',
        'Perícia Digital',
        'Compliance',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600',
      email: 'pedro.rodrigues@exemplo.com',
      bio: 'Pedro Rodrigues é advogado especializado em Crimes Digitais e Segurança da Informação.',
      order: 7,
    },
  ]
  await prisma.teamMember.createMany({ data: teamMembers })
  console.log('Team members seeded:', teamMembers.length)

  // ─── Media Posts ──────────────────────────────────────────────
  await prisma.mediaPost.deleteMany()
  const mediaPosts = [
    {
      slug: 'lgpd-tres-anos-desafios-oportunidades',
      title:
        'LGPD Três Anos Depois: Desafios e Oportunidades para as Empresas',
      author: 'Ana Silva',
      date: new Date('2024-01-15'),
      category: 'Artigo',
      tags: ['LGPD', 'Privacidade', 'Compliance'],
      imageUrl:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      readTime: '8 min',
      excerpt:
        'Análise dos principais desafios e oportunidades que a LGPD trouxe para o cenário corporativo brasileiro.',
      content:
        '# LGPD Três Anos Depois\n\nApós três anos da entrada em vigor da Lei Geral de Proteção de Dados, o cenário de privacidade no Brasil evoluiu significativamente.\n\n## O Cenário Atual\n\nA ANPD tem intensificado suas ações de fiscalização.\n\n## Principais Desafios\n\n- Adequação contínua\n- Cultura organizacional\n- Tecnologia e inovação',
    },
    {
      slug: 'futuro-esports-brasil',
      title: 'O Futuro dos Esports no Brasil: Perspectivas Jurídicas',
      author: 'Beatriz Santos',
      date: new Date('2024-01-20'),
      category: 'Artigo',
      tags: ['Esports', 'Gaming', 'Regulação'],
      imageUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      readTime: '7 min',
      excerpt:
        'Uma análise das tendências e desafios regulatórios que moldarão o futuro dos esportes eletrônicos no país.',
      content:
        '# O Futuro dos Esports no Brasil\n\nO mercado de esports no Brasil tem apresentado crescimento exponencial.\n\n## Desafios Regulatórios\n\n- Regulamentação da profissão\n- Contratos e relações de trabalho\n- Integridade competitiva',
    },
    {
      slug: 'venture-capital-2024',
      title: 'Venture Capital em 2024: Tendências e Mudanças Estruturais',
      author: 'Carlos Mendes',
      date: new Date('2024-02-01'),
      category: 'Artigo',
      tags: ['Venture Capital', 'Startups', 'Investimentos'],
      imageUrl:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      readTime: '6 min',
      excerpt:
        'As principais tendências do mercado de venture capital.',
      content:
        '# Venture Capital em 2024\n\nO mercado de venture capital passou por transformações significativas.\n\n## Aspectos Jurídicos\n\n- Proteções aos investidores\n- Governança\n- Alinhamento de interesses',
    },
    {
      slug: 'tributacao-criptoativos',
      title: 'Tributação de Criptoativos: Guia Completo para 2024',
      author: 'Juliana Oliveira',
      date: new Date('2024-02-05'),
      category: 'Artigo',
      tags: ['Tributário', 'Criptoativos', 'Compliance'],
      imageUrl:
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
      readTime: '9 min',
      excerpt:
        'Entenda as regras atualizadas de tributação de criptoativos.',
      content:
        '# Tributação de Criptoativos: Guia Completo\n\nA tributação de criptoativos no Brasil tem evoluído rapidamente.\n\n## Legislação Atual\n\n- Ganho de capital: 15% a 22,5%\n- Isenção até R$ 35.000/mês\n- Declaração obrigatória',
    },
    {
      slug: 'legal-design-contratos',
      title:
        'Legal Design: Transformando a Experiência com Contratos',
      author: 'Fernando Alves',
      date: new Date('2024-02-10'),
      category: 'Artigo',
      tags: ['Legal Design', 'Contratos', 'Inovação'],
      imageUrl:
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
      readTime: '6 min',
      excerpt:
        'Como o legal design está revolucionando a forma como elaboramos documentos jurídicos.',
      content:
        '# Legal Design\n\nLegal design aplica princípios de design thinking ao direito.\n\n## Aplicações Práticas\n\n- Contratos visuais\n- Linguagem simples\n- Estrutura clara',
    },
    {
      slug: 'arbitragem-startups',
      title:
        'Arbitragem como Solução para Disputas em Startups',
      author: 'Mariana Pereira',
      date: new Date('2024-02-15'),
      category: 'Artigo',
      tags: ['Arbitragem', 'Startups', 'Resolução de Conflitos'],
      imageUrl:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      readTime: '7 min',
      excerpt:
        'Por que a arbitragem é cada vez mais utilizada para resolver conflitos no ecossistema de startups.',
      content:
        '# Arbitragem em Startups\n\nNo dinâmico mundo das startups, a arbitragem tem se mostrado eficiente.\n\n## Vantagens\n\n- Velocidade\n- Confidencialidade\n- Especialização\n- Flexibilidade',
    },
  ]
  await prisma.mediaPost.createMany({ data: mediaPosts })
  console.log('Media posts seeded:', mediaPosts.length)

  // ─── Podcasts ─────────────────────────────────────────────────
  await prisma.podcast.deleteMany()
  const podcasts = [
    {
      title: 'O Futuro da Privacidade de Dados no Brasil',
      episode: 1,
      guests: ['Ana Silva', 'Especialista Convidado'],
      duration: '45 min',
      date: new Date('2024-01-10'),
      youtubeUrl: 'https://youtube.com',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
      tags: ['LGPD', 'Privacidade', 'Tecnologia'],
      description:
        'Conversamos com especialistas sobre os próximos passos da LGPD.',
    },
    {
      title: 'Startups e Venture Capital: Navegando o Novo Cenário',
      episode: 2,
      guests: ['Carlos Mendes', 'Rafael Costa', 'VC Partner'],
      duration: '52 min',
      date: new Date('2024-01-24'),
      youtubeUrl: 'https://youtube.com',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      tags: ['Startups', 'Investimentos', 'Empreendedorismo'],
      description:
        'Discussão sobre o cenário atual de venture capital e oportunidades para startups brasileiras.',
    },
    {
      title: 'Esports: Aspectos Jurídicos e Regulatórios',
      episode: 3,
      guests: ['Beatriz Santos', 'Pro Player', 'Gestor de Org'],
      duration: '48 min',
      date: new Date('2024-02-07'),
      youtubeUrl: 'https://youtube.com',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      tags: ['Esports', 'Gaming', 'Regulação'],
      description:
        'Exploramos os desafios jurídicos e regulatórios do crescente mercado de esports no Brasil.',
    },
    {
      title: 'Criptoativos e Tributação: Guia Prático',
      episode: 4,
      guests: ['Juliana Oliveira', 'Contador Especialista'],
      duration: '41 min',
      date: new Date('2024-02-21'),
      youtubeUrl: 'https://youtube.com',
      tags: ['Criptoativos', 'Tributário', 'Compliance'],
      description:
        'Guia prático sobre tributação de criptoativos e obrigações fiscais para investidores.',
    },
    {
      title: 'Legal Design: Inovação na Prática Jurídica',
      episode: 5,
      guests: ['Fernando Alves', 'Designer', 'Head de Inovação'],
      duration: '38 min',
      date: new Date('2024-03-06'),
      youtubeUrl: 'https://youtube.com',
      tags: ['Legal Design', 'Inovação', 'Contratos'],
      description:
        'Como o legal design está transformando a prática jurídica e a experiência dos clientes.',
    },
    {
      title: 'Crimes Digitais: Prevenção e Resposta a Incidentes',
      episode: 6,
      guests: ['Pedro Rodrigues', 'CISO', 'Perito Digital'],
      duration: '50 min',
      date: new Date('2024-03-20'),
      youtubeUrl: 'https://youtube.com',
      tags: ['Segurança', 'Crimes Digitais', 'Compliance'],
      description:
        'Estratégias de prevenção e resposta a incidentes de segurança e crimes digitais.',
    },
  ]
  await prisma.podcast.createMany({ data: podcasts })
  console.log('Podcasts seeded:', podcasts.length)

  // ─── Innovation Products ──────────────────────────────────────
  await prisma.innovationProduct.deleteMany()
  const innovationProducts = [
    {
      title: 'Privacy Solution',
      icon: 'Lock',
      description: 'Plataforma completa de adequação à LGPD',
      order: 0,
    },
    {
      title: 'Legal Design',
      icon: 'Palette',
      description: 'Documentos jurídicos visuais e acessíveis',
      order: 1,
    },
    {
      title: 'Jurimetria e Legal Analytics',
      icon: 'BarChart3',
      description: 'Análise de dados jurídicos',
      order: 2,
    },
    {
      title: 'Legal Software',
      icon: 'Monitor',
      description: 'Automação de processos jurídicos',
      order: 3,
    },
    {
      title: 'DPO as a Service',
      icon: 'ShieldCheck',
      description: 'Serviço de DPO terceirizado',
      order: 4,
    },
    {
      title: 'IP Solution',
      icon: 'Lightbulb',
      description: 'Gestão de propriedade intelectual',
      order: 5,
    },
    {
      title: 'IA TAX',
      icon: 'Bot',
      description: 'Planejamento tributário com IA',
      order: 6,
    },
    {
      title: 'Corporate Solutions',
      icon: 'Building2',
      description: 'Compliance e governança corporativa',
      order: 7,
    },
    {
      title: 'Legal Operation',
      icon: 'Settings',
      description: 'Consultoria em operações jurídicas',
      order: 8,
    },
  ]
  await prisma.innovationProduct.createMany({ data: innovationProducts })
  console.log('Innovation products seeded:', innovationProducts.length)

  // ─── Values ───────────────────────────────────────────────────
  await prisma.value.deleteMany()
  const values = [
    {
      title: 'Excelência',
      icon: 'Target',
      description:
        'Buscamos a excelência em tudo que fazemos, entregando soluções de alta qualidade.',
      order: 0,
    },
    {
      title: 'Inovação',
      icon: 'Rocket',
      description:
        'Utilizamos tecnologia e métodos ágeis para oferecer soluções inovadoras.',
      order: 1,
    },
    {
      title: 'Parceria',
      icon: 'Handshake',
      description:
        'Construímos relacionamentos de longo prazo baseados em confiança mútua.',
      order: 2,
    },
    {
      title: 'Transparência',
      icon: 'Compass',
      description:
        'Comunicação clara e transparente em todas as interações.',
      order: 3,
    },
    {
      title: 'Sustentabilidade',
      icon: 'Sprout',
      description:
        'Compromisso com responsabilidade social e ambiental.',
      order: 4,
    },
    {
      title: 'Conhecimento',
      icon: 'BookOpen',
      description:
        'Investimento contínuo em aprendizado e desenvolvimento.',
      order: 5,
    },
  ]
  await prisma.value.createMany({ data: values })
  console.log('Values seeded:', values.length)

  // ─── Differentiators ──────────────────────────────────────────
  await prisma.differentiator.deleteMany()
  const differentiators = [
    {
      title: 'Especialização em Tecnologia',
      description:
        'Profundo conhecimento do ecossistema de tecnologia e inovação.',
      order: 0,
    },
    {
      title: 'Metodologias Ágeis',
      description:
        'Processos eficientes e adaptados ao ritmo dos negócios digitais.',
      order: 1,
    },
    {
      title: 'Innovation Lab',
      description:
        'Desenvolvimento de soluções tecnológicas para a prática jurídica.',
      order: 2,
    },
    {
      title: 'Network Global',
      description:
        'Parcerias estratégicas com escritórios internacionais.',
      order: 3,
    },
  ]
  await prisma.differentiator.createMany({ data: differentiators })
  console.log('Differentiators seeded:', differentiators.length)

  // ─── About Page (singleton) ───────────────────────────────────
  await prisma.aboutPage.upsert({
    where: { id: 'default' },
    update: {
      title: 'Sobre o LEX',
      subtitle: 'Advocacia estratégica para a nova economia',
      historyTitle: 'Nossa História',
      historyContent:
        'Fundado em 2012, o LEX nasceu com a missão de oferecer assessoria jurídica especializada para empresas de tecnologia e inovação. Ao longo de mais de 10 anos, construímos uma reputação sólida como referência em direito digital, proteção de dados, propriedade intelectual e direito para startups.',
      historyImageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    },
    create: {
      id: 'default',
      title: 'Sobre o LEX',
      subtitle: 'Advocacia estratégica para a nova economia',
      historyTitle: 'Nossa História',
      historyContent:
        'Fundado em 2012, o LEX nasceu com a missão de oferecer assessoria jurídica especializada para empresas de tecnologia e inovação. Ao longo de mais de 10 anos, construímos uma reputação sólida como referência em direito digital, proteção de dados, propriedade intelectual e direito para startups.',
      historyImageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    },
  })
  console.log('About page seeded')

  // ─── CTA Section (singleton) ──────────────────────────────────
  await prisma.cTASection.upsert({
    where: { id: 'default' },
    update: {
      title: 'Pronto para começar?',
      description:
        'Entre em contato e descubra como podemos ajudar seu negócio a crescer com segurança jurídica.',
      buttonText: 'Fale com nosso time',
      buttonLink: '/contato',
    },
    create: {
      id: 'default',
      title: 'Pronto para começar?',
      description:
        'Entre em contato e descubra como podemos ajudar seu negócio a crescer com segurança jurídica.',
      buttonText: 'Fale com nosso time',
      buttonLink: '/contato',
    },
  })
  console.log('CTA section seeded')

  // ─── Nav Items ────────────────────────────────────────────────
  await prisma.navItem.deleteMany()
  const navItems = [
    { label: 'Início', href: '/', order: 0 },
    { label: 'Sobre', href: '/sobre', order: 1 },
    { label: 'Serviços', href: '/servicos', order: 2 },
    { label: 'Time', href: '/time', order: 3 },
    { label: 'Mídia', href: '/midia', order: 4 },
    { label: 'Podcast', href: '/podcast', order: 5 },
    { label: 'Contato', href: '/contato', order: 6 },
  ]
  await prisma.navItem.createMany({ data: navItems })
  console.log('Nav items seeded:', navItems.length)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
