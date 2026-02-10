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

interface TeamMemberForm {
  name: string;
  role: string;
  bio: string;
  expertise: string;
  imageUrl: string;
  linkedinUrl: string;
  email: string;
  order: number;
  active: boolean;
}

const defaultForm: TeamMemberForm = {
  name: '',
  role: '',
  bio: '',
  expertise: '',
  imageUrl: '',
  linkedinUrl: '',
  email: '',
  order: 0,
  active: true,
};

export default function TeamMemberEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [form, setForm] = useState<TeamMemberForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/team/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Membro nao encontrado');
          return res.json();
        })
        .then((data) => {
          setForm({
            name: data.name || '',
            role: data.role || '',
            bio: data.bio || '',
            expertise: Array.isArray(data.expertise) ? data.expertise.join(', ') : '',
            imageUrl: data.imageUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            email: data.email || '',
            order: data.order ?? 0,
            active: data.active ?? true,
          });
        })
        .catch((error) => {
          toast.error('Erro ao carregar membro');
          console.error(error);
          router.push('/admin/team');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, router]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('O nome e obrigatorio');
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? '/api/team' : `/api/team/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const expertiseArray = form.expertise
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          bio: form.bio,
          expertise: expertiseArray,
          imageUrl: form.imageUrl,
          linkedinUrl: form.linkedinUrl,
          email: form.email,
          order: Number(form.order),
          active: form.active,
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar membro');

      toast.success(isNew ? 'Membro criado com sucesso' : 'Membro atualizado com sucesso');
      router.push('/admin/team');
    } catch (error) {
      toast.error('Erro ao salvar membro');
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
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/team')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Novo Membro' : 'Editar Membro'}
          </h2>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Adicione um novo membro ao time' : `Editando: ${form.name}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Informacoes Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    placeholder="Ex: CEO, CTO, Advogado..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Biografia do membro..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Especialidades (separadas por virgula)</Label>
                  <Input
                    id="expertise"
                    value={form.expertise}
                    onChange={(e) => setForm((prev) => ({ ...prev, expertise: e.target.value }))}
                    placeholder="Direito Tributario, Compliance, Governanca..."
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
                  <Label>Foto</Label>
                  <ImagePicker
                    value={form.imageUrl}
                    onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                    label="Selecionar foto"
                    imagesOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
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
                onClick={() => router.push('/admin/team')}
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
