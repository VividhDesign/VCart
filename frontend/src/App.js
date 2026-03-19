import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SearchBox from './components/SearchBox';
import { getError } from './utils';
import axios from 'axios';
import { useContext, useEffect, useState, useRef } from 'react';
import { Store } from './Store';

function NavDropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={`nav-dropdown${open ? ' open' : ''}`} ref={ref}>
      <button
        className="nav-link-item"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        {label} <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem', marginLeft: 2 }}></i>
      </button>
      <div className="nav-dropdown-menu">{children}</div>
    </div>
  );
}

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cart.cartItems.reduce((a, c) => a + c.quantity, 0);

  return (
    <BrowserRouter>
      <div className="site-container">
        <ToastContainer position="bottom-center" limit={1} theme="dark" />

        {/* Navbar */}
        <nav className={`navbar-vcart${scrolled ? ' scrolled' : ''}`}>
          <button
            className="hamburger-btn"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            style={{ marginRight: 12 }}
          >
            <i className={`fas fa-${sidebarIsOpen ? 'times' : 'bars'}`}></i>
          </button>

          <Link to="/" className="navbar-brand" style={{ marginRight: 12 }}>
            ⚡ VCart
          </Link>

          <SearchBox />

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
            <Link to="/cart" className="nav-link-item">
              <i className="fas fa-shopping-cart"></i>
              <span className="d-none d-sm-inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="nav-cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {userInfo ? (
              <NavDropdown label={<><i className="fas fa-user"></i> {userInfo.name.split(' ')[0]}</>}>
                <Link className="nav-dropdown-item" to="/profile">
                  <i className="fas fa-id-card" style={{ marginRight: 8, opacity: 0.6 }}></i>Profile
                </Link>
                <Link className="nav-dropdown-item" to="/orderhistory">
                  <i className="fas fa-history" style={{ marginRight: 8, opacity: 0.6 }}></i>Orders
                </Link>
                <div className="nav-dropdown-divider" />
                <button className="nav-dropdown-item" onClick={signoutHandler} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)' }}>
                  <i className="fas fa-sign-out-alt" style={{ marginRight: 8, opacity: 0.8 }}></i>Sign Out
                </button>
              </NavDropdown>
            ) : (
              <Link className="nav-link-item" to="/signin">
                <i className="fas fa-sign-in-alt"></i> Sign In
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown label={<><i className="fas fa-shield-alt"></i> Admin</>}>
                <Link className="nav-dropdown-item" to="/admin/dashboard">
                  <i className="fas fa-chart-line" style={{ marginRight: 8, opacity: 0.6 }}></i>Dashboard
                </Link>
                <Link className="nav-dropdown-item" to="/admin/products">
                  <i className="fas fa-box" style={{ marginRight: 8, opacity: 0.6 }}></i>Products
                </Link>
                <Link className="nav-dropdown-item" to="/admin/orders">
                  <i className="fas fa-receipt" style={{ marginRight: 8, opacity: 0.6 }}></i>Orders
                </Link>
                <Link className="nav-dropdown-item" to="/admin/users">
                  <i className="fas fa-users" style={{ marginRight: 8, opacity: 0.6 }}></i>Users
                </Link>
              </NavDropdown>
            )}
          </div>
        </nav>

        {/* Sidebar overlay */}
        <div
          className={`side-overlay${sidebarIsOpen ? ' active' : ''}`}
          onClick={() => setSidebarIsOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`side-navbar${sidebarIsOpen ? ' active-nav' : ''}`}>
          <p className="sidebar-title">Browse Categories</p>
          {categories.map((category) => (
            <Link
              key={category}
              className="sidebar-link"
              to={`/search?category=${category}`}
              onClick={() => setSidebarIsOpen(false)}
            >
              <i className="fas fa-tag" style={{ opacity: 0.5, fontSize: '0.8rem' }}></i>
              {category}
            </Link>
          ))}
        </aside>

        <main>
          <div className="container-custom">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/forget-password" element={<ForgetPasswordScreen />} />
              <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
              <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>} />
            </Routes>
          </div>
        </main>

        <footer>
          <p className="footer-text">
            © 2026 <span>VCart</span> — Premium E-Commerce Experience
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
