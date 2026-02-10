'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DynamicIcon from '@/components/DynamicIcon';
import ImagePicker from '@/components/admin/ImagePicker';

interface ServiceForm {
  title: string;
  excerpt: string;
  content: string;
  icon: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

const defaultForm: ServiceForm = {
  title: '',
  excerpt: '',
  content: '',
  icon: '',
  imageUrl: '',
  order: 0,
  active: true,
};

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [form, setForm] = useState<ServiceForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/services/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Servico nao encontrado');
          return res.json();
        })
        .then((data) => {
          setForm({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            icon: data.icon || '',
            imageUrl: data.imageUrl || '',
            order: data.order ?? 0,
            active: data.active ?? true,
          });
        })
        .catch((error) => {
          toast.error('Erro ao carregar servico');
          console.error(error);
          router.push('/admin/services');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, router]);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('O titulo e obrigatorio');
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? '/api/services' : `/api/services/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          order: Number(form.order),
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar servico');

      toast.success(isNew ? 'Servico criado com sucesso' : 'Servico atualizado com sucesso');
      router.push('/admin/services');
    } catch (error) {
      toast.error('Erro ao salvar servico');
      console.error(error);
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/services')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Novo Servico' : 'Editar Servico'}
          </h2>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Crie um novo servico' : `Editando: ${form.title}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Informacoes Basicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Nome do servico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Breve descricao do servico"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteudo (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Conteudo completo do servico em markdown..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Configuracoes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icone</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="icon"
                      value={form.icon}
                      onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="Ex: Briefcase, Users..."
                    />
                    {form.icon && (
                      <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-gray-50">
                        <DynamicIcon name={form.icon} size={20} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <ImagePicker
                    value={form.imageUrl}
                    onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                    label="Selecionar imagem"
                    imagesOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Ativo</Label>
                  <Switch
                    id="active"
                    checked={form.active}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/admin/services')}
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
