'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ImagePicker from '@/components/admin/ImagePicker';
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
import DynamicIcon from '@/components/DynamicIcon';

interface AboutForm {
  title: string;
  subtitle: string;
  historyTitle: string;
  historyContent: string;
  historyImageUrl: string;
}

interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface Differentiator {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface ValueForm {
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface DifferentiatorForm {
  title: string;
  description: string;
  order: number;
}

const defaultAbout: AboutForm = {
  title: '',
  subtitle: '',
  historyTitle: '',
  historyContent: '',
  historyImageUrl: '',
};

const defaultValueForm: ValueForm = {
  title: '',
  description: '',
  icon: '',
  order: 0,
};

const defaultDiffForm: DifferentiatorForm = {
  title: '',
  description: '',
  order: 0,
};

export default function AboutAdminPage() {
  const [about, setAbout] = useState<AboutForm>(defaultAbout);
  const [values, setValues] = useState<Value[]>([]);
  const [differentiators, setDifferentiators] = useState<Differentiator[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAbout, setSavingAbout] = useState(false);

  // Value editing state
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valueForm, setValueForm] = useState<ValueForm>(defaultValueForm);
  const [addingValue, setAddingValue] = useState(false);
  const [savingValue, setSavingValue] = useState(false);

  // Differentiator editing state
  const [editingDiffId, setEditingDiffId] = useState<string | null>(null);
  const [diffForm, setDiffForm] = useState<DifferentiatorForm>(defaultDiffForm);
  const [addingDiff, setAddingDiff] = useState(false);
  const [savingDiff, setSavingDiff] = useState(false);

  const fetchAll = async () => {
    try {
      const [aboutRes, valuesRes, diffsRes] = await Promise.all([
        fetch('/api/about'),
        fetch('/api/values'),
        fetch('/api/differentiators'),
      ]);

      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        if (aboutData) {
          setAbout({
            title: aboutData.title || '',
            subtitle: aboutData.subtitle || '',
            historyTitle: aboutData.historyTitle || '',
            historyContent: aboutData.historyContent || '',
            historyImageUrl: aboutData.historyImageUrl || '',
          });
        }
      }

      if (valuesRes.ok) {
        const valuesData = await valuesRes.json();
        setValues(valuesData);
      }

      if (diffsRes.ok) {
        const diffsData = await diffsRes.json();
        setDifferentiators(diffsData);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados da pagina Sobre');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // About handlers
  const handleSaveAbout = async () => {
    setSavingAbout(true);
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      toast.success('Pagina Sobre atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar pagina Sobre');
      console.error(error);
    } finally {
      setSavingAbout(false);
    }
  };

  // Value handlers
  const handleStartEditValue = (value: Value) => {
    setEditingValueId(value.id);
    setValueForm({
      title: value.title,
      description: value.description,
      icon: value.icon,
      order: value.order,
    });
  };

  const handleCancelEditValue = () => {
    setEditingValueId(null);
    setValueForm(defaultValueForm);
  };

  const handleSaveValue = async (id?: string) => {
    if (!valueForm.title.trim()) {
      toast.error('O titulo do valor e obrigatorio');
      return;
    }

    setSavingValue(true);
    try {
      if (id) {
        // Update
        const res = await fetch('/api/values', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...valueForm, order: Number(valueForm.order) }),
        });
        if (!res.ok) throw new Error('Falha ao atualizar valor');
        toast.success('Valor atualizado com sucesso');
      } else {
        // Create
        const res = await fetch('/api/values', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...valueForm, order: Number(valueForm.order) }),
        });
        if (!res.ok) throw new Error('Falha ao criar valor');
        toast.success('Valor criado com sucesso');
      }

      setEditingValueId(null);
      setAddingValue(false);
      setValueForm(defaultValueForm);
      fetchAll();
    } catch (error) {
      toast.error('Erro ao salvar valor');
      console.error(error);
    } finally {
      setSavingValue(false);
    }
  };

  const handleDeleteValue = async (id: string) => {
    try {
      const res = await fetch('/api/values', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Falha ao excluir valor');
      toast.success('Valor excluido com sucesso');
      fetchAll();
    } catch (error) {
      toast.error('Erro ao excluir valor');
      console.error(error);
    }
  };

  // Differentiator handlers
  const handleStartEditDiff = (diff: Differentiator) => {
    setEditingDiffId(diff.id);
    setDiffForm({
      title: diff.title,
      description: diff.description,
      order: diff.order,
    });
  };

  const handleCancelEditDiff = () => {
    setEditingDiffId(null);
    setDiffForm(defaultDiffForm);
  };

  const handleSaveDiff = async (id?: string) => {
    if (!diffForm.title.trim()) {
      toast.error('O titulo do diferencial e obrigatorio');
      return;
    }

    setSavingDiff(true);
    try {
      if (id) {
        const res = await fetch('/api/differentiators', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...diffForm, order: Number(diffForm.order) }),
        });
        if (!res.ok) throw new Error('Falha ao atualizar diferencial');
        toast.success('Diferencial atualizado com sucesso');
      } else {
        const res = await fetch('/api/differentiators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...diffForm, order: Number(diffForm.order) }),
        });
        if (!res.ok) throw new Error('Falha ao criar diferencial');
        toast.success('Diferencial criado com sucesso');
      }

      setEditingDiffId(null);
      setAddingDiff(false);
      setDiffForm(defaultDiffForm);
      fetchAll();
    } catch (error) {
      toast.error('Erro ao salvar diferencial');
      console.error(error);
    } finally {
      setSavingDiff(false);
    }
  };

  const handleDeleteDiff = async (id: string) => {
    try {
      const res = await fetch('/api/differentiators', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Falha ao excluir diferencial');
      toast.success('Diferencial excluido com sucesso');
      fetchAll();
    } catch (error) {
      toast.error('Erro ao excluir diferencial');
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pagina Sobre</h2>
        <p className="text-gray-500 mt-1">Gerencie o conteudo da pagina Sobre</p>
      </div>

      {/* About Section */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Informacoes Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                value={about.title}
                onChange={(e) => setAbout((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titulo da pagina"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitulo</Label>
              <Input
                id="subtitle"
                value={about.subtitle}
                onChange={(e) => setAbout((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Subtitulo da pagina"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="historyTitle">Titulo da Historia</Label>
            <Input
              id="historyTitle"
              value={about.historyTitle}
              onChange={(e) => setAbout((prev) => ({ ...prev, historyTitle: e.target.value }))}
              placeholder="Titulo da secao de historia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historyContent">Conteudo da Historia (Markdown)</Label>
            <Textarea
              id="historyContent"
              value={about.historyContent}
              onChange={(e) => setAbout((prev) => ({ ...prev, historyContent: e.target.value }))}
              placeholder="Conteudo da historia em markdown..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Imagem da Historia</Label>
            <ImagePicker
              value={about.historyImageUrl}
              onChange={(url) => setAbout((prev) => ({ ...prev, historyImageUrl: url }))}
              label="Selecionar imagem"
              imagesOnly
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveAbout} disabled={savingAbout}>
              {savingAbout ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Valores</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setAddingValue(true);
              setValueForm(defaultValueForm);
            }}
            disabled={addingValue}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Valor
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Icone</TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead className="w-20">Ordem</TableHead>
                <TableHead className="w-28">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addingValue && (
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        value={valueForm.icon}
                        onChange={(e) => setValueForm((prev) => ({ ...prev, icon: e.target.value }))}
                        placeholder="Icone"
                        className="w-20 h-8 text-xs"
                      />
                      {valueForm.icon && (
                        <DynamicIcon name={valueForm.icon} size={16} className="text-gray-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={valueForm.title}
                      onChange={(e) => setValueForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Titulo"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={valueForm.description}
                      onChange={(e) => setValueForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Descricao"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={valueForm.order}
                      onChange={(e) => setValueForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="h-8 text-sm w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700"
                        onClick={() => handleSaveValue()}
                        disabled={savingValue}
                      >
                        {savingValue ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setAddingValue(false);
                          setValueForm(defaultValueForm);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {values.length === 0 && !addingValue ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    Nenhum valor cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                values.map((value) => (
                  <TableRow key={value.id}>
                    {editingValueId === value.id ? (
                      <>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              value={valueForm.icon}
                              onChange={(e) => setValueForm((prev) => ({ ...prev, icon: e.target.value }))}
                              className="w-20 h-8 text-xs"
                            />
                            {valueForm.icon && (
                              <DynamicIcon name={valueForm.icon} size={16} className="text-gray-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={valueForm.title}
                            onChange={(e) => setValueForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={valueForm.description}
                            onChange={(e) => setValueForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={valueForm.order}
                            onChange={(e) => setValueForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="h-8 text-sm w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => handleSaveValue(value.id)}
                              disabled={savingValue}
                            >
                              {savingValue ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleCancelEditValue}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          {value.icon ? (
                            <DynamicIcon name={value.icon} size={18} className="text-gray-600" />
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{value.title}</TableCell>
                        <TableCell className="text-gray-500 max-w-[300px] truncate">
                          {value.description}
                        </TableCell>
                        <TableCell className="text-gray-500">{value.order}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStartEditValue(value)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o valor &quot;{value.title}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteValue(value.id)}
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
        </CardContent>
      </Card>

      {/* Differentiators Section */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diferenciais</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setAddingDiff(true);
              setDiffForm(defaultDiffForm);
            }}
            disabled={addingDiff}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Diferencial
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead className="w-20">Ordem</TableHead>
                <TableHead className="w-28">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addingDiff && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={diffForm.title}
                      onChange={(e) => setDiffForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Titulo"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={diffForm.description}
                      onChange={(e) => setDiffForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Descricao"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={diffForm.order}
                      onChange={(e) => setDiffForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="h-8 text-sm w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700"
                        onClick={() => handleSaveDiff()}
                        disabled={savingDiff}
                      >
                        {savingDiff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setAddingDiff(false);
                          setDiffForm(defaultDiffForm);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {differentiators.length === 0 && !addingDiff ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                    Nenhum diferencial cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                differentiators.map((diff) => (
                  <TableRow key={diff.id}>
                    {editingDiffId === diff.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={diffForm.title}
                            onChange={(e) => setDiffForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={diffForm.description}
                            onChange={(e) => setDiffForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={diffForm.order}
                            onChange={(e) => setDiffForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="h-8 text-sm w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => handleSaveDiff(diff.id)}
                              disabled={savingDiff}
                            >
                              {savingDiff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleCancelEditDiff}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{diff.title}</TableCell>
                        <TableCell className="text-gray-500 max-w-[400px] truncate">
                          {diff.description}
                        </TableCell>
                        <TableCell className="text-gray-500">{diff.order}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStartEditDiff(diff)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o diferencial &quot;{diff.title}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteDiff(diff.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
