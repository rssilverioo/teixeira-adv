'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, Palette, Globe, Phone, Share2, FileText } from 'lucide-react';
import ImagePicker from '@/components/admin/ImagePicker';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  keywords: string[];
  colorPrimary: string;
  colorPrimaryLight: string;
  colorAccent: string;
  colorAccentLight: string;
  colorAccentDark: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  copyrightText: string;
}

const defaultSettings: SiteSettings = {
  siteName: '',
  siteTitle: '',
  siteDescription: '',
  logoUrl: '',
  faviconUrl: '',
  ogImageUrl: '',
  keywords: [],
  colorPrimary: '#1a1a2e',
  colorPrimaryLight: '#2d2d44',
  colorAccent: '#c4a35a',
  colorAccentLight: '#d4b96a',
  colorAccentDark: '#a8893e',
  address: '',
  phone: '',
  email: '',
  whatsapp: '',
  workingHours: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
  copyrightText: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Falha ao carregar configurações');
      const data = await res.json();
      if (data) {
        setSettings({
          siteName: data.siteName ?? '',
          siteTitle: data.siteTitle ?? '',
          siteDescription: data.siteDescription ?? '',
          logoUrl: data.logoUrl ?? '',
          faviconUrl: data.faviconUrl ?? '',
          ogImageUrl: data.ogImageUrl ?? '',
          keywords: data.keywords ?? [],
          colorPrimary: data.colorPrimary ?? '#1a1a2e',
          colorPrimaryLight: data.colorPrimaryLight ?? '#2d2d44',
          colorAccent: data.colorAccent ?? '#c4a35a',
          colorAccentLight: data.colorAccentLight ?? '#d4b96a',
          colorAccentDark: data.colorAccentDark ?? '#a8893e',
          address: data.address ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          whatsapp: data.whatsapp ?? '',
          workingHours: data.workingHours ?? '',
          facebookUrl: data.facebookUrl ?? '',
          instagramUrl: data.instagramUrl ?? '',
          linkedinUrl: data.linkedinUrl ?? '',
          youtubeUrl: data.youtubeUrl ?? '',
          copyrightText: data.copyrightText ?? '',
        });
        setKeywordsInput((data.keywords ?? []).join(', '));
      }
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const keywords = keywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const payload = {
        ...settings,
        keywords,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Falha ao salvar');

      const data = await res.json();
      setSettings({
        ...settings,
        keywords: data.keywords ?? keywords,
      });

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof SiteSettings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Site</h2>
        <p className="text-gray-500 mt-1">
          Gerencie as configurações gerais, cores, contato e redes sociais.
        </p>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="geral" className="gap-2 data-[state=active]:bg-gray-100">
            <Globe className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="cores" className="gap-2 data-[state=active]:bg-gray-100">
            <Palette className="h-4 w-4" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="contato" className="gap-2 data-[state=active]:bg-gray-100">
            <Phone className="h-4 w-4" />
            Contato
          </TabsTrigger>
          <TabsTrigger value="redes" className="gap-2 data-[state=active]:bg-gray-100">
            <Share2 className="h-4 w-4" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="rodape" className="gap-2 data-[state=active]:bg-gray-100">
            <FileText className="h-4 w-4" />
            Rodapé
          </TabsTrigger>
        </TabsList>

        {/* Tab Geral */}
        <TabsContent value="geral">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-gray-700">
                    Nome do Site
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    placeholder="Nome do site"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTitle" className="text-gray-700">
                    Título do Site
                  </Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={(e) => updateField('siteTitle', e.target.value)}
                    placeholder="Título exibido na aba do navegador"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-gray-700">
                  Descrição do Site
                </Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateField('siteDescription', e.target.value)}
                  placeholder="Breve descrição do site para SEO"
                  rows={3}
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-gray-700">Logo</Label>
                  <ImagePicker
                    value={settings.logoUrl}
                    onChange={(url) => updateField('logoUrl', url)}
                    label="Selecionar logo"
                    imagesOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Favicon</Label>
                  <ImagePicker
                    value={settings.faviconUrl}
                    onChange={(url) => updateField('faviconUrl', url)}
                    label="Selecionar favicon"
                    imagesOnly
                  />
                  <p className="text-xs text-gray-400">
                    Ícone exibido na aba do navegador
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">OG Image</Label>
                  <ImagePicker
                    value={settings.ogImageUrl}
                    onChange={(url) => updateField('ogImageUrl', url)}
                    label="Selecionar imagem"
                    imagesOnly
                  />
                  <p className="text-xs text-gray-400">
                    Imagem de compartilhamento em redes sociais
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-gray-700">
                  Palavras-chave (separadas por vírgula)
                </Label>
                <Input
                  id="keywords"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="advocacia, direito empresarial, consultoria"
                  className="bg-white border-gray-200 text-gray-900"
                />
                <p className="text-xs text-gray-400">
                  Separe as palavras-chave com vírgulas
                </p>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Cores */}
        <TabsContent value="cores">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Esquema de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Color Primary */}
                <div className="space-y-2">
                  <Label htmlFor="colorPrimary" className="text-gray-700">
                    Cor Primária
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="colorPrimary"
                      value={settings.colorPrimary}
                      onChange={(e) => updateField('colorPrimary', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-200"
                    />
                    <Input
                      value={settings.colorPrimary}
                      onChange={(e) => updateField('colorPrimary', e.target.value)}
                      placeholder="#1a1a2e"
                      className="bg-white border-gray-200 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Color Primary Light */}
                <div className="space-y-2">
                  <Label htmlFor="colorPrimaryLight" className="text-gray-700">
                    Cor Primária Clara
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="colorPrimaryLight"
                      value={settings.colorPrimaryLight}
                      onChange={(e) => updateField('colorPrimaryLight', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-200"
                    />
                    <Input
                      value={settings.colorPrimaryLight}
                      onChange={(e) => updateField('colorPrimaryLight', e.target.value)}
                      placeholder="#2d2d44"
                      className="bg-white border-gray-200 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Color Accent */}
                <div className="space-y-2">
                  <Label htmlFor="colorAccent" className="text-gray-700">
                    Cor de Destaque
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="colorAccent"
                      value={settings.colorAccent}
                      onChange={(e) => updateField('colorAccent', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-200"
                    />
                    <Input
                      value={settings.colorAccent}
                      onChange={(e) => updateField('colorAccent', e.target.value)}
                      placeholder="#c4a35a"
                      className="bg-white border-gray-200 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Color Accent Light */}
                <div className="space-y-2">
                  <Label htmlFor="colorAccentLight" className="text-gray-700">
                    Cor de Destaque Clara
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="colorAccentLight"
                      value={settings.colorAccentLight}
                      onChange={(e) => updateField('colorAccentLight', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-200"
                    />
                    <Input
                      value={settings.colorAccentLight}
                      onChange={(e) => updateField('colorAccentLight', e.target.value)}
                      placeholder="#d4b96a"
                      className="bg-white border-gray-200 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Color Accent Dark */}
                <div className="space-y-2">
                  <Label htmlFor="colorAccentDark" className="text-gray-700">
                    Cor de Destaque Escura
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="colorAccentDark"
                      value={settings.colorAccentDark}
                      onChange={(e) => updateField('colorAccentDark', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-200"
                    />
                    <Input
                      value={settings.colorAccentDark}
                      onChange={(e) => updateField('colorAccentDark', e.target.value)}
                      placeholder="#a8893e"
                      className="bg-white border-gray-200 text-gray-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Color Preview */}
              <div className="space-y-3">
                <Label className="text-gray-700 text-sm font-medium">
                  Pré-visualização das Cores
                </Label>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1 text-center">
                    <div
                      className="h-16 w-24 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: settings.colorPrimary }}
                    />
                    <p className="text-xs text-gray-500">Primária</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-16 w-24 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: settings.colorPrimaryLight }}
                    />
                    <p className="text-xs text-gray-500">Primária Clara</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-16 w-24 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: settings.colorAccent }}
                    />
                    <p className="text-xs text-gray-500">Destaque</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-16 w-24 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: settings.colorAccentLight }}
                    />
                    <p className="text-xs text-gray-500">Destaque Clara</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-16 w-24 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: settings.colorAccentDark }}
                    />
                    <p className="text-xs text-gray-500">Destaque Escura</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Contato */}
        <TabsContent value="contato">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">
                  Endereço
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Rua Exemplo, 123 - Cidade, Estado"
                  rows={3}
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(11) 1234-5678"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contato@exemplo.com"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-gray-700">
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    placeholder="5511912345678"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours" className="text-gray-700">
                    Horário de Funcionamento
                  </Label>
                  <Input
                    id="workingHours"
                    value={settings.workingHours}
                    onChange={(e) => updateField('workingHours', e.target.value)}
                    placeholder="Seg-Sex: 9h às 18h"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Redes Sociais */}
        <TabsContent value="redes">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl" className="text-gray-700">
                    Facebook
                  </Label>
                  <Input
                    id="facebookUrl"
                    value={settings.facebookUrl}
                    onChange={(e) => updateField('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/suapagina"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="text-gray-700">
                    Instagram
                  </Label>
                  <Input
                    id="instagramUrl"
                    value={settings.instagramUrl}
                    onChange={(e) => updateField('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/seuperfil"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-gray-700">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={settings.linkedinUrl}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/suaempresa"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-gray-700">
                    YouTube
                  </Label>
                  <Input
                    id="youtubeUrl"
                    value={settings.youtubeUrl}
                    onChange={(e) => updateField('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/@seucanal"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Rodapé */}
        <TabsContent value="rodape">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Rodapé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="copyrightText" className="text-gray-700">
                  Texto de Copyright
                </Label>
                <Input
                  id="copyrightText"
                  value={settings.copyrightText}
                  onChange={(e) => updateField('copyrightText', e.target.value)}
                  placeholder="© 2024 Sua Empresa. Todos os direitos reservados."
                  className="bg-white border-gray-200 text-gray-900"
                />
                <p className="text-xs text-gray-400">
                  Este texto será exibido no rodapé de todas as páginas do site.
                </p>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
