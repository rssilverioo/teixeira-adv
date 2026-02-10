'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Loader2, Upload, Copy, Link, Filter, X, CheckCircle2, AlertCircle, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface ImageItem {
  id: string;
  name: string;
  url: string;
  alt: string | null;
  category: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  mimeType: string | null;
  createdAt: string;
}

interface ExternalImageForm {
  name: string;
  url: string;
  alt: string;
  category: string;
}

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
  preview?: string;
}

const defaultExternalForm: ExternalImageForm = {
  name: '',
  url: '',
  alt: '',
  category: '',
};

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export default function ImagesAdminPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // External image dialog
  const [externalDialogOpen, setExternalDialogOpen] = useState(false);
  const [externalForm, setExternalForm] = useState<ExternalImageForm>(defaultExternalForm);
  const [savingExternal, setSavingExternal] = useState(false);

  // Upload category
  const [uploadCategory, setUploadCategory] = useState('');

  // Drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  const fetchImages = async (category?: string) => {
    try {
      const url = category && category !== 'all'
        ? `/api/images?category=${encodeURIComponent(category)}`
        : '/api/images';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao buscar imagens');
      const data = await res.json();
      setImages(data);

      // Extract unique categories
      const allCategories = data
        .map((img: ImageItem) => img.category)
        .filter((c: string | null): c is string => Boolean(c));
      setCategories([...new Set(allCategories)] as string[]);
    } catch (error) {
      toast.error('Erro ao carregar imagens');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
    setLoading(true);
    fetchImages(value);
  };

  // Validate files before adding to queue
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Tipo nao permitido: ${file.type || 'desconhecido'}`;
    }
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return `Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max: ${isVideo ? '100MB' : '10MB'}`;
    }
    return null;
  };

  // Create preview URL for a file
  const createPreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  // Add files to upload queue
  const addFilesToQueue = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: UploadItem[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined,
        preview: error ? undefined : createPreview(file),
      });
    }

    setUploadQueue((prev) => [...prev, ...newItems]);
  }, []);

  // Upload a single file
  const uploadFile = async (item: UploadItem): Promise<boolean> => {
    const formData = new FormData();
    formData.append('file', item.file);
    formData.append('alt', item.file.name);
    if (uploadCategory) {
      formData.append('category', uploadCategory);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao fazer upload');
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'error' as const, error: message } : q
        )
      );
      return false;
    }
  };

  // Process the upload queue
  const processQueue = async () => {
    const pendingItems = uploadQueue.filter((q) => q.status === 'pending');
    if (pendingItems.length === 0) return;

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (const item of pendingItems) {
      // Mark as uploading
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'uploading' as const, progress: 50 } : q
        )
      );

      const success = await uploadFile(item);

      if (success) {
        successCount++;
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'done' as const, progress: 100 } : q
          )
        );
      } else {
        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? '1 arquivo enviado com sucesso'
          : `${successCount} arquivos enviados com sucesso`
      );
      fetchImages(filterCategory);
    }
    if (errorCount > 0) {
      toast.error(
        errorCount === 1
          ? '1 arquivo falhou no upload'
          : `${errorCount} arquivos falharam no upload`
      );
    }
  };

  // Start upload when queue changes
  useEffect(() => {
    const hasPending = uploadQueue.some((q) => q.status === 'pending');
    if (hasPending && !isUploading) {
      processQueue();
    }
  }, [uploadQueue, isUploading]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      uploadQueue.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  // Remove item from queue
  const removeFromQueue = (id: string) => {
    setUploadQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((q) => q.id !== id);
    });
  };

  // Clear completed/error items from queue
  const clearFinishedFromQueue = () => {
    setUploadQueue((prev) => {
      prev.forEach((item) => {
        if ((item.status === 'done' || item.status === 'error') && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
      return prev.filter((q) => q.status === 'uploading' || q.status === 'pending');
    });
  };

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFilesToQueue(files);
    }
  }, [addFilesToQueue]);

  // File input handler (now supports multiple)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFilesToQueue(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddExternal = async () => {
    if (!externalForm.name.trim() || !externalForm.url.trim()) {
      toast.error('Nome e URL sao obrigatorios');
      return;
    }

    setSavingExternal(true);
    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: externalForm.name,
          url: externalForm.url,
          alt: externalForm.alt || externalForm.name,
          category: externalForm.category || null,
        }),
      });

      if (!res.ok) throw new Error('Falha ao adicionar imagem');

      toast.success('Imagem adicionada com sucesso');
      setExternalDialogOpen(false);
      setExternalForm(defaultExternalForm);
      fetchImages(filterCategory);
    } catch (error) {
      toast.error('Erro ao adicionar imagem');
      console.error(error);
    } finally {
      setSavingExternal(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir imagem');
      toast.success('Imagem excluida com sucesso');
      fetchImages(filterCategory);
    } catch (error) {
      toast.error('Erro ao excluir imagem');
      console.error(error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copiada para a area de transferencia');
    }).catch(() => {
      toast.error('Falha ao copiar URL');
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const finishedCount = uploadQueue.filter((q) => q.status === 'done' || q.status === 'error').length;
  const hasQueueItems = uploadQueue.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Full-page drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-dashed border-blue-400 p-12 text-center">
            <ImagePlus className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-800">Solte os arquivos aqui</p>
            <p className="text-sm text-gray-500 mt-2">Imagens (JPG, PNG, GIF, WebP, SVG) e Videos (MP4, WebM)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Imagens</h2>
          <p className="text-gray-500 mt-1">Biblioteca de imagens e videos do site</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={externalDialogOpen} onOpenChange={setExternalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setExternalForm(defaultExternalForm)}>
                <Link className="h-4 w-4 mr-2" />
                URL Externa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Adicionar Imagem Externa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="ext-name">Nome</Label>
                  <Input
                    id="ext-name"
                    value={externalForm.name}
                    onChange={(e) => setExternalForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da imagem"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ext-url">URL</Label>
                  <Input
                    id="ext-url"
                    value={externalForm.url}
                    onChange={(e) => setExternalForm((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ext-alt">Texto Alternativo</Label>
                  <Input
                    id="ext-alt"
                    value={externalForm.alt}
                    onChange={(e) => setExternalForm((prev) => ({ ...prev, alt: e.target.value }))}
                    placeholder="Descricao da imagem"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ext-category">Categoria</Label>
                  <Input
                    id="ext-category"
                    value={externalForm.category}
                    onChange={(e) => setExternalForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: banner, team, blog..."
                  />
                </div>
                {externalForm.url && (
                  <div className="border rounded-md p-2">
                    <img
                      src={externalForm.url}
                      alt="Preview"
                      className="w-full h-32 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setExternalDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddExternal} disabled={savingExternal}>
                    {savingExternal ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Input
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            placeholder="Categoria (opcional)"
            className="w-40 h-9 text-sm"
          />
        </div>
      </div>

      {/* Drop zone area */}
      <div
        ref={dropZoneRef}
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 group"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Arraste e solte seus arquivos aqui
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ou clique para selecionar - JPG, PNG, GIF, WebP, SVG, MP4, WebM
            </p>
          </div>
          <Badge variant="outline" className="text-xs text-gray-400">
            Imagens ate 10MB - Videos ate 100MB
          </Badge>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Queue */}
      {hasQueueItems && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Fila de Upload ({uploadQueue.filter((q) => q.status === 'done').length}/{uploadQueue.length} concluidos)
            </h3>
            {finishedCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFinishedFromQueue} className="text-xs h-7">
                Limpar concluidos
              </Button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Preview */}
                <div className="h-24 bg-gray-100 relative">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : item.file.type.startsWith('video/') ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-xs text-gray-500 font-medium">VIDEO</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImagePlus className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  {/* Status overlay */}
                  {item.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                  {item.status === 'done' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  )}

                  {/* Remove button */}
                  {(item.status === 'done' || item.status === 'error' || item.status === 'pending') && (
                    <button
                      onClick={() => removeFromQueue(item.id)}
                      className="absolute top-1 right-1 h-5 w-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate" title={item.file.name}>
                    {item.file.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">
                      {formatFileSize(item.file.size)}
                    </span>
                    {item.status === 'error' && (
                      <span className="text-[10px] text-red-500 truncate ml-1" title={item.error}>
                        {item.error}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {(item.status === 'uploading' || item.status === 'pending') && (
                    <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filterCategory} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {images.length} imagem{images.length !== 1 ? 'ns' : ''}
        </span>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImagePlus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg">Nenhuma imagem encontrada</p>
          <p className="text-sm mt-1">Arraste arquivos para ca ou clique na area de upload</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="bg-white border-gray-200 overflow-hidden group">
              <div
                className="relative h-40 bg-gray-100 cursor-pointer"
                onClick={() => handleCopyUrl(image.url)}
              >
                {image.mimeType?.startsWith('video/') ? (
                  <video
                    src={image.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={image.url}
                    alt={image.alt || image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).className = 'w-full h-full bg-gray-200';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Copy className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-sm font-medium truncate" title={image.name}>
                  {image.name}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {image.category && (
                      <Badge variant="secondary" className="text-xs">
                        {image.category}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatFileSize(image.size)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(image.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopyUrl(image.url)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copiar URL
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a imagem &quot;{image.name}&quot;? Esta acao nao pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(image.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
