"use client";

import { useMemo, useState } from "react";

type Translation = {
  id: string;
  locale: "ES" | "CA";
  title: string;
  excerpt: string | null;
  content: string;
};

type Post = {
  id: string;
  slug: string;
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  scheduledFor: string | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  locale: "ES" | "CA";
  translations: Translation[];
  updatedAt: string;
};

type Props = {
  initialPosts: Post[];
};

type FormState = {
  id?: string;
  locale: "ES" | "CA";
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: Post["status"];
  scheduledFor: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY_FORM: FormState = {
  locale: "ES",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  scheduledFor: "",
  featuredImage: "",
  seoTitle: "",
  seoDescription: "",
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AdminBlogManager({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const editing = useMemo(() => posts.find((item) => item.id === form.id), [posts, form.id]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  const fillForm = (post: Post) => {
    const translation = post.translations.find((item) => item.locale === post.locale) || post.translations[0];
    setForm({
      id: post.id,
      locale: post.locale,
      title: translation?.title || "",
      slug: post.slug,
      excerpt: translation?.excerpt || "",
      content: translation?.content || "",
      status: post.status,
      scheduledFor: post.scheduledFor ? post.scheduledFor.slice(0, 16) : "",
      featuredImage: post.featuredImage || "",
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
    });
  };

  const loadPosts = async () => {
    const response = await fetch("/api/admin/posts");
    if (!response.ok) return;
    const payload = (await response.json()) as { posts: Post[] };
    setPosts(payload.posts);
  };

  const submit = async () => {
    setSaving(true);
    setStatus("");

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
      };

      const response = await fetch(form.id ? `/api/admin/posts/${form.id}` : "/api/admin/posts", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "No se pudo guardar.");
      }

      await loadPosts();
      resetForm();
      setStatus("Post guardado correctamente.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este post?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatus("No se pudo eliminar el post.");
      return;
    }

    await loadPosts();
    if (form.id === id) resetForm();
    setStatus("Post eliminado.");
  };

  return (
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
            const title = post.translations.find((item) => item.locale === post.locale)?.title || post.slug;
            return (
              <div
                key={post.id}
                className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{title}</p>
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs">{post.status}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">/{post.slug}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillForm(post)}
                    className="rounded-lg border border-primary-500/40 px-3 py-1 text-xs font-semibold text-primary-300"
                  >
                    Editar
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
          {posts.length === 0 && <p className="text-sm text-zinc-500">No hay posts en la base de datos.</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold text-zinc-100">{editing ? "Editar post" : "Crear post"}</h2>
        <div className="mt-4 space-y-3">
          <select
            value={form.locale}
            onChange={(event) => setForm((prev) => ({ ...prev, locale: event.target.value as "ES" | "CA" }))}
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
                setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
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
              onChange={(event) => setForm((prev) => ({ ...prev, scheduledFor: event.target.value }))}
              className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <input
            value={form.featuredImage}
            onChange={(event) => setForm((prev) => ({ ...prev, featuredImage: event.target.value }))}
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
            onChange={(event) => setForm((prev) => ({ ...prev, seoDescription: event.target.value }))}
            placeholder="SEO description"
            className="h-20 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <button
            type="button"
            disabled={saving}
            onClick={submit}
            className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-500 disabled:opacity-60"
          >
            {saving ? "Guardando..." : editing ? "Actualizar post" : "Crear post"}
          </button>
          {status && <p className="text-xs text-zinc-300">{status}</p>}
        </div>
      </section>
    </div>
  );
}
