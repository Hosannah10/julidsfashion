import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { checkout, notifyShopOrderPlaced } from '../services/api';
import { type OrderStatus } from '../context/CartContext';
import './styles/Checkout.css';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phone, setPhone] = useState('');

  // auto-fill name & email
  const name = user?.name || '';
  const email = user?.email || '';

  let status = 'pending' as OrderStatus;

  const handleSubmit = async () => {

    setIsSubmitting(true);

    if (!user) {
      showToast('Please login to checkout');
      navigate('/login');
      return;
    }

    try {
      const payload = cartItems.map((i) => ({
        id: i.id,
        wearName: i.product.wearName,
        price: i.product.price,
        category: i.product.category,
        description: i.product.description,
        image: i.product.image,
        quantity: i.quantity,
        status: status,
        total: i.product.price * i.quantity,
        name: name,
        email: email,
        phone: phone
      }));

      for (const item of payload) {
        const created = await checkout(item);
        console.log(item)
        // Use created.id and created.email (server-returned) if available
        const idToNotify = created?.id ?? item.id;
        try {
          await notifyShopOrderPlaced( idToNotify, item.email );
        } catch (e) {
          console.warn('notify failed', e);
        }
      }

      await clearCart();
      showToast('Order placed successfully');
      navigate('/shop-orders');

    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>Checkout</h1>

        <form>
          <p className="checkout-subtext">Pickup & Delivery Available</p>

          {/* NAME (readonly) */}
          <label className="checkout-label">
            Name
            <input
              className="checkout-input"
              value={name}
              disabled       // cannot edit
            />
          </label>

          {/* EMAIL (readonly) */}
          <label className="checkout-label">
            Email
            <input
              className="checkout-input"
              value={email}
              disabled       // cannot edit
            />
          </label>

          {/* PHONE (editable) */}
          <label className="checkout-label">
            Phone
            <input
              className="checkout-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <div className="checkout-actions">
            <button
              type="button"
              className="checkout-btn secondary-btn"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>

            <button type="button" disabled={isSubmitting} className="checkout-btn primary-btn" onClick={handleSubmit}>
              {isSubmitting ? "Confirming..." : "Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
