'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao enviar mensagem');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Falha ao enviar mensagem. Tente novamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status === 'error') setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-serif text-neutral-50">Mensagem enviada!</h3>
        <p className="text-neutral-400 max-w-md">
          Obrigado pelo contato. Nossa equipe analisará sua mensagem e retornará em breve.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 px-6 py-2 text-sm text-accent hover:text-accent-light transition-colors underline underline-offset-4"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-200 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-neutral-200 mb-2">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            placeholder="Nome da empresa"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-200 mb-2">
          Assunto *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        >
          <option value="">Selecione um assunto</option>
          <option value="consultoria">Consultoria Jurídica</option>
          <option value="lgpd">LGPD e Privacidade</option>
          <option value="contratos">Contratos</option>
          <option value="startups">Startups</option>
          <option value="propriedade">Propriedade Intelectual</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-200 mb-2">
          Mensagem *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 bg-primary-light border border-neutral-500/20 rounded-lg text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent transition-colors resize-none disabled:opacity-50"
          placeholder="Conte-nos mais sobre o que você precisa..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full md:w-auto px-10 py-4 bg-accent text-primary font-medium rounded-sm hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar mensagem
          </>
        )}
      </button>
    </form>
  );
}
