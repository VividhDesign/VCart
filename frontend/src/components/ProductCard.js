import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useContext } from 'react';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (e) => {
    e.preventDefault();
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.warning('Sorry, this product is out of stock.');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        {product.featured && (
          <span className="product-card-badge">⭐ Featured</span>
        )}
        {product.countInStock === 0 && (
          <span className="product-card-badge" style={{ background: 'rgba(239,68,68,0.8)', top: 'auto', bottom: 12, left: 12 }}>
            Out of Stock
          </span>
        )}
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.slug}`} className="product-card-title">
          {product.name}
        </Link>
        <p className="product-card-brand">{product.brand}</p>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="product-card-footer">
          <div className="product-price">
            <span>$</span>{product.price.toFixed(2)}
          </div>
          {product.countInStock > 0 ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={addToCartHandler}
              title="Add to cart"
            >
              <i className="fas fa-cart-plus"></i>
            </button>
          ) : (
            <button className="btn btn-outline btn-sm" disabled>
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
