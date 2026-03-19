import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const steps = [
    { label: 'Sign In', done: step2 },
    { label: 'Shipping', done: step3 },
    { label: 'Payment', active: step3, done: step4 },
    { label: 'Place Order', active: step4 },
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

const PAYMENT_METHODS = [
  { value: 'PayPal', label: 'PayPal', icon: '💳', desc: 'Pay securely via PayPal' },
  { value: 'Stripe', label: 'Stripe', icon: '🏦', desc: 'Credit / Debit Card via Stripe' },
  { value: 'CashOnDelivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay in cash when delivered' },
];

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { shippingAddress, paymentMethod } } = state;
  const [selected, setSelected] = useState(paymentMethod || 'PayPal');

  useEffect(() => {
    if (!shippingAddress.address) navigate('/shipping');
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selected });
    navigate('/placeorder');
  };

  return (
    <div className="form-container" style={{ maxWidth: 540 }}>
      <CheckoutSteps step1 step2 step3 />
      <div className="form-card">
        <h1 className="form-title">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 16px',
                  background: selected === method.value ? 'rgba(108, 99, 255, 0.08)' : 'var(--bg-secondary)',
                  border: `2px solid ${selected === method.value ? 'var(--accent-primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={selected === method.value}
                  onChange={(e) => setSelected(e.target.value)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{method.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{method.desc}</div>
                </div>
                {selected === method.value && (
                  <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }}></i>
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} id="continue-btn">
            <i className="fas fa-arrow-right"></i> Continue
          </button>
        </form>
      </div>
    </div>
  );
}
