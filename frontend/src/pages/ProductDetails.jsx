import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus } from 'lucide-react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDiscount } from '../utils/formatCurrency';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  const fallbackImage =
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60';

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await productService.getProductById(id);
        const data = res.data;
        setProduct(data);
        setSelectedImage(data.thumbnail || (data.images && data.images[0]) || fallbackImage);
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Product not found or unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
    } catch {
      // toast shown in context
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader text="Loading product details..." size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ErrorMessage message={error || 'Product not found'} />
        <button
          onClick={() => navigate('/products')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
      </div>
    );
  }

  const price = product.price || 0;
  const discount = product.discount_percentage || 0;
  const hasDiscount = discount > 0;
  const allImages = Array.from(
    new Set([product.thumbnail, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-600 transition">
          Products
        </Link>
        <span>/</span>
        {product.category?.name && (
          <>
            <Link
              to={`/products?category=${product.category.id}`}
              className="hover:text-brand-600 transition"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate max-w-[200px] text-slate-800 font-medium">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center p-4">
            <img
              src={selectedImage || fallbackImage}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                    selectedImage === img
                      ? 'border-brand-600 ring-2 ring-brand-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {product.brand || 'Original Brand'}
              </span>
              {product.category?.name && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {product.category.name}
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl leading-snug">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">{product.rating?.toFixed(1) || '4.8'}</span>
              </div>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-medium text-slate-600">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">{formatCurrency(price)}</span>
              {hasDiscount && (
                <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                  Special Offer: {formatDiscount(discount)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Tax included. Free insured delivery available on this order.
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About This Product</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || 'No detailed description available for this item.'}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantity</span>
              <div className="flex items-center rounded-xl border border-slate-300 bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99)}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 active:scale-[0.99] disabled:opacity-50 transition"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <Link
                to="/cart"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                View Cart
              </Link>
            </div>
          </div>

          {/* Value Props & Assurance */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Truck className="h-5 w-5 text-brand-600" />
              <span className="font-semibold text-slate-800">Free Shipping</span>
              <span className="text-[11px]">On all orders</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 border-x border-slate-200">
              <RotateCcw className="h-5 w-5 text-brand-600" />
              <span className="font-semibold text-slate-800">30-Day Returns</span>
              <span className="text-[11px]">Guaranteed exchange</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <span className="font-semibold text-slate-800">100% Authentic</span>
              <span className="text-[11px]">Direct brand origin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
