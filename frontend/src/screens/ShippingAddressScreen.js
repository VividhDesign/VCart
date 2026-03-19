import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const steps = [
    { label: 'Sign In', active: step1, done: step2 },
    { label: 'Shipping', active: step2, done: step3 },
    { label: 'Payment', active: step3, done: step4 },
    { label: 'Place Order', active: step4, done: false },
  ];
  return (
    <div className="checkout-steps" style={{ marginBottom: 36 }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step${step.done ? ' done' : step.active ? ' active' : ''}`}>
            <div className="step-circle">
              {step.done ? <i className="fas fa-check" style={{ fontSize: '0.7rem' }}></i> : i + 1}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="step-connector" style={{ background: step.done ? 'var(--success)' : 'var(--border)' }}></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart: { shippingAddress } } = state;

  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  useEffect(() => {
    if (!userInfo) navigate('/signin?redirect=/shipping');
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    navigate('/payment');
  };

  return (
    <div className="form-container" style={{ maxWidth: 540 }}>
      <CheckoutSteps step1 step2 />
      <div className="form-card">
        <h1 className="form-title">Shipping Address</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main St, Apt 4B" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="New York" />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input className="form-control" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="10001" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="United States" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} id="continue-to-payment-btn">
            <i className="fas fa-arrow-right"></i> Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
