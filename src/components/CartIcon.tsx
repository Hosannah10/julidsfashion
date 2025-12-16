import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './styles/CartIcon.css';

const CartIcon:React.FC = ()=>{
  const { cartItems } = useCart();
  const count = cartItems.reduce((s,i)=> s + (i.quantity||0), 0);
  return (
    <Link to="/cart" className="cart-icon" aria-label="Cart">
      <span className="cart-badge">{count}</span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 6h15l-1.5 9h-11L6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/>
      </svg>
    </Link>
  )
}
export default CartIcon;
