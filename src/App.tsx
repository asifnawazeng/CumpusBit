import { useState } from 'react';
import { CartProvider } from './lib/cart';
import MenuList from './components/MenuList';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import type { Order } from './lib/supabase';
import { Utensils, Clock } from 'lucide-react';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const handleOrderPlaced = (order: Order) => {
    setActiveOrderId(order.id);
    setCartOpen(false);
  };

  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-logo"><Utensils size={22} /></div>
              <div className="brand-text">
                <h1>CampusBite</h1>
                <span className="tagline">Hostel & Cafe Ordering</span>
              </div>
            </div>
            <div className="header-actions">
              {activeOrderId && (
                <button className="track-btn" onClick={() => setTrackerOpen(true)}>
                  <Clock size={16} /> Track Order
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-inner">
            <h2>Skip the queue. Order ahead.</h2>
            <p>
              Browse the canteen menu, build your order, and pay online. Pick it up fresh - no waiting in line.
            </p>
          </div>
        </section>

        <main className="main-content">
          <MenuList onCartOpen={() => setCartOpen(true)} />
        </main>

        <footer className="app-footer">
          <p>CampusBite - faster canteen ordering for students.</p>
        </footer>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onOrderPlaced={handleOrderPlaced} />
      <OrderTracker open={trackerOpen} onClose={() => setTrackerOpen(false)} orderId={activeOrderId} />
    </CartProvider>
  );
}
