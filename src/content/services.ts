export interface Service {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  icon: string;
}

export const services: Service[] = [
  {
    slug: 'ambiental',
    title: 'Direito Ambiental',
    excerpt: 'Consultoria especializada em conformidade ambiental e sustentabilidade corporativa.',
    content: `
# Direito Ambiental

Nossa prática em Direito Ambiental oferece soluções completas para empresas que buscam conformidade regulatória e sustentabilidade.

## Áreas de Atuação

- Licenciamento ambiental
- Compliance ambiental
- Due diligence ambiental
- Contencioso ambiental
- Economia circular e ESG

## Expertise

Nossa equipe possui experiência em assessorar empresas de diversos setores, desde indústrias até startups de tecnologia verde, garantindo que suas operações estejam em conformidade com a legislação ambiental vigente.
    `,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    icon: '🌿',
  },
  {
    slug: 'contratos',
    title: 'Contratos',
    excerpt: 'Elaboração e revisão de contratos complexos para transações nacionais e internacionais.',
    content: `
# Contratos

Especialização na elaboração, revisão e negociação de contratos empresariais de alta complexidade.

## Serviços

- Elaboração de contratos customizados
- Revisão e análise de riscos
- Negociação contratual
- Contratos internacionais
- Gestão de contratos

## Diferenciais

Utilizamos metodologias ágeis e ferramentas de legal design para garantir clareza e efetividade em todos os instrumentos contratuais.
    `,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    icon: '📄',
  },
  {
    slug: 'crimes-fraudes-digitais',
    title: 'Crimes e Fraudes Digitais',
    excerpt: 'Prevenção e combate a crimes cibernéticos e fraudes digitais.',
    content: `
# Crimes e Fraudes Digitais

Proteção jurídica especializada contra ameaças digitais e crimes cibernéticos.

## Áreas de Atuação

- Investigação de fraudes digitais
- Perícia forense digital
- Compliance em segurança da informação
- Litígio em crimes cibernéticos
- Proteção de reputação online

## Capacidades

Nossa equipe combina expertise jurídica com conhecimento técnico em segurança da informação para oferecer soluções abrangentes.
    `,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    icon: '🔒',
  },
  {
    slug: 'gaming-experience',
    title: 'Gaming & Experience',
    excerpt: 'Assessoria jurídica especializada para a indústria de games e entretenimento digital.',
    content: `
# Gaming & Experience

Suporte jurídico completo para empresas de games, streaming e entretenimento digital.

## Especialidades

- Contratos de desenvolvimento de games
- Propriedade intelectual em games
- Regulação de loot boxes e microtransações
- Licenciamento de IP
- Compliance com classificação indicativa

## Visão

Entendemos a dinâmica única da indústria de games e oferecemos soluções adaptadas às necessidades do setor.
    `,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    icon: '🎮',
  },
  {
    slug: 'esports',
    title: 'Esports',
    excerpt: 'Consultoria jurídica especializada no ecossistema de esportes eletrônicos.',
    content: `
# Esports

Assessoria jurídica especializada para organizações, atletas e empresas no universo dos esports.

## Serviços

- Contratos de atletas e equipes
- Organização de campeonatos
- Patrocínio e marketing em esports
- Regulamentação e compliance
- Transferências e formação de elencos

## Expertise

Atuamos com as principais organizações de esports do Brasil, oferecendo soluções inovadoras e estratégicas.
    `,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    icon: '🏆',
  },
  {
    slug: 'imobiliario',
    title: 'Direito Imobiliário',
    excerpt: 'Assessoria completa em transações imobiliárias e desenvolvimento urbano.',
    content: `
# Direito Imobiliário

Suporte jurídico em todas as fases de projetos imobiliários e transações do setor.

## Áreas de Atuação

- Incorporação imobiliária
- Compra e venda de imóveis
- Locação comercial e residencial
- Regularização fundiária
- Planejamento urbano

## Diferencial

Combinamos conhecimento técnico com visão estratégica para viabilizar projetos complexos no setor imobiliário.
    `,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    icon: '🏢',
  },
  {
    slug: 'lgpd-direito-digital',
    title: 'LGPD & Direito Digital',
    excerpt: 'Conformidade com LGPD e assessoria em direito digital e tecnologia.',
    content: `
# LGPD & Direito Digital

Consultoria especializada em proteção de dados e direito digital.

## Serviços

- Adequação à LGPD
- DPO as a Service
- Políticas de privacidade
- Contratos de tecnologia
- Compliance digital

## Metodologia

Utilizamos abordagem consultiva e tecnológica para implementar programas de privacidade efetivos e escaláveis.
    `,
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800',
    icon: '🛡️',
  },
  {
    slug: 'propriedade-intelectual',
    title: 'Propriedade Intelectual',
    excerpt: 'Proteção e gestão estratégica de ativos de propriedade intelectual.',
    content: `
# Propriedade Intelectual

Proteção completa de marcas, patentes, direitos autorais e ativos intangíveis.

## Áreas de Atuação

- Registro de marcas e patentes
- Licenciamento de PI
- Contencioso de PI
- Estratégia de portfólio
- Due diligence de PI

## Expertise

Nossa equipe combina conhecimento técnico e estratégico para maximizar o valor dos ativos de propriedade intelectual.
    `,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    icon: '💡',
  },
  {
    slug: 'societario-ma',
    title: 'Societário & M&A',
    excerpt: 'Assessoria em operações societárias, fusões e aquisições.',
    content: `
# Societário & M&A

Suporte jurídico completo em operações societárias e transações de M&A.

## Serviços

- Fusões e aquisições
- Reestruturações societárias
- Governança corporativa
- Investimentos e venture capital
- Private equity

## Capacidades

Atuamos em transações de todos os portes, desde startups em rodadas seed até grandes operações de M&A.
    `,
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800',
    icon: '📊',
  },
  {
    slug: 'resolucao-de-conflitos',
    title: 'Resolução de Conflitos',
    excerpt: 'Mediação, arbitragem e métodos alternativos de resolução de disputas.',
    content: `
# Resolução de Conflitos

Soluções estratégicas para resolução eficiente de disputas empresariais.

## Métodos

- Arbitragem comercial
- Mediação empresarial
- Dispute boards
- Negociação assistida
- Litígio estratégico

## Vantagens

Priorizamos métodos alternativos que preservam relacionamentos e reduzem custos e tempo de resolução.
    `,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    icon: '⚖️',
  },
  {
    slug: 'startups',
    title: 'Startups',
    excerpt: 'Assessoria jurídica especializada para startups e ecossistema de inovação.',
    content: `
# Startups

Suporte jurídico completo para startups em todas as fases de crescimento.

## Serviços

- Estruturação societária
- Rodadas de investimento
- Contratos de tecnologia
- Stock options e equity
- Compliance para scale-ups

## Visão

Entendemos a dinâmica das startups e oferecemos soluções ágeis e adaptadas às necessidades do ecossistema.
    `,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    icon: '🚀',
  },
  {
    slug: 'trabalhista-estrategico',
    title: 'Trabalhista Estratégico',
    excerpt: 'Consultoria trabalhista preventiva e estratégica para empresas.',
    content: `
# Trabalhista Estratégico

Assessoria trabalhista com foco em prevenção e estratégia corporativa.

## Áreas de Atuação

- Compliance trabalhista
- Reestruturações e demissões
- Políticas internas
- Contencioso trabalhista
- Relações sindicais

## Abordagem

Combinamos expertise jurídica com visão de negócios para minimizar riscos e otimizar processos.
    `,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    icon: '👥',
  },
  {
    slug: 'tributario-nova-economia',
    title: 'Tributário & Nova Economia',
    excerpt: 'Planejamento tributário especializado para empresas de tecnologia e inovação.',
    content: `
# Tributário & Nova Economia

Consultoria tributária estratégica para empresas da nova economia.

## Serviços

- Planejamento tributário
- Tributação de criptoativos
- Tributação de software e SaaS
- Incentivos fiscais
- Contencioso tributário

## Especialização

Nossa equipe está na vanguarda da tributação de novos modelos de negócio e tecnologias emergentes.
    `,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    icon: '💰',
  },
];
