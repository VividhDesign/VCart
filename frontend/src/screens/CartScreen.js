import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.warning('Sorry, product is out of stock.');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.info(`${item.name} removed from cart.`);
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div style={{ padding: '28px 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>
        Shopping Cart
        {cartItems.length > 0 && (
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 12 }}>
            ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
          </span>
        )}
      </h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
          <h2 style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary btn-lg" id="start-shopping-btn">
            <i className="fas fa-rocket"></i> Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  gap: 16,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 16,
                  marginBottom: 12,
                  alignItems: 'center',
                  transition: 'var(--transition)',
                }}
              >
                <Link to={`/product/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      flexShrink: 0,
                    }}
                  />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/product/${item.slug}`}
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: 4,
                      fontSize: '0.95rem',
                    }}
                  >
                    {item.name}
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{item.brand}</p>
                  <div className="cart-qty-control">
                    <button className="qty-btn" disabled={item.quantity <= 1} onClick={() => updateCartHandler(item, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" disabled={item.quantity >= item.countInStock} onClick={() => updateCartHandler(item, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                    ${item.price.toFixed(2)} each
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItemHandler(item)}
                    title="Remove"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              id="checkout-btn"
            >
              <i className="fas fa-lock"></i> Proceed to Checkout
            </button>
            <Link
              to="/"
              style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
