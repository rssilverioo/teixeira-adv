'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface MediaPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  date: string;
  category: string | null;
  tags: string[];
  imageUrl: string | null;
  readTime: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MediaListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error('Falha ao buscar artigos');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('Erro ao carregar artigos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir artigo');
      toast.success('Artigo excluido com sucesso');
      fetchPosts();
    } catch (error) {
      toast.error('Erro ao excluir artigo');
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
          <h2 className="text-2xl font-bold text-gray-900">Midia</h2>
          <p className="text-gray-500 mt-1">Gerencie os artigos e publicacoes</p>
        </div>
        <Button asChild>
          <Link href="/admin/media/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Nenhum artigo encontrado
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-12 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-8 rounded bg-gray-200" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell className="text-gray-500">{post.author || '-'}</TableCell>
                  <TableCell>
                    {post.category ? (
                      <Badge variant="secondary">{post.category}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500">{formatDate(post.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/media/${post.id}`)}
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
                              Tem certeza que deseja excluir o artigo &quot;{post.title}&quot;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
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
