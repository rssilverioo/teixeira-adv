'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NavItemForm {
  label: string;
  href: string;
  order: number;
  active: boolean;
}

const defaultForm: NavItemForm = {
  label: '',
  href: '',
  order: 0,
  active: true,
};

export default function NavigationAdminPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NavItemForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  // Dialog state for adding new item
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState<NavItemForm>(defaultForm);
  const [savingNew, setSavingNew] = useState(false);

  const fetchNavItems = async () => {
    try {
      const res = await fetch('/api/navigation');
      if (!res.ok) throw new Error('Falha ao buscar itens de navegacao');
      const data = await res.json();
      setNavItems(data);
    } catch (error) {
      toast.error('Erro ao carregar itens de navegacao');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavItems();
  }, []);

  const handleToggleActive = async (item: NavItem) => {
    try {
      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, label: item.label, href: item.href, order: item.order, active: !item.active }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar item');
      toast.success(`Item ${!item.active ? 'ativado' : 'desativado'}`);
      fetchNavItems();
    } catch (error) {
      toast.error('Erro ao atualizar item');
      console.error(error);
    }
  };

  const handleStartEdit = (item: NavItem) => {
    setEditingId(item.id);
    setEditForm({
      label: item.label,
      href: item.href,
      order: item.order,
      active: item.active,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(defaultForm);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm.label.trim() || !editForm.href.trim()) {
      toast.error('Label e Href sao obrigatorios');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          label: editForm.label,
          href: editForm.href,
          order: Number(editForm.order),
          active: editForm.active,
        }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar item');
      toast.success('Item atualizado com sucesso');
      setEditingId(null);
      setEditForm(defaultForm);
      fetchNavItems();
    } catch (error) {
      toast.error('Erro ao atualizar item');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = async () => {
    if (!newForm.label.trim() || !newForm.href.trim()) {
      toast.error('Label e Href sao obrigatorios');
      return;
    }

    setSavingNew(true);
    try {
      const res = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newForm.label,
          href: newForm.href,
          order: Number(newForm.order),
          active: newForm.active,
        }),
      });
      if (!res.ok) throw new Error('Falha ao criar item');
      toast.success('Item criado com sucesso');
      setDialogOpen(false);
      setNewForm(defaultForm);
      fetchNavItems();
    } catch (error) {
      toast.error('Erro ao criar item');
      console.error(error);
    } finally {
      setSavingNew(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/navigation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Falha ao excluir item');
      toast.success('Item excluido com sucesso');
      fetchNavItems();
    } catch (error) {
      toast.error('Erro ao excluir item');
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
          <h2 className="text-2xl font-bold text-gray-900">Navegacao</h2>
          <p className="text-gray-500 mt-1">Gerencie os itens do menu de navegacao</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setNewForm(defaultForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Novo Item de Navegacao</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-label">Label</Label>
                <Input
                  id="new-label"
                  value={newForm.label}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Ex: Servicos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-href">Href</Label>
                <Input
                  id="new-href"
                  value={newForm.href}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, href: e.target.value }))}
                  placeholder="Ex: /servicos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-order">Ordem</Label>
                <Input
                  id="new-order"
                  type="number"
                  value={newForm.order}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="new-active">Ativo</Label>
                <Switch
                  id="new-active"
                  checked={newForm.active}
                  onCheckedChange={(checked) => setNewForm((prev) => ({ ...prev, active: checked }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateNew} disabled={savingNew}>
                  {savingNew ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Ordem</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Href</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {navItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Nenhum item de navegacao encontrado
                </TableCell>
              </TableRow>
            ) : (
              navItems.map((item) => (
                <TableRow key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.order}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                          className="h-8 text-sm w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.label}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, label: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.href}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, href: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={editForm.active}
                          onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, active: checked }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700"
                            onClick={() => handleSaveEdit(item.id)}
                            disabled={saving}
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-mono text-sm">{item.order}</TableCell>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell className="text-gray-500 font-mono text-sm">{item.href}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={() => handleToggleActive(item)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(item)}
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
                                  Tem certeza que deseja excluir o item &quot;{item.label}&quot;? Esta acao nao pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
