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

interface PodcastForm {
  title: string;
  description: string;
  episode: number;
  guests: string;
  duration: string;
  date: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  tags: string;
  active: boolean;
}

const defaultForm: PodcastForm = {
  title: '',
  description: '',
  episode: 1,
  guests: '',
  duration: '',
  date: new Date().toISOString().split('T')[0],
  youtubeUrl: '',
  thumbnailUrl: '',
  tags: '',
  active: true,
};

export default function PodcastEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [form, setForm] = useState<PodcastForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/podcasts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Podcast nao encontrado');
          return res.json();
        })
        .then((data) => {
          setForm({
            title: data.title || '',
            description: data.description || '',
            episode: data.episode ?? 1,
            guests: Array.isArray(data.guests) ? data.guests.join(', ') : '',
            duration: data.duration || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            youtubeUrl: data.youtubeUrl || '',
            thumbnailUrl: data.thumbnailUrl || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            active: data.active ?? true,
          });
        })
        .catch((error) => {
          toast.error('Erro ao carregar podcast');
          console.error(error);
          router.push('/admin/podcasts');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('O titulo e obrigatorio');
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? '/api/podcasts' : `/api/podcasts/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const guestsArray = form.guests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const tagsArray = form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          episode: Number(form.episode),
          guests: guestsArray,
          duration: form.duration,
          date: form.date,
          youtubeUrl: form.youtubeUrl,
          thumbnailUrl: form.thumbnailUrl,
          tags: tagsArray,
          active: form.active,
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar podcast');

      toast.success(isNew ? 'Podcast criado com sucesso' : 'Podcast atualizado com sucesso');
      router.push('/admin/podcasts');
    } catch (error) {
      toast.error('Erro ao salvar podcast');
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
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/podcasts')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Novo Episodio' : 'Editar Episodio'}
          </h2>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Adicione um novo episodio de podcast' : `Editando: ${form.title}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Informacoes do Episodio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titulo</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Titulo do episodio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="episode">Numero do Episodio</Label>
                    <Input
                      id="episode"
                      type="number"
                      value={form.episode}
                      onChange={(e) => setForm((prev) => ({ ...prev, episode: parseInt(e.target.value) || 1 }))}
                      min={1}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descricao do episodio..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Convidados (separados por virgula)</Label>
                  <Input
                    id="guests"
                    value={form.guests}
                    onChange={(e) => setForm((prev) => ({ ...prev, guests: e.target.value }))}
                    placeholder="Nome 1, Nome 2, Nome 3"
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
                  <Label htmlFor="duration">Duracao</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="Ex: 45:30"
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
                  <Label htmlFor="youtubeUrl">URL do YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    value={form.youtubeUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <ImagePicker
                    value={form.thumbnailUrl}
                    onChange={(url) => setForm((prev) => ({ ...prev, thumbnailUrl: url }))}
                    label="Selecionar thumbnail"
                    imagesOnly
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
                onClick={() => router.push('/admin/podcasts')}
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
