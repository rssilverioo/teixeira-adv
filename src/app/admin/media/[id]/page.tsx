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
import ImagePicker from '@/components/admin/ImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface MediaPostForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string;
  imageUrl: string;
  readTime: string;
  active: boolean;
}

const defaultForm: MediaPostForm = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  tags: '',
  imageUrl: '',
  readTime: '',
  active: true,
};

export default function MediaPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [form, setForm] = useState<MediaPostForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/media/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Artigo nao encontrado');
          return res.json();
        })
        .then((data) => {
          setForm({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            author: data.author || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            category: data.category || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            imageUrl: data.imageUrl || '',
            readTime: data.readTime || '',
            active: data.active ?? true,
          });
        })
        .catch((error) => {
          toast.error('Erro ao carregar artigo');
          console.error(error);
          router.push('/admin/media');
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
      const url = isNew ? '/api/media' : `/api/media/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const tagsArray = form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          date: form.date,
          category: form.category,
          tags: tagsArray,
          imageUrl: form.imageUrl,
          readTime: form.readTime,
          active: form.active,
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar artigo');

      toast.success(isNew ? 'Artigo criado com sucesso' : 'Artigo atualizado com sucesso');
      router.push('/admin/media');
    } catch (error) {
      toast.error('Erro ao salvar artigo');
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
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/media')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Novo Artigo' : 'Editar Artigo'}
          </h2>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Crie um novo artigo' : `Editando: ${form.title}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Conteudo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Titulo do artigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Breve descricao do artigo"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conteudo</Label>
                  <RichTextEditor
                    content={form.content}
                    onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                    placeholder="Comece a escrever seu artigo..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Metadados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={form.author}
                    onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Nome do autor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Tecnologia, Direito..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por virgula)</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <ImagePicker
                    value={form.imageUrl}
                    onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                    label="Selecionar imagem"
                    imagesOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime">Tempo de Leitura</Label>
                  <Input
                    id="readTime"
                    value={form.readTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))}
                    placeholder="Ex: 5 min"
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
                onClick={() => router.push('/admin/media')}
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
