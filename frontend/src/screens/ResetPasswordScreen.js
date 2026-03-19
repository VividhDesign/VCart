import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function ResetPasswordScreen() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await axios.post('/api/users/reset-password', { token, password });
      toast.success('Password reset successfully!');
      navigate('/signin');
    } catch (err) {
      toast.error(getError(err));
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔑</div>
          <h1 className="form-title">Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Choose a strong new password</p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} id="reset-password-btn">
            {loading ? 'Resetting...' : <><i className="fas fa-check"></i> Reset Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}
