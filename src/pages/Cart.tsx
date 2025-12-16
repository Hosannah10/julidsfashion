import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import "./styles/Cart.css";

const Cart: React.FC = () => {
  const { cartItems, total, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!user) {
      showToast('Please login to proceed');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) return <div className="cart-container"><p>Loading cart...</p></div>;

  return (
    <section className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-card">
              <img
                src={item.product.image || ""}
                alt={item.product.wearName}
                className="cart-img"
              />

              <div className="cart-info">
                <h4>{item.product.wearName}</h4>
                <p className="price">₦{item.product.price?.toLocaleString?.()}</p>

                <div className="cart-actions">
                  <button
                    className="btn qty-btn"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </button>

                  <span className="qty">{item.quantity}</span>

                  <button
                    className="btn qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>

                  <button
                    className="btn remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-footer">
            <strong className="total">Total: ₦{total.toLocaleString()}</strong>

            <div className="footer-actions">
              <button className="btn clear-btn" onClick={clearCart}>Clear</button>
              <button className="btn btn-gold" onClick={handleProceed}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
