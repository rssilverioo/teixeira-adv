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
import { Badge } from '@/components/ui/badge';
import DynamicIcon from '@/components/DynamicIcon';

interface Service {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesListPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Falha ao buscar servicos');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error('Erro ao carregar servicos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, active: !service.active }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar servico');
      toast.success(`Servico ${!service.active ? 'ativado' : 'desativado'}`);
      fetchServices();
    } catch (error) {
      toast.error('Erro ao atualizar servico');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir servico');
      toast.success('Servico excluido com sucesso');
      fetchServices();
    } catch (error) {
      toast.error('Erro ao excluir servico');
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
          <h2 className="text-2xl font-bold text-gray-900">Servicos</h2>
          <p className="text-gray-500 mt-1">Gerencie os servicos do site</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Servico
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Icone</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Nenhum servico encontrado
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {service.icon ? (
                      <DynamicIcon name={service.icon} size={20} className="text-gray-600" />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {service.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.active}
                      onCheckedChange={() => handleToggleActive(service)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/services/${service.id}`)}
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
                              Tem certeza que deseja excluir o servico &quot;{service.title}&quot;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(service.id)}
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
