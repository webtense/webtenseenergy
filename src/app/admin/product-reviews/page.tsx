"use client";

import { useEffect, useState } from "react";
import { ProductReview } from "@prisma/client";

interface FormState {
  title: string;
  asin: string;
  categoryId: string;
  imageUrl: string;
  affiliateUrl: string;
  rating: string;
  price: string;
  pros: string;
  cons: string;
  description: string;
}

export default function ProductReviewsAdminPage() {
  const [products, setProducts] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormState>({
    title: "",
    asin: "",
    categoryId: "",
    imageUrl: "",
    affiliateUrl: "",
    rating: "5",
    price: "",
    pros: "",
    cons: "",
    description: "",
  });

  // Cargar productos
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/product-reviews");
      if (!res.ok) throw new Error("Error al cargar productos");
      const { data } = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Parsear arrays
      const pros = formData.pros
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
      const cons = formData.cons
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        asin: formData.asin,
        categoryId: formData.categoryId || undefined,
        imageUrl: formData.imageUrl || undefined,
        affiliateUrl: formData.affiliateUrl,
        rating: parseInt(formData.rating),
        price: formData.price ? parseFloat(formData.price) : undefined,
        pros,
        cons,
        description: formData.description || undefined,
      };

      const res = await fetch("/api/admin/product-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error, details } = await res.json();
        throw new Error(
          details ? `${error}: ${JSON.stringify(details)}` : error
        );
      }

      const newProduct = await res.json();
      setProducts((prev) => [newProduct, ...prev]);
      setSuccess("Producto agregado exitosamente");

      // Reset form
      setFormData({
        title: "",
        asin: "",
        categoryId: "",
        imageUrl: "",
        affiliateUrl: "",
        rating: "5",
        price: "",
        pros: "",
        cons: "",
        description: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear producto"
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-shell">
      <h1 className="section-title">📦 Product Reviews — Amazon Affiliate</h1>
      <p className="section-copy mb-8">
        Gestiona los productos Amazon recomendados en los artículos del blog
      </p>

      {/* Mensajes de estado */}
      {error && (
        <div className="alert-error mb-4 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      {success && (
        <div className="alert-success mb-4 p-4 rounded bg-green-100 text-green-800">
          <strong>✓ Éxito:</strong> {success}
        </div>
      )}

      {/* Formulario */}
      <div className="max-w-2xl mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Agregar Nuevo Producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Título *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                placeholder="Panel Solar Monocristalino 400W"
              />
            </div>

            <div className="form-group">
              <label htmlFor="asin" className="form-label">
                ASIN Amazon *
              </label>
              <input
                id="asin"
                name="asin"
                type="text"
                required
                value={formData.asin}
                onChange={handleInputChange}
                className="input"
                placeholder="B0CXYZ123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryId" className="form-label">
                Categoría
              </label>
              <input
                id="categoryId"
                name="categoryId"
                type="text"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="input"
                placeholder="paneles-solares"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Precio (€)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="input"
                placeholder="189.99"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating" className="form-label">
                Rating (1-5) *
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="input"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {"⭐".repeat(n)} ({n}/5)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="affiliateUrl" className="form-label">
              URL Afiliado Amazon *
            </label>
            <input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              required
              value={formData.affiliateUrl}
              onChange={handleInputChange}
              className="input"
              placeholder="https://amazon.es/dp/B0CXYZ123?tag=semillasdet02-21"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              URL Imagen
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="input"
              placeholder="https://images-na.ssl-images-amazon.com/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="pros" className="form-label">
                Ventajas (una por línea)
              </label>
              <textarea
                id="pros"
                name="pros"
                value={formData.pros}
                onChange={handleInputChange}
                className="input min-h-24"
                placeholder="Eficiencia 22%+&#10;Garantía 25 años&#10;Instalación fácil"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cons" className="form-label">
                Consideraciones (una por línea)
              </label>
              <textarea
                id="cons"
                name="cons"
                value={formData.cons}
                onChange={handleInputChange}
                className="input min-h-24"
                placeholder="Peso moderado (22kg)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input min-h-20"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cta-primary w-full"
          >
            {submitting ? "Agregando..." : "Agregar Producto"}
          </button>
        </form>
      </div>

      {/* Listado de productos */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Productos Registrados ({products.length})
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner" />
            <p className="text-gray-500 mt-2">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded">
            <p className="text-gray-500 dark:text-gray-400">
              No hay productos aún. ¡Agrega el primero!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800 border-b">
                <tr>
                  <th className="p-3 text-left font-bold">Título</th>
                  <th className="p-3 text-left font-bold">ASIN</th>
                  <th className="p-3 text-left font-bold">Categoría</th>
                  <th className="p-3 text-center font-bold">Rating</th>
                  <th className="p-3 text-right font-bold">Precio</th>
                  <th className="p-3 text-left font-bold">Creado</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {products.map((product: typeof products[0]) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-3 font-medium">{product.title}</td>
                    <td className="p-3 font-mono text-xs">{product.asin}</td>
                    <td className="p-3 text-xs text-gray-600 dark:text-gray-400">
                      {product.categoryId || "—"}
                    </td>
                    <td className="p-3 text-center">
                      {"⭐".repeat(product.rating)}
                    </td>
                    <td className="p-3 text-right">
                      {product.price ? `€${product.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="p-3 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
