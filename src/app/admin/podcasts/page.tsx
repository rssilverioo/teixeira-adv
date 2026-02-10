'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  episode: number;
  guests: string[];
  duration: string | null;
  date: string;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PodcastsListPage() {
  const router = useRouter();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/podcasts');
      if (!res.ok) throw new Error('Falha ao buscar podcasts');
      const data = await res.json();
      setPodcasts(data);
    } catch (error) {
      toast.error('Erro ao carregar podcasts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleToggleActive = async (podcast: Podcast) => {
    try {
      const res = await fetch(`/api/podcasts/${podcast.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...podcast, active: !podcast.active }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar podcast');
      toast.success(`Podcast ${!podcast.active ? 'ativado' : 'desativado'}`);
      fetchPodcasts();
    } catch (error) {
      toast.error('Erro ao atualizar podcast');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/podcasts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir podcast');
      toast.success('Podcast excluido com sucesso');
      fetchPodcasts();
    } catch (error) {
      toast.error('Erro ao excluir podcast');
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Podcasts</h2>
          <p className="text-gray-500 mt-1">Gerencie os episodios de podcast</p>
        </div>
        <Button asChild>
          <Link href="/admin/podcasts/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Episodio
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Episodio</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Duracao</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {podcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Nenhum podcast encontrado
                </TableCell>
              </TableRow>
            ) : (
              podcasts.map((podcast) => (
                <TableRow key={podcast.id}>
                  <TableCell className="font-mono font-bold text-center">
                    #{podcast.episode}
                  </TableCell>
                  <TableCell className="font-medium">{podcast.title}</TableCell>
                  <TableCell className="text-gray-500">{podcast.duration || '-'}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(podcast.date)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={podcast.active}
                      onCheckedChange={() => handleToggleActive(podcast)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/podcasts/${podcast.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o podcast &quot;{podcast.title}&quot;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(podcast.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
