import { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': return { ...state, loading: true };
    case 'FETCH_SUCCESS': return { ...state, products: action.payload.products, pages: action.payload.pages, page: action.payload.page, loading: false };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST': return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS': return { ...state, loadingCreate: false };
    case 'CREATE_FAIL': return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST': return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS': return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL': return { ...state, loadingDelete: false };
    case 'DELETE_RESET': return { ...state, loadingDelete: false, successDelete: false };
    default: return state;
  }
};

export default function ProductListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, products, pages, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true, error: '', products: [], pages: 0, loadingCreate: false, loadingDelete: false, successDelete: false,
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) dispatch({ type: 'DELETE_RESET' });
    else fetchData();
  }, [userInfo, page, successDelete]);

  const createHandler = async () => {
    if (!window.confirm('Create a new product?')) return;
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post('/api/products', {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Product created!');
      navigate(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const deleteHandler = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    dispatch({ type: 'DELETE_REQUEST' });
    try {
      await axios.delete(`/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Products</h1>
        <button className="btn btn-primary" onClick={createHandler} disabled={loadingCreate} id="create-product-btn">
          {loadingCreate ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : <><i className="fas fa-plus"></i> New Product</>}
        </button>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} />
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: 200 }}>
                      {product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}
                    </td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${product.countInStock > 0 ? 'success' : 'danger'}`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/product/${product._id}`)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteHandler(product)} disabled={loadingDelete}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="pagination">
              {[...Array(pages).keys()].map((x) => (
                <button key={x + 1} className={`page-btn${x + 1 === page ? ' active' : ''}`} onClick={() => setPage(x + 1)}>
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
