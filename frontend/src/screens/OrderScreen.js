import { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS': return { ...state, order: action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST': return { ...state, loadingPay: true };
    case 'PAY_SUCCESS': return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL': return { ...state, loadingPay: false };
    case 'PAY_RESET': return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST': return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS': return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL': return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET': return { ...state, loadingDeliver: false, successDeliver: false };
    default: return state;
  }
};

export default function OrderScreen() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] =
    useReducer(reducer, { loading: true, order: {}, error: '', successPay: false, loadingPay: false, loadingDeliver: false, successDeliver: false });

  const fetchOrder = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    if (!userInfo) { navigate('/signin'); return; }
    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) dispatch({ type: 'PAY_RESET' });
      if (successDeliver) dispatch({ type: 'DELIVER_RESET' });
    }
  }, [order, userInfo, orderId, successPay, successDeliver]);

  const deliverHandler = async () => {
    dispatch({ type: 'DELIVER_REQUEST' });
    try {
      await axios.put(`/api/orders/${order._id}/deliver`, {}, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELIVER_SUCCESS' });
      toast.success('Order marked as delivered');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL' });
      toast.error(getError(err));
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;

  return (
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          Order <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1rem' }}>#{order._id?.slice(-8).toUpperCase()}</span>
        </h1>
        <span className={`badge badge-${order.isPaid ? 'success' : 'warning'}`}>
          {order.isPaid ? '✓ Paid' : 'Pending Payment'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Shipping */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📦 Shipping</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 10 }}>
              <strong>{order.shippingAddress?.fullName}</strong><br />
              {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            {order.isDelivered ? (
              <MessageBox variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</MessageBox>
            ) : (
              <MessageBox variant="warning">Not yet delivered</MessageBox>
            )}
          </div>

          {/* Payment */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>💳 Payment</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 10 }}>Method: <strong>{order.paymentMethod}</strong></p>
            {order.isPaid ? (
              <MessageBox variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</MessageBox>
            ) : (
              <MessageBox variant="warning">Awaiting payment</MessageBox>
            )}
          </div>

          {/* Items */}
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🛒 Order Items</h3>
            {order.orderItems?.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.slug}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>{item.name}</Link>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.quantity} × ${item.price.toFixed(2)}</span>
                <strong style={{ minWidth: 70, textAlign: 'right' }}>${(item.quantity * item.price).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row"><span>Items</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>${order.totalPrice?.toFixed(2)}</span></div>

          {!order.isPaid && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
                Payment integration pending. Contact support to process payment.
              </div>
            </div>
          )}

          {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              onClick={deliverHandler}
              disabled={loadingDeliver}
              id="deliver-btn"
            >
              {loadingDeliver ? 'Processing...' : <><i className="fas fa-truck"></i> Mark as Delivered</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
