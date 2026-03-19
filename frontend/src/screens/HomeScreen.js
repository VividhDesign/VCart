import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CATEGORIES = [
  { name: 'Laptops', icon: '💻', slug: 'Laptops' },
  { name: 'Smartphones', icon: '📱', slug: 'Smartphones' },
  { name: 'Headphones', icon: '🎧', slug: 'Headphones' },
  { name: 'Tablets', icon: '📟', slug: 'Tablets' },
  { name: 'TVs', icon: '📺', slug: 'TVs' },
  { name: 'Wearables', icon: '⌚', slug: 'Wearables' },
  { name: 'Gaming', icon: '🎮', slug: 'Gaming' },
];

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const featured = products.filter((p) => p.featured);
  const all = products;

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ padding: '48px 0 32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(108, 99, 255, 0.1)',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            borderRadius: 20,
            padding: '6px 16px',
            fontSize: '0.82rem',
            color: 'var(--accent-secondary)',
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          ✨ New Arrivals Every Week
        </div>
        <h1 className="hero-title">
          Shop the Future<br />
          <span className="hero-gradient-text">Discover Premium Tech</span>
        </h1>
        <p className="hero-subtitle">
          Curated electronics, unbeatable prices — delivered fast to your door.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search" className="btn btn-primary btn-lg" id="shop-now-btn">
            <i className="fas fa-rocket"></i> Shop Now
          </Link>
          <Link to="/search?order=toprated" className="btn btn-outline btn-lg" id="top-rated-btn">
            <i className="fas fa-star"></i> Top Rated
          </Link>
        </div>
      </section>

      {/* Category Chips */}
      <section style={{ padding: '16px 0 32px' }}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="section-header">
                <h2 className="section-title">Featured Products</h2>
                <Link to="/search?order=featured" className="btn btn-outline btn-sm">
                  View All <i className="fas fa-arrow-right" style={{ marginLeft: 4 }}></i>
                </Link>
              </div>
              <div className="product-grid">
                {featured.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* All Products */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">All Products</h2>
              <Link to="/search" className="btn btn-outline btn-sm">
                Browse All <i className="fas fa-arrow-right" style={{ marginLeft: 4 }}></i>
              </Link>
            </div>
            <div className="product-grid">
              {all.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
