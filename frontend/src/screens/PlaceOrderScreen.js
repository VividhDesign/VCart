import { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const steps = [
    { label: 'Sign In', done: true },
    { label: 'Shipping', done: true },
    { label: 'Payment', done: true },
    { label: 'Place Order', active: true },
  ];
  return (
    <div className="checkout-steps" style={{ marginBottom: 32 }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step${step.done ? ' done' : step.active ? ' active' : ''}`}>
            <div className="step-circle">
              {step.done ? <i className="fas fa-check" style={{ fontSize: '0.7rem' }}></i> : i + 1}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="step-connector" style={{ background: step.done ? 'var(--success)' : 'var(--border)' }}></div>
          )}
        </div>
      ))}
    </div>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST': return { ...state, loading: true };
    case 'CREATE_SUCCESS': return { ...state, loading: false };
    case 'CREATE_FAIL': return { ...state, loading: false };
    default: return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.18 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment');
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>Review Your Order</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Shipping */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1rem' }}>📦 Shipping Address</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {cart.shippingAddress.fullName}<br />
              {cart.shippingAddress.address}<br />
              {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}<br />
              {cart.shippingAddress.country}
            </p>
            <Link to="/shipping" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
              ✏️ Edit
            </Link>
          </div>

          {/* Payment */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1rem' }}>💳 Payment Method</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{cart.paymentMethod}</p>
            <Link to="/payment" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
              ✏️ Edit
            </Link>
          </div>

          {/* Items */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1rem' }}>🛒 Order Items</h3>
            {cart.cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, background: 'var(--bg-secondary)' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.slug}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>{item.name}</Link>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.quantity} × ${item.price.toFixed(2)}</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax (18%)</span><span>${taxPrice.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            onClick={placeOrderHandler}
            disabled={loading || cart.cartItems.length === 0}
            id="place-order-btn"
          >
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Placing...</> : <><i className="fas fa-check-circle"></i> Place Order</>}
          </button>
        </div>
      </div>
    </div>
  );
}
