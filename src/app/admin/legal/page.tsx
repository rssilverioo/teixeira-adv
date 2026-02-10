'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface LegalPageData {
  title: string;
  content: string;
}

const defaultPage: LegalPageData = {
  title: '',
  content: '',
};

export default function LegalPagesAdmin() {
  const [privacy, setPrivacy] = useState<LegalPageData>(defaultPage);
  const [terms, setTerms] = useState<LegalPageData>(defaultPage);
  const [loading, setLoading] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingTerms, setSavingTerms] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [privRes, termsRes] = await Promise.all([
          fetch('/api/legal/privacidade'),
          fetch('/api/legal/termos'),
        ]);

        const privData = await privRes.json();
        const termsData = await termsRes.json();

        if (privData) {
          setPrivacy({ title: privData.title || '', content: privData.content || '' });
        }
        if (termsData) {
          setTerms({ title: termsData.title || '', content: termsData.content || '' });
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar páginas legais');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function savePrivacy() {
    setSavingPrivacy(true);
    try {
      const res = await fetch('/api/legal/privacidade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      toast.success('Política de Privacidade salva com sucesso');
    } catch {
      toast.error('Erro ao salvar Política de Privacidade');
    } finally {
      setSavingPrivacy(false);
    }
  }

  async function saveTerms() {
    setSavingTerms(true);
    try {
      const res = await fetch('/api/legal/termos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(terms),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      toast.success('Termos de Uso salvos com sucesso');
    } catch {
      toast.error('Erro ao salvar Termos de Uso');
    } finally {
      setSavingTerms(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Páginas Legais</h2>
        <p className="text-gray-500 mt-1">
          Gerencie a Política de Privacidade e os Termos de Uso do site.
        </p>
      </div>

      <Tabs defaultValue="privacy">
        <TabsList>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Política de Privacidade
          </TabsTrigger>
          <TabsTrigger value="terms" className="gap-2">
            <FileText className="h-4 w-4" />
            Termos de Uso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Política de Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacy-title">Título</Label>
                <Input
                  id="privacy-title"
                  value={privacy.title}
                  onChange={(e) => setPrivacy((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Política de Privacidade"
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <RichTextEditor
                  content={privacy.content}
                  onChange={(html) => setPrivacy((prev) => ({ ...prev, content: html }))}
                  placeholder="Escreva a política de privacidade..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={savePrivacy} disabled={savingPrivacy} className="gap-2">
                  {savingPrivacy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar Política de Privacidade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Termos de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms-title">Título</Label>
                <Input
                  id="terms-title"
                  value={terms.title}
                  onChange={(e) => setTerms((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Termos de Uso"
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <RichTextEditor
                  content={terms.content}
                  onChange={(html) => setTerms((prev) => ({ ...prev, content: html }))}
                  placeholder="Escreva os termos de uso..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={saveTerms} disabled={savingTerms} className="gap-2">
                  {savingTerms ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar Termos de Uso
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
