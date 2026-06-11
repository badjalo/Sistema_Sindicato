import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Pencil, Trash2, Image as ImageIcon, Save, X,
  AlertTriangle, CheckCircle, XCircle, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageHeader from '../components/PageHeader';

// As imagens /uploads/... sao servidas via proxy do Vite (vite.config.js)
const imgSrc = (url) => url || null;

const EMPTY = { titulo: '', descricao: '', link_url: '', ordem: 0, ativo: true };

const FormField = ({ label, required, children, span }) => (
  <div className="form-group" style={span ? { gridColumn: '1/-1' } : {}}>
    <label className="form-label">
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

export default function ConfiguracaoSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await api.get('/slider');
      setSlides(res.data.data || []);
    } catch {
      toast.error('Erro ao carregar slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  // Ciclar pré-visualização dos slides activos
  const slidesAtivos = slides.filter(s => s.ativo);
  useEffect(() => {
    if (slidesAtivos.length < 2) return;
    const t = setInterval(() => {
      setPreviewIndex(i => (i + 1) % slidesAtivos.length);
    }, 3500);
    return () => clearInterval(t);
  }, [slidesAtivos.length]);

  const abrirModal = (item = null) => {
    setEditing(item);
    setForm(item ? {
      titulo: item.titulo,
      descricao: item.descricao || '',
      link_url: item.link_url || '',
      ordem: item.ordem || 0,
      ativo: Boolean(item.ativo)
    } : EMPTY);
    setFile(null);
    setPreview(item?.imagem_url ? imgSrc(item.imagem_url) : null);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY);
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return toast.error('O título é obrigatório');
    if (!editing && !file) return toast.error('A imagem é obrigatória para um novo slide');

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('descricao', form.descricao);
      formData.append('link_url', form.link_url);
      formData.append('ordem', form.ordem);
      formData.append('ativo', form.ativo);
      if (file) formData.append('imagem', file);

      if (editing) {
        await api.put(`/slider/${editing.id}`, formData);
        toast.success('Slide atualizado!');
      } else {
        await api.post('/slider', formData);
        toast.success('Slide criado!');
      }
      fecharModal();
      carregar();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao guardar slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/slider/${id}`);
      toast.success('Slide eliminado');
      setDeleteConfirm(null);
      carregar();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao eliminar');
    }
  };

  const toggleAtivo = async (slide) => {
    try {
      const fd = new FormData();
      fd.append('titulo', slide.titulo);
      fd.append('descricao', slide.descricao || '');
      fd.append('ordem', slide.ordem);
      fd.append('ativo', !slide.ativo);
      await api.put(`/slider/${slide.id}`, fd);
      toast.success(`Slide ${!slide.ativo ? 'ativado' : 'desativado'}`);
      carregar();
    } catch {
      toast.error('Erro ao alterar estado');
    }
  };

  const setF = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const currentPreviewSlide = slidesAtivos[previewIndex] || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slider da Página Inicial"
        subtitle="Gerencie as imagens e mensagens de destaque apresentadas no topo da página pública"
        icon={ImageIcon}
        actions={
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <Plus size={16} /> Novo Slide
          </button>
        }
      />

      {/* ─── PRÉ-VISUALIZAÇÃO ─────────────────────────────────── */}
      <div className="card overflow-hidden" style={{ padding: 0 }}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Eye size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700">Pré-visualização do Slider</h3>
          {slidesAtivos.length > 0 && (
            <span className="ml-auto text-xs text-slate-400">
              {previewIndex + 1} / {slidesAtivos.length} slide{slidesAtivos.length !== 1 ? 's' : ''} ativo{slidesAtivos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div
          className="relative w-full flex items-center justify-center overflow-hidden"
          style={{
            height: 260,
            background: currentPreviewSlide?.imagem_url
              ? `linear-gradient(rgba(10,22,60,0.55),rgba(10,22,60,0.55)), url('${imgSrc(currentPreviewSlide.imagem_url)}') center/cover no-repeat`
              : 'linear-gradient(135deg,#0f1f42,#1a2f5e)'
          }}
        >
          {currentPreviewSlide ? (
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <p className="text-white font-black text-2xl sm:text-3xl mb-2 drop-shadow">
                {currentPreviewSlide.titulo}
              </p>
              {currentPreviewSlide.descricao && (
                <p className="text-slate-200 text-sm leading-relaxed mb-4">
                  {currentPreviewSlide.descricao}
                </p>
              )}
              {currentPreviewSlide.link_url && (
                <span className="inline-block bg-yellow-400 text-[#0f1f42] text-xs font-bold px-4 py-1.5 rounded-full">
                  Ler Mais
                </span>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <ImageIcon size={40} strokeWidth={1.2} className="mx-auto mb-2" />
              <p className="text-sm">Nenhum slide ativo para pré-visualizar</p>
            </div>
          )}

          {/* Indicadores de paginação */}
          {slidesAtivos.length > 1 && (
            <div className="absolute bottom-4 flex gap-1.5">
              {slidesAtivos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPreviewIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === previewIndex ? 20 : 8,
                    height: 8,
                    background: i === previewIndex ? '#facc15' : 'rgba(255,255,255,0.4)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── TABELA DE SLIDES ─────────────────────────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">
            Todos os Slides ({slides.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <ImageIcon size={44} strokeWidth={1.2} />
            <p className="text-sm font-medium">Nenhum slide configurado</p>
            <button className="btn btn-primary mt-2" onClick={() => abrirModal()}>
              Adicionar Primeiro Slide
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-5 py-3">Imagem</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-5 py-3">Título & Descrição</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-5 py-3">Link</th>
                  <th className="text-center text-xs font-bold text-slate-500 uppercase px-5 py-3">Ordem</th>
                  <th className="text-center text-xs font-bold text-slate-500 uppercase px-5 py-3">Estado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {slides.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-28 h-16 rounded-xl bg-slate-200 overflow-hidden border border-slate-200 flex-shrink-0">
                        {imgSrc(s.imagem_url) ? (
                          <img
                            src={imgSrc(s.imagem_url)}
                            alt={s.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-bold text-sm text-slate-900 truncate">{s.titulo}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{s.descricao || '—'}</p>
                    </td>
                    <td className="px-5 py-3">
                      {s.link_url
                        ? <span className="text-xs text-blue-500 underline truncate max-w-[140px] block">{s.link_url}</span>
                        : <span className="text-xs text-slate-300">Sem link</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 inline-flex items-center justify-center text-xs font-bold">
                        {s.ordem}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleAtivo(s)}
                        title={s.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          s.ativo
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s.ativo
                          ? <><CheckCircle size={12} /> Ativo</>
                          : <><XCircle size={12} /> Inativo</>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => abrirModal(s)}
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => setDeleteConfirm(s)}
                          title="Eliminar"
                          style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL CRIAR / EDITAR ──────────────────────────────── */}
      {showModal && createPortal(
        <div className="modal-backdrop" onClick={fecharModal}>
          <div className="modal-card" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editing ? 'Editar Slide' : 'Novo Slide'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure a imagem e os textos do slide</p>
                </div>
              </div>
              <button className="modal-close" onClick={fecharModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body space-y-5">

                {/* Imagem */}
                <div className="form-group">
                  <label className="form-label">
                    Imagem de Fundo <span className="text-slate-400 font-normal">(Recomendado: 1920×1080 px)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl relative hover:border-blue-400 transition-colors">
                    {preview ? (
                      <div className="relative rounded-xl overflow-hidden h-44">
                        <img src={preview} alt="Pré-visualização" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm">Clique para alterar imagem</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon size={36} className="mb-2 text-slate-400" />
                        <p className="text-sm font-medium">Clique para selecionar imagem</p>
                        <p className="text-xs mt-1 text-slate-400">JPG, PNG ou WEBP • Máx. 5 MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Título" required span>
                    <input
                      className="form-control"
                      required
                      value={form.titulo}
                      onChange={setF('titulo')}
                      placeholder="Título principal do slide..."
                    />
                  </FormField>

                  <FormField label="Subtítulo / Descrição" span>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={form.descricao}
                      onChange={setF('descricao')}
                      placeholder="Texto secundário (opcional)..."
                    />
                  </FormField>

                  <FormField label="Link do botão 'Ler Mais'">
                    <input
                      className="form-control"
                      value={form.link_url}
                      onChange={setF('link_url')}
                      placeholder="Ex: /sobre ou https://..."
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Deixe vazio para não exibir botão
                    </span>
                  </FormField>

                  <FormField label="Ordem de apresentação">
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      value={form.ordem}
                      onChange={setF('ordem')}
                    />
                  </FormField>

                  <div className="flex items-center gap-2 col-span-2">
                    <input
                      type="checkbox"
                      id="ativo"
                      checked={form.ativo}
                      onChange={setF('ativo')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="ativo" className="text-sm font-medium text-slate-700 cursor-pointer">
                      Slide ativo e visível na página inicial
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} />
                  {saving ? 'A guardar...' : 'Guardar Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── CONFIRMAR ELIMINAÇÃO ─────────────────────────────── */}
      {deleteConfirm && createPortal(
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-card" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-100 text-red-600">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Confirmar Eliminação</h3>
              </div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-slate-600">
                Tem a certeza que deseja eliminar o slide{' '}
                <strong className="text-slate-900">"{deleteConfirm.titulo}"</strong>?
                Esta ação não pode ser revertida.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button
                className="btn"
                onClick={() => handleDelete(deleteConfirm.id)}
                style={{ background: '#dc2626', color: 'white', border: 'none' }}
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
