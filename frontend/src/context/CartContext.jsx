import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null); // active backend Cart object
  const [cartItems, setCartItems] = useState([]); // list of items with product details
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the active cart from the backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local fallback for guest cart
      try {
        const guestCart = localStorage.getItem('guest_cart');
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
      } catch {
        setCartItems([]);
      }
      setCart(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await cartService.getAllCarts({ page: 1, limit: 10 });
      const cartsList = res.data || [];
      if (cartsList.length > 0) {
        // Use most recent active cart
        const latestCart = cartsList[cartsList.length - 1];
        setCart(latestCart);
        setCartItems(latestCart.cart_items || []);
      } else {
        setCart(null);
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load user cart:', err);
      setCart(null);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!isAuthenticated) {
      // Manage in guest cart
      const existingIndex = cartItems.findIndex(
        (item) => (item.product_id || item.product?.id) === product.id
      );
      let updated;
      if (existingIndex > -1) {
        updated = [...cartItems];
        updated[existingIndex].quantity += qty;
      } else {
        updated = [
          ...cartItems,
          {
            id: Date.now(),
            product_id: product.id,
            quantity: qty,
            subtotal: qty * product.price * (product.discount_percentage ? product.discount_percentage / 100 : 1),
            product,
          },
        ];
      }
      setCartItems(updated);
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      toast.success(`Added ${product.title} to cart`);
      return;
    }

    setIsLoading(true);
    try {
      if (cart && cart.id) {
        // Append or update existing item in active cart
        const existingItem = cartItems.find((item) => item.product_id === product.id);
        let newItemsPayload;

        if (existingItem) {
          newItemsPayload = cartItems.map((item) =>
            item.product_id === product.id
              ? { product_id: item.product_id, quantity: item.quantity + qty }
              : { product_id: item.product_id, quantity: item.quantity }
          );
        } else {
          newItemsPayload = [
            ...cartItems.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
            { product_id: product.id, quantity: qty },
          ];
        }

        const res = await cartService.updateCart(cart.id, newItemsPayload);
        setCart(res.data);
        setCartItems(res.data.cart_items || []);
      } else {
        // Create new cart session on backend
        const res = await cartService.createCart([{ product_id: product.id, quantity: qty }]);
        setCart(res.data);
        setCartItems(res.data.cart_items || []);
      }
      toast.success(`Added ${product.title} to cart`);
    } catch (err) {
      toast.error('Failed to update cart on server');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    if (!isAuthenticated) {
      const updated = cartItems.map((item) =>
        (item.product_id || item.product?.id) === productId
          ? { ...item, quantity: qty }
          : item
      );
      setCartItems(updated);
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      return;
    }

    if (!cart?.id) return;

    setIsLoading(true);
    try {
      const newItemsPayload = cartItems.map((item) =>
        item.product_id === productId
          ? { product_id: item.product_id, quantity: qty }
          : { product_id: item.product_id, quantity: item.quantity }
      );
      const res = await cartService.updateCart(cart.id, newItemsPayload);
      setCart(res.data);
      setCartItems(res.data.cart_items || []);
    } catch (err) {
      toast.error('Failed to update quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      const updated = cartItems.filter(
        (item) => (item.product_id || item.product?.id) !== productId
      );
      setCartItems(updated);
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      toast.success('Item removed from cart');
      return;
    }

    if (!cart?.id) return;

    const remainingItems = cartItems.filter((item) => item.product_id !== productId);

    setIsLoading(true);
    try {
      if (remainingItems.length === 0) {
        // If all items removed, delete cart
        await cartService.deleteCart(cart.id);
        setCart(null);
        setCartItems([]);
      } else {
        const payload = remainingItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        const res = await cartService.updateCart(cart.id, payload);
        setCart(res.data);
        setCartItems(res.data.cart_items || []);
      }
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      localStorage.removeItem('guest_cart');
      return;
    }

    if (cart?.id) {
      setIsLoading(true);
      try {
        await cartService.deleteCart(cart.id);
        setCart(null);
        setCartItems([]);
        toast.success('Cart cleared');
      } catch (err) {
        toast.error('Failed to clear cart');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Subtotal based on full retail prices
  const rawSubtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  // Actual total amount calculated from backend subtotal or price after discount
  const totalAmount = cart?.total_amount != null
    ? cart.total_amount
    : cartItems.reduce((acc, item) => {
        const price = item.product?.price || 0;
        const discount = item.product?.discount_percentage || 0;
        const effectivePrice = discount > 0 ? (price * discount) / 100 : price;
        return acc + effectivePrice * (item.quantity || 1);
      }, 0);

  const totalSavings = Math.max(0, rawSubtotal - totalAmount);

  const value = {
    cart,
    cartItems,
    isLoading,
    totalItemsCount,
    rawSubtotal,
    totalAmount,
    totalSavings,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
