'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  BarChart3,
  Image,
  Video,
  MousePointerClick,
  Images,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ImagePicker from '@/components/admin/ImagePicker';

// ---------- Types ----------

interface HeroData {
  title: string;
  highlight: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  backgroundImageUrl: string;
  backgroundVideoUrl: string;
  slideshowImages: string[];
}

interface Stat {
  id: string;
  number: string;
  label: string;
  order: number;
}

interface NewStat {
  number: string;
  label: string;
  order: number;
}

interface CTAData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

// ---------- Defaults ----------

const defaultHero: HeroData = {
  title: '',
  highlight: '',
  subtitle: '',
  ctaPrimaryText: '',
  ctaPrimaryLink: '',
  ctaSecondaryText: '',
  ctaSecondaryLink: '',
  backgroundImageUrl: '',
  backgroundVideoUrl: '',
  slideshowImages: [],
};

const defaultCTA: CTAData = {
  title: '',
  description: '',
  buttonText: '',
  buttonLink: '',
};

// ---------- Component ----------

export default function AdminHomePage() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [stats, setStats] = useState<Stat[]>([]);
  const [cta, setCTA] = useState<CTAData>(defaultCTA);
  const [loading, setLoading] = useState(true);

  const [savingHero, setSavingHero] = useState(false);
  const [savingCTA, setSavingCTA] = useState(false);
  const [savingStatId, setSavingStatId] = useState<string | null>(null);
  const [deletingStatId, setDeletingStatId] = useState<string | null>(null);
  const [addingStat, setAddingStat] = useState(false);

  const [newStat, setNewStat] = useState<NewStat>({
    number: '',
    label: '',
    order: 0,
  });
  const [showNewStatForm, setShowNewStatForm] = useState(false);

  // ---------- Fetch all data ----------

  useEffect(() => {
    async function fetchAll() {
      try {
        const [heroRes, statsRes, ctaRes] = await Promise.all([
          fetch('/api/hero'),
          fetch('/api/stats'),
          fetch('/api/cta'),
        ]);

        if (!heroRes.ok || !statsRes.ok || !ctaRes.ok) {
          throw new Error('Falha ao carregar dados');
        }

        const [heroData, statsData, ctaData] = await Promise.all([
          heroRes.json(),
          statsRes.json(),
          ctaRes.json(),
        ]);

        if (heroData) {
          setHero({
            title: heroData.title ?? '',
            highlight: heroData.highlight ?? '',
            subtitle: heroData.subtitle ?? '',
            ctaPrimaryText: heroData.ctaPrimaryText ?? '',
            ctaPrimaryLink: heroData.ctaPrimaryLink ?? '',
            ctaSecondaryText: heroData.ctaSecondaryText ?? '',
            ctaSecondaryLink: heroData.ctaSecondaryLink ?? '',
            backgroundImageUrl: heroData.backgroundImageUrl ?? '',
            backgroundVideoUrl: heroData.backgroundVideoUrl ?? '',
            slideshowImages: heroData.slideshowImages ?? [],
          });
        }

        if (Array.isArray(statsData)) {
          setStats(statsData);
        }

        if (ctaData) {
          setCTA({
            title: ctaData.title ?? '',
            description: ctaData.description ?? '',
            buttonText: ctaData.buttonText ?? '',
            buttonLink: ctaData.buttonLink ?? '',
          });
        }
      } catch (error) {
        toast.error('Erro ao carregar dados da página inicial');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // ---------- Hero handlers ----------

  async function handleSaveHero() {
    setSavingHero(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });

      if (!res.ok) throw new Error('Falha ao salvar hero');
      toast.success('Hero salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar hero');
    } finally {
      setSavingHero(false);
    }
  }

  function updateHeroField(field: keyof HeroData, value: string) {
    setHero((prev) => ({ ...prev, [field]: value }));
  }

  function addSlideshowImage(url: string) {
    setHero((prev) => ({ ...prev, slideshowImages: [...prev.slideshowImages, url] }));
  }

  function removeSlideshowImage(index: number) {
    setHero((prev) => ({
      ...prev,
      slideshowImages: prev.slideshowImages.filter((_, i) => i !== index),
    }));
  }

  // ---------- Stats handlers ----------

  async function handleAddStat() {
    if (!newStat.number.trim() || !newStat.label.trim()) {
      toast.error('Preencha o número e o rótulo da estatística');
      return;
    }

    setAddingStat(true);
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStat),
      });

      if (!res.ok) throw new Error('Falha ao criar estatística');

      const created = await res.json();
      setStats((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setNewStat({ number: '', label: '', order: 0 });
      setShowNewStatForm(false);
      toast.success('Estatística adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar estatística');
    } finally {
      setAddingStat(false);
    }
  }

  async function handleUpdateStat(stat: Stat) {
    setSavingStatId(stat.id);
    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat),
      });

      if (!res.ok) throw new Error('Falha ao atualizar estatística');

      const updated = await res.json();
      setStats((prev) =>
        prev
          .map((s) => (s.id === updated.id ? updated : s))
          .sort((a, b) => a.order - b.order)
      );
      toast.success('Estatística atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar estatística');
    } finally {
      setSavingStatId(null);
    }
  }

  async function handleDeleteStat(id: string) {
    setDeletingStatId(id);
    try {
      const res = await fetch('/api/stats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Falha ao excluir estatística');

      setStats((prev) => prev.filter((s) => s.id !== id));
      toast.success('Estatística excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir estatística');
    } finally {
      setDeletingStatId(null);
    }
  }

  function updateStatField(id: string, field: keyof Stat, value: string | number) {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  // ---------- CTA handlers ----------

  async function handleSaveCTA() {
    setSavingCTA(true);
    try {
      const res = await fetch('/api/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cta),
      });

      if (!res.ok) throw new Error('Falha ao salvar CTA');
      toast.success('CTA salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar CTA');
    } finally {
      setSavingCTA(false);
    }
  }

  function updateCTAField(field: keyof CTAData, value: string) {
    setCTA((prev) => ({ ...prev, [field]: value }));
  }

  // ---------- Loading state ----------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ---------- Render ----------

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Página Inicial</h2>
        <p className="text-gray-500 mt-1">
          Gerencie o conteúdo da página inicial do site.
        </p>
      </div>

      {/* ===== HERO SECTION ===== */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <Image className="h-5 w-5 text-gray-500" />
          <div>
            <CardTitle className="text-gray-900">Hero</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              Seção principal no topo da página inicial.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroTitle" className="text-gray-700">
                Título
              </Label>
              <Input
                id="heroTitle"
                value={hero.title}
                onChange={(e) => updateHeroField('title', e.target.value)}
                placeholder="Texto principal do hero"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroHighlight" className="text-gray-700">
                Destaque
              </Label>
              <Input
                id="heroHighlight"
                value={hero.highlight}
                onChange={(e) => updateHeroField('highlight', e.target.value)}
                placeholder="Parte em destaque (cor accent)"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle" className="text-gray-700">
              Subtítulo
            </Label>
            <Textarea
              id="heroSubtitle"
              value={hero.subtitle}
              onChange={(e) => updateHeroField('subtitle', e.target.value)}
              placeholder="Texto descritivo abaixo do título"
              rows={3}
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ctaPrimaryText" className="text-gray-700">
                Texto CTA Primário
              </Label>
              <Input
                id="ctaPrimaryText"
                value={hero.ctaPrimaryText}
                onChange={(e) => updateHeroField('ctaPrimaryText', e.target.value)}
                placeholder="Ex: Saiba Mais"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaPrimaryLink" className="text-gray-700">
                Link CTA Primário
              </Label>
              <Input
                id="ctaPrimaryLink"
                value={hero.ctaPrimaryLink}
                onChange={(e) => updateHeroField('ctaPrimaryLink', e.target.value)}
                placeholder="/servicos"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ctaSecondaryText" className="text-gray-700">
                Texto CTA Secundário
              </Label>
              <Input
                id="ctaSecondaryText"
                value={hero.ctaSecondaryText}
                onChange={(e) => updateHeroField('ctaSecondaryText', e.target.value)}
                placeholder="Ex: Fale Conosco"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaSecondaryLink" className="text-gray-700">
                Link CTA Secundário
              </Label>
              <Input
                id="ctaSecondaryLink"
                value={hero.ctaSecondaryLink}
                onChange={(e) => updateHeroField('ctaSecondaryLink', e.target.value)}
                placeholder="/contato"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Video className="h-4 w-4" />
              <span className="text-sm font-medium">Background do Hero</span>
            </div>
            <p className="text-xs text-gray-500">
              Prioridade: Video &gt; Imagem estática &gt; Slideshow de fotos &gt; Gradiente padrão.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Video de Fundo (.mp4)</Label>
                <ImagePicker
                  value={hero.backgroundVideoUrl}
                  onChange={(url) => updateHeroField('backgroundVideoUrl', url)}
                  label="Selecionar video"
                  videosOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Imagem de Fundo (estática)</Label>
                <ImagePicker
                  value={hero.backgroundImageUrl}
                  onChange={(url) => updateHeroField('backgroundImageUrl', url)}
                  label="Selecionar imagem"
                  imagesOnly
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-gray-700">
              <Images className="h-4 w-4" />
              <span className="text-sm font-medium">Slideshow de Fotos</span>
              <Badge variant="secondary" className="text-xs">
                {hero.slideshowImages.length} {hero.slideshowImages.length === 1 ? 'foto' : 'fotos'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Adicione fotos para um slideshow com transição automática. Exibido quando não há vídeo nem imagem estática.
            </p>

            {hero.slideshowImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hero.slideshowImages.map((url, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={url}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlideshowImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ImagePicker
              value=""
              onChange={(url) => { if (url) addSlideshowImage(url); }}
              label="Adicionar foto ao slideshow"
              imagesOnly
            />
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSaveHero} disabled={savingHero} className="gap-2">
              {savingHero ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Hero
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== STATS SECTION ===== */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-gray-900">Estatísticas</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                Números em destaque exibidos na página inicial.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {stats.length} {stats.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing stats */}
          {stats.length === 0 && !showNewStatForm && (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhuma estatística cadastrada. Clique em &quot;Adicionar Estatística&quot; para começar.
            </p>
          )}

          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col sm:flex-row items-start sm:items-end gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50"
            >
              <div className="flex-1 grid gap-3 sm:grid-cols-3 w-full">
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Número</Label>
                  <Input
                    value={stat.number}
                    onChange={(e) => updateStatField(stat.id, 'number', e.target.value)}
                    placeholder="100+"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Rótulo</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStatField(stat.id, 'label', e.target.value)}
                    placeholder="Clientes atendidos"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Ordem</Label>
                  <Input
                    type="number"
                    value={stat.order}
                    onChange={(e) =>
                      updateStatField(stat.id, 'order', parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStat(stat)}
                  disabled={savingStatId === stat.id}
                  className="gap-1 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  {savingStatId === stat.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteStat(stat.id)}
                  disabled={deletingStatId === stat.id}
                  className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {deletingStatId === stat.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Excluir
                </Button>
              </div>
            </div>
          ))}

          {/* New stat form */}
          {showNewStatForm && (
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50/30">
              <div className="flex-1 grid gap-3 sm:grid-cols-3 w-full">
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Número</Label>
                  <Input
                    value={newStat.number}
                    onChange={(e) =>
                      setNewStat((prev) => ({ ...prev, number: e.target.value }))
                    }
                    placeholder="100+"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Rótulo</Label>
                  <Input
                    value={newStat.label}
                    onChange={(e) =>
                      setNewStat((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="Clientes atendidos"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600 text-xs">Ordem</Label>
                  <Input
                    type="number"
                    value={newStat.order}
                    onChange={(e) =>
                      setNewStat((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={handleAddStat}
                  disabled={addingStat}
                  className="gap-1"
                >
                  {addingStat ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewStatForm(false);
                    setNewStat({ number: '', label: '', order: 0 });
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowNewStatForm(true)}
              disabled={showNewStatForm}
              className="gap-2 border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Adicionar Estatística
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== CTA FINAL SECTION ===== */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <MousePointerClick className="h-5 w-5 text-gray-500" />
          <div>
            <CardTitle className="text-gray-900">CTA Final</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              Seção de chamada para ação no final da página inicial.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle" className="text-gray-700">
              Título
            </Label>
            <Input
              id="ctaTitle"
              value={cta.title}
              onChange={(e) => updateCTAField('title', e.target.value)}
              placeholder="Título da seção CTA"
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaDescription" className="text-gray-700">
              Descrição
            </Label>
            <Textarea
              id="ctaDescription"
              value={cta.description}
              onChange={(e) => updateCTAField('description', e.target.value)}
              placeholder="Texto descritivo do CTA"
              rows={3}
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ctaButtonText" className="text-gray-700">
                Texto do Botão
              </Label>
              <Input
                id="ctaButtonText"
                value={cta.buttonText}
                onChange={(e) => updateCTAField('buttonText', e.target.value)}
                placeholder="Ex: Entre em Contato"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaButtonLink" className="text-gray-700">
                Link do Botão
              </Label>
              <Input
                id="ctaButtonLink"
                value={cta.buttonLink}
                onChange={(e) => updateCTAField('buttonLink', e.target.value)}
                placeholder="/contato"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSaveCTA} disabled={savingCTA} className="gap-2">
              {savingCTA ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar CTA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
