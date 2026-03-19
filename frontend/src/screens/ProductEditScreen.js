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

export default function ProductEditScreen() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true, error: '', loadingUpdate: false,
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setBrand(data.brand);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setFeatured(data.featured || false);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      await axios.put(
        `/api/products/${productId}`,
        { name, slug, price, image, images: [], category, brand, countInStock, description, featured },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully!');
      navigate('/admin/products');
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
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/products')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Edit Product</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div className="form-card" style={{ borderRadius: 'var(--radius-lg)', padding: 28 }}>
          <form onSubmit={submitHandler}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input className="form-control" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Count In Stock</label>
                <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-control" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://..." />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="featured-check" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                Mark as Featured Product
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loadingUpdate} id="save-product-btn">
              {loadingUpdate ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="card card-body" style={{ position: 'sticky', top: 90 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Preview
          </h3>
          {image && (
            <img
              src={image}
              alt={name}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12, background: 'var(--bg-secondary)' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>{name || 'Product Name'}</strong>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 8 }}>{brand} · {category}</p>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${parseFloat(price || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
