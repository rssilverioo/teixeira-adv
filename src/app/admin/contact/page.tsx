'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, Mail, MailOpen, ChevronDown, ChevronUp, Building2, Phone } from 'lucide-react';
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

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const subjectLabels: Record<string, string> = {
  consultoria: 'Consultoria Jurídica',
  lgpd: 'LGPD e Privacidade',
  contratos: 'Contratos',
  startups: 'Startups',
  propriedade: 'Propriedade Intelectual',
  outros: 'Outros',
};

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/contact');
      if (!res.ok) throw new Error('Falha ao buscar mensagens');
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      toast.error('Erro ao carregar mensagens');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar');
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, read: !currentRead } : s))
      );
      toast.success(!currentRead ? 'Marcada como lida' : 'Marcada como não lida');
    } catch (error) {
      toast.error('Erro ao atualizar mensagem');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      toast.success('Mensagem excluída');
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      toast.error('Erro ao excluir mensagem');
      console.error(error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

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
          <h2 className="text-2xl font-bold text-gray-900">Mensagens</h2>
          <p className="text-gray-500 mt-1">
            {submissions.length === 0
              ? 'Nenhuma mensagem recebida'
              : `${submissions.length} mensagen${submissions.length !== 1 ? 's' : ''} recebida${submissions.length !== 1 ? 's' : ''}`}
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({unreadCount} não lida{unreadCount !== 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-10">Status</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Nenhuma mensagem recebida ainda
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <>
                  <TableRow
                    key={sub.id}
                    className={`cursor-pointer hover:bg-gray-50 ${!sub.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => toggleExpand(sub.id)}
                  >
                    <TableCell className="text-gray-400">
                      {expandedId === sub.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className={`${!sub.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {sub.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {subjectLabels[sub.subject] || sub.subject}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{formatDate(sub.createdAt)}</TableCell>
                    <TableCell>
                      {!sub.read && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" title="Não lida" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRead(sub.id, sub.read)}
                          title={sub.read ? 'Marcar como não lida' : 'Marcar como lida'}
                        >
                          {sub.read ? (
                            <Mail className="h-4 w-4 text-gray-400" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-blue-500" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a mensagem de &quot;{sub.name}&quot;? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sub.id)}
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
                  {expandedId === sub.id && (
                    <TableRow key={`${sub.id}-detail`}>
                      <TableCell colSpan={7} className="bg-gray-50 px-8 py-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {sub.phone && (
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {sub.phone}
                              </span>
                            )}
                            {sub.company && (
                              <span className="flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5" />
                                {sub.company}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Mensagem</p>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
