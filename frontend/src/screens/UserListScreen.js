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
    case 'FETCH_SUCCESS': return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST': return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS': return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL': return { ...state, loadingDelete: false };
    case 'DELETE_RESET': return { ...state, successDelete: false };
    default: return state;
  }
};

export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true, error: '', users: [], loadingDelete: false, successDelete: false,
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/users', {
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

  const deleteHandler = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    dispatch({ type: 'DELETE_REQUEST' });
    try {
      await axios.delete(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('User deleted');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>All Users</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{user._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge badge-info">Admin</span>
                    ) : (
                      <span className="badge badge-warning">User</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/user/${user._id}`)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteHandler(user)}
                        disabled={loadingDelete || user.email === 'admin@example.com'}
                      >
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
