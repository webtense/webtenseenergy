'use client';

import { useMemo, useState } from 'react';
import { BLOG_EDITORIAL_CATEGORIES } from '@/lib/blog-shared';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-zinc-700 text-zinc-300',
  REVIEW: 'bg-yellow-900/60 text-yellow-300',
  SCHEDULED: 'bg-blue-900/60 text-blue-300',
  PUBLISHED: 'bg-green-900/60 text-green-300',
  ARCHIVED: 'bg-zinc-800 text-zinc-500',
};

type Translation = {
  id: string;
  locale: 'ES' | 'CA';
  title: string;
  excerpt: string | null;
  content: string;
};

type Post = {
  id: string;
  slug: string;
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  scheduledFor: string | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  locale: 'ES' | 'CA';
  category: string;
  translations: Translation[];
  updatedAt: string;
};

type ApiPost = Post & {
  categories?: Array<{
    category?: {
      name?: string;
    };
  }>;
};

type Props = {
  initialPosts: Post[];
};

type FormState = {
  id?: string;
  locale: 'ES' | 'CA';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: Post['status'];
  scheduledFor: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
};

type GeneratorState = {
  locale: 'ES' | 'CA';
  prompt: string;
  audience: string;
  objective: string;
  tone: string;
  points: string;
  cta: string;
  category: string;
};

type GeneratedDraft = Pick<
  FormState,
  'locale' | 'title' | 'slug' | 'excerpt' | 'content' | 'seoTitle' | 'seoDescription' | 'category'
> & {
  status: 'REVIEW';
};

const EMPTY_FORM: FormState = {
  locale: 'ES',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'DRAFT',
  scheduledFor: '',
  featuredImage: '',
  seoTitle: '',
  seoDescription: '',
  category: '',
};

const EMPTY_GENERATOR: GeneratorState = {
  locale: 'ES',
  prompt: '',
  audience: '',
  objective: '',
  tone: '',
  points: '',
  cta: '',
  category: 'Home Assistant',
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function AdminBlogManager({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [generator, setGenerator] = useState<GeneratorState>(EMPTY_GENERATOR);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [modalTab, setModalTab] = useState<'edit' | 'preview'>('edit');
  const [modalForm, setModalForm] = useState<FormState>(EMPTY_FORM);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalStatus, setModalStatus] = useState('');

  const normalizePost = (post: ApiPost): Post => ({
    ...post,
    category: post.category || post.categories?.[0]?.category?.name || '',
  });

  const editing = useMemo(() => posts.find((item) => item.id === form.id), [posts, form.id]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  const applyGeneratedDraft = (draft: GeneratedDraft) => {
    setForm({
      ...EMPTY_FORM,
      locale: draft.locale,
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      content: draft.content,
      status: draft.status,
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      category: draft.category,
    });
  };

  const openModal = (post: Post) => {
    const translation =
      post.translations.find((item) => item.locale === post.locale) || post.translations[0];
    setModalForm({
      id: post.id,
      locale: post.locale,
      title: translation?.title || '',
      slug: post.slug,
      excerpt: translation?.excerpt || '',
      content: translation?.content || '',
      status: post.status,
      scheduledFor: post.scheduledFor || '',
      featuredImage: post.featuredImage || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      category: post.category || '',
    });
    setModalTab('preview');
    setModalStatus('');
    setModalPost(post);
  };

  const saveModal = async (newStatus?: Post['status']) => {
    setModalSaving(true);
    setModalStatus('');
    try {
      const payload = newStatus ? { ...modalForm, status: newStatus } : modalForm;
      const res = await fetch(`/api/admin/posts/${modalForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { post?: Post };
      if (data.post) {
        setPosts((prev) =>
          prev.map((p) => (p.id === data.post!.id ? normalizePost(data.post as ApiPost) : p))
        );
        if (newStatus) setModalPost({ ...modalPost!, status: newStatus });
        setModalStatus(newStatus === 'PUBLISHED' ? '✅ Publicado' : '✅ Guardado');
      }
    } catch {
      setModalStatus('❌ Error al guardar');
    } finally {
      setModalSaving(false);
    }
  };

  const fillForm = (post: Post) => {
    const translation =
      post.translations.find((item) => item.locale === post.locale) || post.translations[0];
    setForm({
      id: post.id,
      locale: post.locale,
      title: translation?.title || '',
      slug: post.slug,
      excerpt: translation?.excerpt || '',
      content: translation?.content || '',
      status: post.status,
      scheduledFor: post.scheduledFor ? post.scheduledFor.slice(0, 16) : '',
      featuredImage: post.featuredImage || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      category: post.category || '',
    });
  };

  const loadPosts = async () => {
    const response = await fetch('/api/admin/posts');
    if (!response.ok) return;
    const payload = (await response.json()) as { posts: ApiPost[] };
    setPosts(payload.posts.map(normalizePost));
  };

  const submit = async () => {
    setSaving(true);
    setStatus('');

    try {
      const payload = {
        locale: form.locale,
        title: form.title,
        slug: form.slug || toSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        status: form.status,
        scheduledFor: form.scheduledFor || null,
        featuredImage: form.featuredImage || null,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
        category: form.category || null,
      };

      const response = await fetch(form.id ? `/api/admin/posts/${form.id}` : '/api/admin/posts', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar.');
      }

      await loadPosts();
      resetForm();
      setStatus('Post guardado correctamente.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  const generateDraft = async () => {
    setGenerating(true);
    setStatus('');

    try {
      const response = await fetch('/api/admin/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generator),
      });

      const data = (await response.json()) as {
        message?: string;
        draft?: GeneratedDraft;
        fallback?: boolean;
      };
      if (!response.ok || !data.draft) {
        throw new Error(data.message || 'No se pudo generar el borrador.');
      }

      applyGeneratedDraft(data.draft);
      setStatus(
        data.fallback
          ? 'Se ha generado un borrador base sin IA externa. Revísalo antes de guardar.'
          : 'Borrador generado. Revísalo, ajústalo si hace falta y guárdalo cuando esté listo.'
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo generar el borrador.');
    } finally {
      setGenerating(false);
    }
  };

  const remove = async (id: string) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este post?');
    if (!confirmed) return;

    const response = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setStatus('No se pudo eliminar el post.');
      return;
    }

    await loadPosts();
    if (form.id === id) resetForm();
    setStatus('Post eliminado.');
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.25fr,1fr]">
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100">Posts</h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-zinc-300"
            >
              Nuevo
            </button>
          </div>
          <div className="space-y-3">
            {posts.map((post) => {
              const title =
                post.translations.find((item) => item.locale === post.locale)?.title || post.slug;
              return (
                <div
                  key={post.id}
                  onDoubleClick={() => openModal(post)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-primary-500/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{title}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${STATUS_COLORS[post.status] ?? 'bg-zinc-800 text-zinc-300'}`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">/{post.slug}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(post)}
                      className="rounded-lg border border-primary-500/40 px-3 py-1 text-xs font-semibold text-primary-300"
                    >
                      Abrir
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(post.id)}
                      className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
            {posts.length === 0 && (
              <p className="text-sm text-zinc-500">No hay posts en la base de datos.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-zinc-100">
            {editing ? 'Editar post' : 'Crear post'}
          </h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-primary-500/20 bg-zinc-950/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                    Generar artículo
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Describe qué quieres explicar y el sistema te deja un borrador en estado
                    `REVIEW` listo para edición.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <select
                  value={generator.locale}
                  onChange={(event) =>
                    setGenerator((prev) => ({ ...prev, locale: event.target.value as 'ES' | 'CA' }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="ES">Generar en castellano</option>
                  <option value="CA">Generar en catalán</option>
                </select>
                <textarea
                  value={generator.prompt}
                  onChange={(event) =>
                    setGenerator((prev) => ({ ...prev, prompt: event.target.value }))
                  }
                  placeholder="Ejemplo: quiero explicar cómo montar un dashboard de Home Assistant para controlar consumos, placas y climatización sin depender de la app del fabricante"
                  className="h-24 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={generator.audience}
                    onChange={(event) =>
                      setGenerator((prev) => ({ ...prev, audience: event.target.value }))
                    }
                    placeholder="Público objetivo"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                  <input
                    value={generator.objective}
                    onChange={(event) =>
                      setGenerator((prev) => ({ ...prev, objective: event.target.value }))
                    }
                    placeholder="Objetivo del artículo"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                  <input
                    value={generator.tone}
                    onChange={(event) =>
                      setGenerator((prev) => ({ ...prev, tone: event.target.value }))
                    }
                    placeholder="Tono"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                  <input
                    list="blog-editorial-categories"
                    value={generator.category}
                    onChange={(event) =>
                      setGenerator((prev) => ({ ...prev, category: event.target.value }))
                    }
                    placeholder="Categoría sugerida"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                </div>
                <textarea
                  value={generator.points}
                  onChange={(event) =>
                    setGenerator((prev) => ({ ...prev, points: event.target.value }))
                  }
                  placeholder="Puntos a cubrir, uno por línea o separados por comas"
                  className="h-20 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                />
                <input
                  value={generator.cta}
                  onChange={(event) =>
                    setGenerator((prev) => ({ ...prev, cta: event.target.value }))
                  }
                  placeholder="CTA final"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                />
                <button
                  type="button"
                  disabled={generating}
                  onClick={generateDraft}
                  className="w-full rounded-xl border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm font-bold text-primary-200 hover:bg-primary-500/20 disabled:opacity-60"
                >
                  {generating ? 'Generando borrador...' : 'Generar borrador con IA'}
                </button>
              </div>
            </div>
            <select
              value={form.locale}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, locale: event.target.value as 'ES' | 'CA' }))
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="ES">Castellano</option>
              <option value="CA">Catala</option>
            </select>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Titulo"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <input
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="slug-del-articulo"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <textarea
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="Extracto"
              className="h-20 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <textarea
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Contenido HTML"
              className="h-40 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as FormState['status'],
                  }))
                }
                className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
              <input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, scheduledFor: event.target.value }))
                }
                className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </div>
            <input
              list="blog-editorial-categories"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Categoria (ej. Home Assistant, Ofertas, Domótica)"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <datalist id="blog-editorial-categories">
              {BLOG_EDITORIAL_CATEGORIES.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <input
              value={form.featuredImage}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, featuredImage: event.target.value }))
              }
              placeholder="Imagen destacada URL"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <input
              value={form.seoTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, seoTitle: event.target.value }))}
              placeholder="SEO title"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <textarea
              value={form.seoDescription}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, seoDescription: event.target.value }))
              }
              placeholder="SEO description"
              className="h-20 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              type="button"
              disabled={saving}
              onClick={submit}
              className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar post' : 'Crear post'}
            </button>
            {status && <p className="text-xs text-zinc-300">{status}</p>}
          </div>
        </section>
      </div>

      {/* ── MODAL PANTALLA COMPLETA ── */}
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {modalPost && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
          {/* Barra superior */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-zinc-900 px-4 py-3">
            <button
              type="button"
              onClick={() => setModalPost(null)}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              ← Volver
            </button>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[modalForm.status] ?? 'bg-zinc-800 text-zinc-300'}`}
            >
              {modalForm.status}
            </span>
            <span className="flex-1 truncate text-sm font-semibold text-zinc-100">
              {modalForm.title}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModalTab(modalTab === 'edit' ? 'preview' : 'edit')}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                {modalTab === 'edit' ? '👁 Vista previa' : '✏️ Editar'}
              </button>
              <button
                type="button"
                disabled={modalSaving}
                onClick={() => saveModal()}
                className="rounded-lg border border-primary-500/40 px-3 py-1.5 text-xs font-semibold text-primary-300 hover:bg-primary-500/10 disabled:opacity-50"
              >
                {modalSaving ? 'Guardando...' : '💾 Guardar'}
              </button>
              <button
                type="button"
                disabled={modalSaving}
                onClick={() => saveModal('PUBLISHED')}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-500 disabled:opacity-50"
              >
                🚀 Publicar
              </button>
            </div>
            {modalStatus && <span className="text-xs text-zinc-300">{modalStatus}</span>}
          </div>

          {/* Contenido */}
          <div className="flex flex-1 overflow-hidden">
            {modalTab === 'preview' ? (
              /* Vista previa */
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-3xl">
                  <h1 className="mb-2 text-3xl font-bold text-zinc-100">{modalForm.title}</h1>
                  {modalForm.excerpt && (
                    <p className="mb-6 text-lg text-zinc-400">{modalForm.excerpt}</p>
                  )}
                  <div
                    className="article-body prose-zinc text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: modalForm.content }}
                  />
                </div>
              </div>
            ) : (
              /* Editor */
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={modalForm.title}
                    onChange={(e) => setModalForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Título"
                    className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                  <input
                    value={modalForm.slug}
                    onChange={(e) => setModalForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="slug-del-articulo"
                    className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                </div>
                <textarea
                  value={modalForm.excerpt}
                  onChange={(e) => setModalForm((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Extracto (1-2 frases)"
                  className="h-16 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                />
                <textarea
                  value={modalForm.content}
                  onChange={(e) => setModalForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Contenido HTML"
                  className="flex-1 min-h-[50vh] w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-100"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <select
                    value={modalForm.status}
                    onChange={(e) =>
                      setModalForm((p) => ({ ...p, status: e.target.value as FormState['status'] }))
                    }
                    className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                  <input
                    value={modalForm.seoTitle}
                    onChange={(e) => setModalForm((p) => ({ ...p, seoTitle: e.target.value }))}
                    placeholder="SEO Title"
                    className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                  <input
                    value={modalForm.seoDescription}
                    onChange={(e) =>
                      setModalForm((p) => ({ ...p, seoDescription: e.target.value }))
                    }
                    placeholder="SEO Description"
                    className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
