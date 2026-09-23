import { useState, useEffect, useCallback } from 'react';
import { supabase, type Order, type OrderItem, type OrderStatus, STATUS_FLOW, STATUS_LABELS } from '../lib/supabase';
import { formatPrice } from '../lib/cart';
import { Receipt, Clock, CheckCircle2, ChefHat, Package, X } from 'lucide-react';

interface OrderTrackerProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
}

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  placed: Receipt,
  preparing: ChefHat,
  ready: Package,
  completed: CheckCircle2,
  cancelled: X,
};

export default function OrderTracker({ open, onClose, orderId }: OrderTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .maybeSingle();
    if (error) { console.error(error); return; }
    if (data) {
      setOrder(data as Order);
      setItems(data.order_items ?? []);
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!open || !orderId) return;
    setLoading(true);
    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        () => fetchOrder(),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [open, orderId, fetchOrder]);

  if (!open) return null;

  const currentStepIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;

  return (
    <>
      <div className="drawer-overlay open" onClick={onClose} />
      <aside className="cart-drawer open tracker-drawer">
        <header className="drawer-header">
          <h2>Track Your Order</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className="drawer-body">
          {loading || !order ? (
            <div className="paying-state">
              <div className="spinner" />
              <p>Loading order...</p>
            </div>
          ) : (
            <>
              <div className="order-number-banner">
                <span className="order-num-label">Order Number</span>
                <span className="order-num-value">#{order.order_number}</span>
                <span className="order-time">
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {order.status === 'cancelled' ? (
                <div className="cancelled-banner">
                  <X size={24} /> This order was cancelled.
                </div>
              ) : (
                <div className="status-tracker">
                  {STATUS_FLOW.map((status, idx) => {
                    const Icon = STATUS_ICONS[status];
                    const isComplete = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={status} className={`status-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}>
                        <div className="status-icon-wrap"><Icon size={20} /></div>
                        <span className="status-label">{STATUS_LABELS[status]}</span>
                        {idx < STATUS_FLOW.length - 1 && <div className="status-connector" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="tracker-items">
                <h4>Order Details</h4>
                <ul>
                  {items.map((it) => (
                    <li key={it.id}>
                      <span className="ti-qty">{it.quantity}x</span>
                      <span className="ti-name">{it.name_snapshot}</span>
                      <span className="ti-price">{formatPrice(it.price_cents * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="tracker-total">
                  <span>Total</span>
                  <span>{formatPrice(order.total_cents)}</span>
                </div>
              </div>

              <div className="tracker-meta">
                <div className="meta-row">
                  <span>Payment</span>
                  <span className={`pay-badge ${order.payment_status}`}>
                    {order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'refunded' ? 'Refunded' : 'Pay at counter'}
                  </span>
                </div>
                {order.student_room && (
                  <div className="meta-row"><span>Room / Table</span><span>{order.student_room}</span></div>
                )}
                {order.notes && (
                  <div className="meta-row notes"><span>Notes</span><span>{order.notes}</span></div>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
