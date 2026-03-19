import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/signup', { name, email, password });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      navigate(redirect || '/');
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(getError(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  return (
    <div className="form-container">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚀</div>
          <h1 className="form-title">Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join thousands of VCart shoppers</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-control" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" className="form-control" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading} id="signup-btn">
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`} style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
