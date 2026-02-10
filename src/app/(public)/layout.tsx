import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteSettings, getNavItems } from '@/lib/data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navItems] = await Promise.all([
    getSiteSettings(),
    getNavItems(),
  ]);

  const navData = navItems.map(item => ({ label: item.label, href: item.href }));

  return (
    <>
      <Navbar navItems={navData} siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
