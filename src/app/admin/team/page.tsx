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

interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  expertise: string[];
  imageUrl: string | null;
  linkedinUrl: string | null;
  email: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TeamListPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error('Falha ao buscar membros');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      toast.error('Erro ao carregar membros do time');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, active: !member.active }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar membro');
      toast.success(`Membro ${!member.active ? 'ativado' : 'desativado'}`);
      fetchMembers();
    } catch (error) {
      toast.error('Erro ao atualizar membro');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir membro');
      toast.success('Membro excluido com sucesso');
      fetchMembers();
    } catch (error) {
      toast.error('Erro ao excluir membro');
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
          <h2 className="text-2xl font-bold text-gray-900">Time</h2>
          <p className="text-gray-500 mt-1">Gerencie os membros do time</p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Membro
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Nenhum membro encontrado
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-gray-500">{member.role || '-'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={member.active}
                      onCheckedChange={() => handleToggleActive(member)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/team/${member.id}`)}
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
                              Tem certeza que deseja excluir o membro &quot;{member.name}&quot;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member.id)}
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
