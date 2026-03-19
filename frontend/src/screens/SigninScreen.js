import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/signin', { email, password });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      navigate(redirect || '/');
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
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚡</div>
          <h1 className="form-title">Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in to your VCart account</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -12 }}>
            <Link to="/forget-password" style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} id="signin-btn">
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          New to VCart?{' '}
          <Link to={`/signup?redirect=${redirect}`} style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
