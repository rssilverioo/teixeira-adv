'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Image as ImageIcon, Upload, Loader2, Search, X, Check } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  alt: string | null;
  category: string | null;
  size: number | null;
  mimeType: string | null;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  imagesOnly?: boolean;
  videosOnly?: boolean;
}

export default function ImagePicker({ value, onChange, label, imagesOnly, videosOnly }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/images');
      if (!res.ok) throw new Error('Falha ao buscar imagens');
      const data: ImageItem[] = await res.json();
      setImages(data);
    } catch {
      toast.error('Erro ao carregar biblioteca de imagens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open, fetchImages]);

  const filtered = images.filter((img) => {
    if (imagesOnly && img.mimeType?.startsWith('video/')) return false;
    if (videosOnly && !img.mimeType?.startsWith('video/')) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      img.name.toLowerCase().includes(q) ||
      img.alt?.toLowerCase().includes(q) ||
      img.category?.toLowerCase().includes(q)
    );
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao fazer upload');
      }

      const data = await res.json();
      toast.success('Upload concluido');
      onChange(data.url);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
  };

  const isVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm'));

  return (
    <div className="space-y-2">
      {/* Current value preview */}
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <div className="h-32 relative">
            {isVideo ? (
              <video src={value} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img
                src={value}
                alt="Selecionada"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).className = 'w-full h-full bg-gray-200';
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 font-sans"
                onClick={() => setOpen(true)}
              >
                Trocar
              </button>
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="px-2 py-1.5 bg-white">
            <p className="text-xs text-gray-500 truncate font-sans" title={value}>{value}</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full h-28 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group bg-white"
        >
          <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors font-sans">
            {label || 'Selecionar da biblioteca'}
          </span>
        </button>
      )}

      {/* Dialog - force admin colors to override site theme */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!bg-white !text-gray-900 !border-gray-200 max-w-4xl max-h-[80vh] flex flex-col [&>button]:!text-gray-500 [&>button]:hover:!text-gray-900 [&>button]:!bg-transparent">
          <DialogHeader>
            <DialogTitle className="!text-gray-900 font-sans text-lg font-semibold tracking-normal">
              Biblioteca de Imagens
            </DialogTitle>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex items-center gap-3 py-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, alt ou categoria..."
                className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center h-9 px-3 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-sans"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-500" />
              ) : (
                <Upload className="h-4 w-4 mr-2 text-gray-500" />
              )}
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={videosOnly ? 'video/mp4,video/webm' : imagesOnly ? 'image/*' : 'image/*,video/mp4,video/webm'}
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Image grid */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500 font-sans">
                  {search.trim() ? 'Nenhuma imagem encontrada para essa busca' : 'Nenhuma imagem na biblioteca'}
                </p>
                <p className="text-xs mt-1 text-gray-400 font-sans">
                  Faca upload de uma nova imagem usando o botao acima
                </p>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-1">
                {filtered.map((img) => {
                  const isSelected = img.url === value;
                  const isVid = img.mimeType?.startsWith('video/');
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => handleSelect(img.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all text-left group bg-white ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="h-28 bg-gray-100 relative">
                        {isVid ? (
                          <video
                            src={img.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={img.url}
                            alt={img.alt || img.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '';
                              (e.target as HTMLImageElement).className = 'w-full h-full bg-gray-200';
                            }}
                          />
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <div className="bg-blue-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        {isVid && (
                          <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white font-sans font-medium">
                            VIDEO
                          </span>
                        )}
                      </div>
                      <div className="p-1.5 bg-white">
                        <p className="text-xs font-medium text-gray-700 truncate font-sans">{img.name}</p>
                        {img.category && (
                          <p className="text-[10px] text-gray-400 truncate font-sans">{img.category}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
