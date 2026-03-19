import { useContext, useReducer, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST': return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS': return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL': return { ...state, loadingUpdate: false };
    default: return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, { loadingUpdate: false });

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      toast.success('Profile updated successfully!');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: 12,
            }}
          >
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{userInfo.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{userInfo.email}</p>
          {userInfo.isAdmin && (
            <span className="badge badge-info" style={{ marginTop: 8 }}>Admin</span>
          )}
        </div>

        <div className="form-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Edit Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <hr className="divider" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>Leave password blank to keep your current one</p>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loadingUpdate} id="update-profile-btn">
              {loadingUpdate ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
