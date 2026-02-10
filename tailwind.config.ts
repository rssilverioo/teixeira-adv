import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			// Site colors (dynamic via CSS variables in RGB channels for opacity support)
  			primary: {
  				DEFAULT: 'rgb(var(--site-primary-rgb, 11 15 26) / <alpha-value>)',
  				light: 'rgb(var(--site-primary-light-rgb, 26 31 46) / <alpha-value>)',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'rgb(var(--site-accent-rgb, 201 162 39) / <alpha-value>)',
  				light: 'rgb(var(--site-accent-light-rgb, 212 181 80) / <alpha-value>)',
  				dark: 'rgb(var(--site-accent-dark-rgb, 166 133 25) / <alpha-value>)',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			neutral: {
  				'50': '#F5F7FF',
  				'100': '#E8ECFF',
  				'200': '#D1D8F5',
  				'300': '#A8B2D1',
  				'400': '#6B7494',
  				'500': '#4A5270'
  			},
  			// shadcn/ui system colors
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			serif: [
  				'Playfair Display',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.6s ease-in-out',
  			'slide-up': 'slideUp 0.6s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
export default config
