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
import DynamicIcon from '@/components/DynamicIcon';

interface InnovationProduct {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function InnovationListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<InnovationProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/innovation');
      if (!res.ok) throw new Error('Falha ao buscar produtos');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Erro ao carregar produtos de inovacao');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (product: InnovationProduct) => {
    try {
      const res = await fetch(`/api/innovation/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, active: !product.active }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar produto');
      toast.success(`Produto ${!product.active ? 'ativado' : 'desativado'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/innovation/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir produto');
      toast.success('Produto excluido com sucesso');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao excluir produto');
      console.error(error);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Innovation Lab</h2>
          <p className="text-gray-500 mt-1">Gerencie os produtos de inovacao</p>
        </div>
        <Button asChild>
          <Link href="/admin/innovation/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Icone</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.icon ? (
                      <DynamicIcon name={product.icon} size={20} className="text-gray-600" />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.active}
                      onCheckedChange={() => handleToggleActive(product)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/innovation/${product.id}`)}
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
                              Tem certeza que deseja excluir o produto &quot;{product.title}&quot;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
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
