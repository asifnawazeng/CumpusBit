import { useState } from 'react';
import { useCart, formatPrice } from '../lib/cart';
import { supabase, type Order, type PaymentMethod } from '../lib/supabase';
import { X, Minus, Plus, ShoppingBag, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

type Step = 'cart' | 'checkout' | 'paying' | 'done';

export default function CartDrawer({ open, onClose, onOrderPlaced }: CartDrawerProps) {
  const { lines, setQty, remove, clear, totalCents, count } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (step === 'done') {
        setStep('cart');
        clear();
        setPlacedOrder(null);
        setName(''); setRoom(''); setNotes('');
      }
    }, 300);
  };

  const handlePay = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError(null);
    setStep('paying');

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          student_name: name.trim(),
          student_room: room.trim() || null,
          total_cents: totalCents,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cash' ? 'unpaid' : 'paid',
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (orderErr || !orderData) {
        setError(orderErr?.message ?? 'Failed to place order.');
        setStep('checkout');
        return;
      }

      const orderRows = lines.map((l) => ({
        order_id: orderData.id,
        menu_item_id: l.item.id,
        name_snapshot: l.item.name,
        price_cents: l.item.price_cents,
        quantity: l.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderRows);
      if (itemsErr) {
        setError(itemsErr.message);
        setStep('checkout');
        return;
      }

      setPlacedOrder(orderData as Order);
      setStep('done');
      onOrderPlaced(orderData as Order);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setStep('checkout');
    }
  };

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={handleClose} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <header className="drawer-header">
          <h2>
            {step === 'cart' && (<><ShoppingBag size={20} /> Your Cart</>)}
            {step === 'checkout' && <>Checkout</>}
            {step === 'paying' && <>Processing...</>}
            {step === 'done' && (<><CheckCircle2 size={20} /> Order Confirmed</>)}
          </h2>
          <button className="icon-btn" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="drawer-body">
          {step === 'cart' && (
            <>
              {lines.length === 0 ? (
                <div className="empty-state">
                  <ShoppingBag size={48} />
                  <p>Your cart is empty.</p>
                  <p className="muted">Add items from the menu to get started.</p>
                </div>
              ) : (
                <>
                  <ul className="cart-lines">
                    {lines.map((l) => (
                      <li key={l.item.id} className="cart-line">
                        <div className="cart-line-info">
                          <span className="cart-line-name">{l.item.name}</span>
                          <span className="cart-line-price">{formatPrice(l.item.price_cents)}</span>
                        </div>
                        <div className="qty-control">
                          <button onClick={() => setQty(l.item.id, l.quantity - 1)} aria-label="Decrease">
                            <Minus size={14} />
                          </button>
                          <span>{l.quantity}</span>
                          <button onClick={() => setQty(l.item.id, l.quantity + 1)} aria-label="Increase">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="cart-line-total">{formatPrice(l.item.price_cents * l.quantity)}</span>
                        <button className="remove-btn" onClick={() => remove(l.item.id)} aria-label="Remove">
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-summary">
                    <span>Total</span>
                    <span className="cart-total">{formatPrice(totalCents)}</span>
                  </div>
                  <button className="primary-btn full" onClick={() => setStep('checkout')}>
                    Proceed to Checkout
                  </button>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <div className="checkout-form">
              <label>
                <span>Your Name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" autoFocus />
              </label>
              <label>
                <span>Room / Table No. (optional)</span>
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. B-204" />
              </label>
              <label>
                <span>Special Instructions (optional)</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. less spicy, extra chutney" rows={2} />
              </label>
              <div className="payment-methods">
                <span className="field-label">Payment Method</span>
                <div className="pay-options">
                  <button className={paymentMethod === 'card' ? 'active' : ''} onClick={() => setPaymentMethod('card')}>
                    <CreditCard size={18} /> Card
                  </button>
                  <button className={paymentMethod === 'upi' ? 'active' : ''} onClick={() => setPaymentMethod('upi')}>
                    UPI
                  </button>
                  <button className={paymentMethod === 'cash' ? 'active' : ''} onClick={() => setPaymentMethod('cash')}>
                    Cash
                  </button>
                </div>
              </div>
              <div className="order-summary-box">
                <div className="summary-row"><span>Items</span><span>{count}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatPrice(totalCents)}</span></div>
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn full" onClick={handlePay}>
                {paymentMethod === 'cash' ? 'Place Order' : `Pay ${formatPrice(totalCents)}`}
              </button>
              <button className="link-btn" onClick={() => setStep('cart')}>Back to cart</button>
            </div>
          )}

          {step === 'paying' && (
            <div className="paying-state">
              <Loader2 size={40} className="spin" />
              <p>Placing your order...</p>
            </div>
          )}

          {step === 'done' && placedOrder && (
            <div className="done-state">
              <CheckCircle2 size={56} className="success-icon" />
              <h3>Order #{placedOrder.order_number}</h3>
              <p className="muted">
                {placedOrder.payment_status === 'paid' ? 'Payment received. ' : 'Pay at the counter. '}
                Your order is now in the kitchen queue.
              </p>
              <button className="primary-btn full" onClick={handleClose}>Track My Order</button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
