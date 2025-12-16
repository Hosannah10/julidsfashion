import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { type Product as ProductType } from "../context/CartContext";
import { fetchProduct } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Helmet } from "react-helmet-async";
import './styles/ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id).then((d) => setProduct(d)).catch(() => {});
  }, [id]);

  const handleAdd = (p: any) => {
    if (!user) {
      showToast('Please login to add to cart');
      navigate('/login');
      return;
    }
    if (product) addToCart(p, 1);
    showToast('Added to cart');
  };

  if (!product)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <section className="container product-detail">
      <Helmet>
        <title>
          {product.wearName} | JuliD’s Fashion World
        </title>

        <meta
          name="description"
          content={`Buy ${product.wearName} at JuliD’s Fashion World. ${product.description?.slice(0, 140)}`}
        />

        <link
          rel="canonical"
          href={`https://julidsfashion.com/product/${product.id}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={product.wearName} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.wearName,
            "image": product.image,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "JuliD’s Fashion World"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "NGN",
              "price": product.price,
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <div className="product-detail-wrapper">
        <img
          src={product.image || ''}    //src={product.image?.[0] || ''}
          className="product-detail-image"
          alt={`${product.wearName} by JuliD’s Fashion World`}
          loading="lazy"
        />

        <div className="product-info">
          <h2>{product.wearName}</h2>

          <p className="product-price">₦{product.price?.toLocaleString?.()}</p>

          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <button className="btn-gold" onClick={() => handleAdd({product:product})}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

