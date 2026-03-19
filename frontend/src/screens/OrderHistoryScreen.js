import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true, error: '', orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div style={{ padding: '28px 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>My Orders</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📋</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No orders yet</h3>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className="badge badge-success">{new Date(order.paidAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className="badge badge-success">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="badge badge-danger">Not Delivered</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/order/${order._id}`)}>
                      <i className="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
