'use client';

interface ThemeProviderProps {
  colors: {
    colorPrimary: string;
    colorPrimaryLight: string;
    colorAccent: string;
    colorAccentLight: string;
    colorAccentDark: string;
  };
  children: React.ReactNode;
}

function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export default function ThemeProvider({ colors, children }: ThemeProviderProps) {
  return (
    <div
      style={{
        '--site-primary-rgb': hexToRgbChannels(colors.colorPrimary),
        '--site-primary-light-rgb': hexToRgbChannels(colors.colorPrimaryLight),
        '--site-accent-rgb': hexToRgbChannels(colors.colorAccent),
        '--site-accent-light-rgb': hexToRgbChannels(colors.colorAccentLight),
        '--site-accent-dark-rgb': hexToRgbChannels(colors.colorAccentDark),
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
