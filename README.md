# Site Institucional Premium - LEX

Site institucional minimalista e elegante desenvolvido com Next.js, TypeScript, Tailwind CSS e Framer Motion.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animações)
- **Google Fonts** (Playfair Display + Inter)

## 📁 Estrutura do Projeto

```
premium-site/
├── src/
│   ├── app/                    # Páginas e rotas
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Home
│   │   ├── sobre/             # Página Sobre
│   │   ├── servicos/          # Listagem e detalhes de serviços
│   │   ├── innovation-lab/    # Innovation Lab
│   │   ├── time/              # Listagem e perfis do time
│   │   ├── midia/             # Artigos e posts
│   │   ├── podcast/           # Listagem de podcasts
│   │   └── contato/           # Formulário de contato
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Section.tsx
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   ├── CTAButton.tsx
│   │   ├── Container.tsx
│   │   ├── SocialLinks.tsx
│   │   ├── AnimatedSection.tsx
│   │   └── MobileMenu.tsx
│   ├── content/               # Dados estáticos
│   │   ├── services.ts
│   │   ├── team.ts
│   │   ├── media.ts
│   │   └── podcasts.ts
│   └── lib/
│       └── utils.ts           # Funções utilitárias
├── public/
│   └── images/               # Imagens estáticas
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Características

### Design
- Paleta minimalista: fundo escuro (#0B0F1A) com destaques dourados (#C9A227)
- Tipografia elegante: Playfair Display (títulos) + Inter (corpo)
- Espaçamento generoso e alto contraste
- Animações suaves com Framer Motion
- Totalmente responsivo (mobile-first)

### Funcionalidades
- **8 páginas principais**: Home, Sobre, Serviços, Innovation Lab, Time, Mídia, Podcast, Contato
- **Rotas dinâmicas**: `/servicos/[slug]`, `/time/[slug]`, `/midia/[slug]`
- **Navegação sticky** com menu hamburguer no mobile
- **Animações on-scroll** com Framer Motion
- **SEO otimizado** com metadata e Open Graph
- **Acessibilidade**: ARIA labels, foco visível, contraste adequado

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Clone ou navegue até o diretório**
```bash
cd premium-site
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

## 📦 Build para Produção

```bash
npm run build
npm run start
```

## 🎯 Páginas e Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home com hero, números, serviços, time, mídia e podcast |
| `/sobre` | Página institucional com história e valores |
| `/servicos` | Lista de todos os serviços |
| `/servicos/[slug]` | Detalhe de cada serviço |
| `/innovation-lab` | Produtos e soluções tecnológicas |
| `/time` | Lista de membros do time |
| `/time/[slug]` | Perfil detalhado de cada membro |
| `/midia` | Artigos e publicações |
| `/midia/[slug]` | Artigo completo |
| `/podcast` | Lista de episódios |
| `/contato` | Formulário de contato |

## 🎨 Customização

### Cores
Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: '#0B0F1A',      // Fundo principal
  accent: '#C9A227',       // Cor de destaque
  // ...
}
```

### Conteúdo
Os dados estão em `/src/content/`:
- `services.ts` - Lista de serviços
- `team.ts` - Membros do time
- `media.ts` - Artigos/posts
- `podcasts.ts` - Episódios de podcast

### Componentes
Todos os componentes são reutilizáveis e estão em `/src/components/`

## 📱 Responsividade

- **Mobile**: Menu hamburguer, layout de coluna única
- **Tablet**: Grid de 2 colunas
- **Desktop**: Grid de 3 colunas, menu horizontal completo

## ♿ Acessibilidade

- Labels em todos os inputs
- ARIA labels em ícones e botões
- Contraste de cores adequado (WCAG AA)
- Navegação por teclado
- Estados de foco visíveis

## 🚀 Performance

- **Next.js Image**: Otimização automática de imagens
- **Lazy loading**: Carregamento sob demanda
- **Code splitting**: Divisão automática de código
- **Static Generation**: Páginas pré-renderizadas

## 📝 Notas

- As imagens são placeholders do Unsplash
- O formulário de contato imprime no console (implementar backend)
- Links de redes sociais são placeholders
- Todos os dados são mockados (sem CMS externo)

## 🤝 Contribuindo

Para modificar ou expandir o projeto:

1. Adicione novos serviços em `/src/content/services.ts`
2. Adicione membros do time em `/src/content/team.ts`
3. Crie novos componentes em `/src/components/`
4. Adicione novas páginas em `/src/app/`

## 📄 Licença

Este é um projeto exemplo/template para fins educacionais.

---

Desenvolvido com ❤️ usando Next.js e Tailwind CSS
