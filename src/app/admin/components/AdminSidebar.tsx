"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Home,
  Briefcase,
  Users,
  Newspaper,
  Mic,
  Info,
  Lightbulb,
  Menu,
  ImageIcon,
  MessageSquare,
  Scale,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Configurações", href: "/admin/settings", icon: Settings },
  { title: "Home", href: "/admin/home", icon: Home },
  { title: "Serviços", href: "/admin/services", icon: Briefcase },
  { title: "Time", href: "/admin/team", icon: Users },
  { title: "Mídia", href: "/admin/media", icon: Newspaper },
  { title: "Podcasts", href: "/admin/podcasts", icon: Mic },
  { title: "Sobre", href: "/admin/about", icon: Info },
  { title: "Innovation Lab", href: "/admin/innovation", icon: Lightbulb },
  { title: "Navegação", href: "/admin/navigation", icon: Menu },
  { title: "Imagens", href: "/admin/images", icon: ImageIcon },
  { title: "Mensagens", href: "/admin/contact", icon: MessageSquare },
  { title: "Páginas Legais", href: "/admin/legal", icon: Scale },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contact');
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.filter((s: { read: boolean }) => !s.read).length);
      } catch {
        // silently fail
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-bold">
            T
          </div>
          <span className="text-lg font-semibold text-gray-900">Teixeira Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.href === "/admin/contact" && unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[11px] font-medium text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
