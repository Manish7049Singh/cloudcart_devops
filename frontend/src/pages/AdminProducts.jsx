import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Package, Check } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { formatCurrency } from '../utils/formatCurrency';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Initial State
  const initialForm = {
    title: '',
    description: '',
    price: 99,
    discount_percentage: 10,
    rating: 4.5,
    stock: 25,
    brand: '',
    thumbnail: '',
    imagesText: '',
    is_published: true,
    category_id: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ page: 1, limit: 100, search }),
        categoryService.getCategories({ page: 1, limit: 100 }),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      if (!formData.category_id && catRes.data?.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load products/categories:', err);
      setError('Failed to fetch product data from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category_id: categories[0]?.id || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      title: p.title || '',
      description: p.description || '',
      price: p.price || 0,
      discount_percentage: p.discount_percentage || 0,
      rating: p.rating || 4.5,
      stock: p.stock || 0,
      brand: p.brand || '',
      thumbnail: p.thumbnail || '',
      imagesText: Array.isArray(p.images) ? p.images.join('\n') : '',
      is_published: p.is_published ?? true,
      category_id: p.category_id || (categories[0]?.id || ''),
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formError) setFormError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (!formData.category_id) {
      setFormError('Please select a valid category.');
      return;
    }

    const imagesArray = formData.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    // Ensure thumbnail is present
    const thumbnail = formData.thumbnail.trim() || imagesArray[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
    if (imagesArray.length === 0) {
      imagesArray.push(thumbnail);
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      price: parseInt(formData.price, 10) || 0,
      discount_percentage: parseFloat(formData.discount_percentage) || 0,
      rating: parseFloat(formData.rating) || 5.0,
      stock: parseInt(formData.stock, 10) || 0,
      brand: formData.brand.trim() || 'Store Brand',
      thumbnail,
      images: imagesArray,
      is_published: Boolean(formData.is_published),
      category_id: parseInt(formData.category_id, 10),
      created_at: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success(`Product #${editingProduct.id} updated successfully!`);
      } else {
        await productService.createProduct(payload);
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.title}" deleted.`);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, inspect, and remove catalog items
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing {products.length} products
        </span>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading catalog..." />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-base font-bold text-slate-800">No products found</h3>
          <p className="mt-1 text-xs text-slate-500">Add a product to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Brand & Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <img
                          src={p.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-[220px]">
                        <p className="truncate font-bold text-slate-900">{p.title}</p>
                        <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{p.brand}</p>
                    <span className="text-[11px] text-slate-400">{p.category?.name || 'Category'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{formatCurrency(p.price)}</p>
                    {p.discount_percentage > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {p.discount_percentage}% off
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={p.stock > 0 ? 'text-slate-800' : 'text-red-600'}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        p.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(p);
                          setDeleteDialogOpen(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingProduct ? `Edit Product #${editingProduct.id}` : 'Create New Product'}
            </h3>

            {formError && <ErrorMessage message={formError} className="mt-4" />}

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Sony WH-1000XM5 Headphones"
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Category *</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleFormChange}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    placeholder="e.g. Sony, Apple"
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    min="0"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Discount (%)</label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Rating (0 - 5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase">Stock Units *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    min="0"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Thumbnail Image URL */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase">Thumbnail Image URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleFormChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Additional Images (Newline separated) */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase">Additional Image URLs (one per line)</label>
                  <textarea
                    name="imagesText"
                    value={formData.imagesText}
                    onChange={handleFormChange}
                    rows="2"
                    placeholder="https://...&#10;https://..."
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Full product overview and specifications..."
                    className="mt-1 w-full rounded-lg border border-slate-300 py-2 px-3 text-slate-800 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                {/* Published Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="is_published" className="font-semibold text-slate-700">
                    Publish item immediately to public store catalog
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60 transition"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.title}" (ID: #${productToDelete?.id})? This action cannot be undone.`}
        confirmText="Delete Product"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default AdminProducts;
