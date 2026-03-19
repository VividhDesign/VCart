import { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST': return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS': return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL': return { ...state, loadingDelete: false };
    case 'DELETE_RESET': return { ...state, successDelete: false };
    default: return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true, error: '', orders: [], loadingDelete: false, successDelete: false,
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) dispatch({ type: 'DELETE_RESET' });
    else fetchData();
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (!window.confirm(`Delete order #${order._id.slice(-8).toUpperCase()}?`)) return;
    dispatch({ type: 'DELETE_REQUEST' });
    try {
      await axios.delete(`/api/orders/${order._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Order deleted');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>All Orders</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>{order.user ? order.user.name : 'Deleted User'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>${order.totalPrice.toFixed(2)}</td>
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
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/order/${order._id}`)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteHandler(order)} disabled={loadingDelete}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
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
