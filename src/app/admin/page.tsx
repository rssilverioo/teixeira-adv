import {
  Briefcase,
  Users,
  Newspaper,
  Mic,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [services, members, articles, podcasts, images] = await Promise.all([
    prisma.service.count(),
    prisma.teamMember.count(),
    prisma.mediaPost.count(),
    prisma.podcast.count(),
    prisma.image.count(),
  ]);

  return { services, members, articles, podcasts, images };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total de Servicos",
      value: stats.services,
      icon: Briefcase,
    },
    {
      title: "Total de Membros",
      value: stats.members,
      icon: Users,
    },
    {
      title: "Total de Artigos",
      value: stats.articles,
      icon: Newspaper,
    },
    {
      title: "Total de Podcasts",
      value: stats.podcasts,
      icon: Mic,
    },
    {
      title: "Total de Imagens",
      value: stats.images,
      icon: ImageIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bem-vindo ao Painel Administrativo
        </h2>
        <p className="text-gray-500 mt-1">
          Gerencie o conteudo do seu site a partir daqui.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="bg-white border-gray-200 shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
