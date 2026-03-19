import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, summary: action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true, error: '', summary: { salesData: [] },
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;

  const totalOrders = summary.orders?.[0]?.numOrders || 0;
  const totalSales = summary.orders?.[0]?.totalSales?.toFixed(2) || '0.00';
  const totalUsers = summary.users?.[0]?.numUsers || 0;
  const totalProducts = summary.productCategories?.reduce((a, c) => a + c.count, 0) || 0;

  return (
    <div style={{ padding: '28px 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">💰</div>
          <div>
            <div className="stat-value">${totalSales}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div>
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div>
            <div className="stat-value">{totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">🏷️</div>
          <div>
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
      </div>

      {/* Daily Sales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>📈 Daily Sales</h3>
          {summary.dailyOrders?.length === 0 ? (
            <MessageBox>No sales data yet</MessageBox>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>ORDERS</th>
                    <th>SALES</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.dailyOrders?.map((x) => (
                    <tr key={x._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{x._id}</td>
                      <td>{x.orders}</td>
                      <td style={{ fontWeight: 600 }}>${x.sales.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>🏷️ Products by Category</h3>
          {summary.productCategories?.length === 0 ? (
            <MessageBox>No category data</MessageBox>
          ) : (
            <div>
              {summary.productCategories?.map((x) => (
                <div key={x._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{x._id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: `${Math.max(20, (x.count / totalProducts) * 100)}px`,
                      height: 6,
                      background: 'var(--accent-gradient)',
                      borderRadius: 3,
                      maxWidth: 120,
                    }}></div>
                    <span className="badge badge-info">{x.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
