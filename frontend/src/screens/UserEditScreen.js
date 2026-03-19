import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST': return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS': return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL': return { ...state, loadingUpdate: false };
    default: return state;
  }
};

export default function UserEditScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true, error: '', loadingUpdate: false,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      await axios.put(`/api/users/${userId}`, { name, email, isAdmin }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;

  return (
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/users')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Edit User</h1>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700,
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{email}</div>
            </div>
          </div>
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: isAdmin ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-secondary)',
                border: `1px solid ${isAdmin ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                marginBottom: 20,
                transition: 'var(--transition)',
              }}
              onClick={() => setIsAdmin(!isAdmin)}
            >
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--info)', cursor: 'pointer' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin Privileges</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Grant full admin access to this user</div>
              </div>
              {isAdmin && <span className="badge badge-info" style={{ marginLeft: 'auto' }}>Admin</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loadingUpdate} id="update-user-btn">
              {loadingUpdate ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
