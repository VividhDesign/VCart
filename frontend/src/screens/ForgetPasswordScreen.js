import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Link } from 'react-router-dom';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/users/forget-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(getError(err));
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
          <h1 className="form-title">Forgot Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>We'll send a reset link to your email</p>
        </div>
        {sent ? (
          <div>
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <i className="fas fa-check-circle"></i>
              Reset link sent! Check your inbox (and spam folder).
            </div>
            <Link to="/signin" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} id="reset-link-btn">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-paper-plane"></i> Send Reset Link</>}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/signin" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
