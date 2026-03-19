import { useEffect, useReducer, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import Rating from '../components/Rating';

const PAGE_SIZE = 8;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, ...action.payload, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

const PRICES = [
  { name: 'Any', value: '' },
  { name: '$1 – $100', value: '1-100' },
  { name: '$101 – $500', value: '101-500' },
  { name: '$501 – $1000', value: '501-1000' },
  { name: '$1000+', value: '1000-9999' },
];

const RATINGS = [4, 3, 2, 1];
const SORT_OPTIONS = [
  { value: 'newest', label: '🕐 Newest' },
  { value: 'lowest', label: '💲 Price: Low' },
  { value: 'highest', label: '💰 Price: High' },
  { value: 'toprated', label: '⭐ Top Rated' },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
    loading: true, error: '', products: [], pages: 0, countProducts: 0,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/products/search?pageSize=${PAGE_SIZE}&page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [category, query, price, rating, order, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter, skip = false) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${skip ? 1 : filterPage}`;
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>
        {/* Filters Sidebar */}
        <aside>
          <div className="card card-body" style={{ position: 'sticky', top: 90 }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>Categories</p>
              {['all', ...categories].map((c) => (
                <Link
                  key={c}
                  to={getFilterUrl({ category: c }, true)}
                  style={{
                    display: 'block',
                    padding: '7px 0',
                    color: c === category ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: c === category ? 600 : 400,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {c === 'all' ? '🔍 All Categories' : c}
                </Link>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>Price Range</p>
              {PRICES.map((p) => (
                <Link
                  key={p.value}
                  to={getFilterUrl({ price: p.value || 'all' }, true)}
                  style={{
                    display: 'block',
                    padding: '6px 0',
                    color: p.value === (price === 'all' ? '' : price) ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: p.value === (price === 'all' ? '' : price) ? 600 : 400,
                  }}
                >
                  {p.name}
                </Link>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>Customer Rating</p>
              <Link to={getFilterUrl({ rating: 'all' }, true)} style={{ display: 'block', padding: '6px 0', color: rating === 'all' ? 'var(--accent-secondary)' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                Any Rating
              </Link>
              {RATINGS.map((r) => (
                <Link key={r} to={getFilterUrl({ rating: r }, true)} style={{ display: 'block', padding: '6px 0', textDecoration: 'none' }}>
                  <Rating rating={r} caption={`& up`} />
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {loading ? '...' : `${countProducts} results`}
              {query !== 'all' && ` for "${query}"`}
              {category !== 'all' && ` in ${category}`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</label>
              <select
                className="form-control"
                value={order}
                onChange={(e) => navigate(getFilterUrl({ order: e.target.value }, true))}
                style={{ padding: '6px 12px', width: 'auto' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(category !== 'all' || query !== 'all' || price !== 'all' || rating !== 'all') && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {category !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: 20, fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                  {category}
                  <Link to={getFilterUrl({ category: 'all' }, true)} style={{ color: 'inherit' }}>✕</Link>
                </span>
              )}
              <Link to="/search" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', alignSelf: 'center' }}>Clear all</Link>
            </div>
          )}

          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <h3 style={{ color: 'var(--text-secondary)' }}>No products found</h3>
              <Link to="/search" className="btn btn-outline" style={{ marginTop: 16 }}>Clear Filters</Link>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages).keys()].map((x) => (
                    <Link
                      key={x + 1}
                      to={getFilterUrl({ page: x + 1 })}
                      className={`page-btn${x + 1 === Number(page) ? ' active' : ''}`}
                    >
                      {x + 1}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
