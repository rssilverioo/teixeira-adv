"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import { AdminSidebar } from "./components/AdminSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import "./admin.css";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/admin/login");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <SessionProvider>
        <div className="admin-theme">
          {children}
          <Toaster richColors position="top-right" theme="light" />
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AuthGuard>
        <div className="admin-theme min-h-screen bg-white text-gray-900">
          <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm font-semibold text-gray-900">
                  Painel Admin
                </h1>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
                  >
                    <Link href="/admin/profile">
                      <UserCircle className="h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </header>
              <main className="flex-1 p-6 bg-gray-50">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster richColors position="top-right" theme="light" />
        </div>
      </AuthGuard>
    </SessionProvider>
  );
}
