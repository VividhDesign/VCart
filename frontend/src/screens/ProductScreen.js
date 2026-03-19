import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, { loading: true, error: '', product: {}, loadingCreateReview: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeImg, setActiveImg] = useState('');
  const reviewsRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        setActiveImg(result.data.image);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.warning('Sorry, we do not have enough stock.');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Added to cart!');
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      setComment('');
      setRating(0);
      window.scrollTo({ top: reviewsRef.current.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div style={{ padding: '24px 0' }}>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 300px',
          gap: 28,
          alignItems: 'start',
        }}
        className="product-detail-grid"
      >
        {/* Images */}
        <div>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '1/1',
              marginBottom: 12,
            }}
          >
            <img
              src={activeImg || product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  style={{
                    width: 64,
                    height: 64,
                    padding: 0,
                    border: `2px solid ${activeImg === img ? 'var(--accent-primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'var(--bg-card)',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.brand} · {product.category}
          </p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>{product.name}</h1>
          <div style={{ marginBottom: 16 }}>
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </div>
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              marginBottom: 20,
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ${product.price?.toFixed(2)}
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ color: product.countInStock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className={`fas fa-${product.countInStock > 0 ? 'check-circle' : 'times-circle'}`}></i>
              {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="summary-card">
          <div className="summary-row">
            <span>Price</span>
            <strong style={{ color: 'var(--text-primary)' }}>${product.price?.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Status</span>
            <span className={`badge badge-${product.countInStock > 0 ? 'success' : 'danger'}`}>
              {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
            </span>
          </div>
          {product.countInStock > 0 && (
            <div className="summary-row">
              <span>Quantity</span>
              <div className="cart-qty-control">
                <button className="qty-btn" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" disabled={qty >= product.countInStock} onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>
          )}
          <hr className="divider" />
          {product.countInStock > 0 ? (
            <button
              className="btn btn-primary w-100"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={addToCartHandler}
              id="add-to-cart-btn"
            >
              <i className="fas fa-cart-plus"></i> Add to Cart
            </button>
          ) : (
            <button className="btn btn-outline w-100" disabled style={{ width: '100%', justifyContent: 'center' }}>
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div ref={reviewsRef} style={{ marginTop: 48 }}>
        <h2 className="section-title" style={{ marginBottom: 24 }}>Customer Reviews</h2>

        {product.reviews?.length === 0 && (
          <MessageBox>No reviews yet. Be the first to review!</MessageBox>
        )}

        {product.reviews?.map((review) => (
          <div
            key={review._id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontSize: '0.9rem' }}>{review.name}</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Rating rating={review.rating} />
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.875rem' }}>{review.comment}</p>
          </div>
        ))}

        {userInfo ? (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Write a Review</h3>
            <form onSubmit={submitReviewHandler}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{ maxWidth: 200 }}
                >
                  <option value="">Select rating...</option>
                  <option value="1">⭐ 1 - Poor</option>
                  <option value="2">⭐⭐ 2 - Fair</option>
                  <option value="3">⭐⭐⭐ 3 - Good</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loadingCreateReview}
                id="submit-review-btn"
              >
                {loadingCreateReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <MessageBox>
            Please <a href="/signin" style={{ color: 'var(--accent-secondary)' }}>sign in</a> to write a review.
          </MessageBox>
        )}
      </div>
    </div>
  );
}
