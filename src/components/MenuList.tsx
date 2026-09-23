import { useState, useEffect } from 'react';
import { supabase, type Category, type MenuItem } from '../lib/supabase';
import { useCart, formatPrice } from '../lib/cart';
import { Plus, Clock } from 'lucide-react';

interface MenuListProps {
  onCartOpen: () => void;
}

export default function MenuList({ onCartOpen }: MenuListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string>('all');
  const { add, count } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [catRes, itemRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('menu_items').select('*').order('sort_order'),
      ]);
      if (!mounted) return;
      if (catRes.error) { setError(catRes.error.message); setLoading(false); return; }
      if (itemRes.error) { setError(itemRes.error.message); setLoading(false); return; }
      setCategories(catRes.data ?? []);
      setItems(itemRes.data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered =
    activeSlug === 'all'
      ? items
      : items.filter((i) => i.category_id === categories.find((c) => c.slug === activeSlug)?.id);

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="spinner" />
        <p>Loading the menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error">
        <p>Couldn't load the menu.</p>
        <p className="muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="menu-section">
      <div className="category-tabs">
        <button className={activeSlug === 'all' ? 'active' : ''} onClick={() => setActiveSlug('all')}>
          All Items
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={activeSlug === c.slug ? 'active' : ''}
            onClick={() => setActiveSlug(c.slug)}
          >
            {c.icon && <span className="cat-icon">{c.icon}</span>}
            {c.name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((item) => (
          <article key={item.id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
            <div className="menu-card-img">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} loading="lazy" />
              ) : (
                <div className="img-placeholder" />
              )}
              <span className="prep-badge">
                <Clock size={12} /> {item.prep_time_minutes}m
              </span>
            </div>
            <div className="menu-card-body">
              <h3>{item.name}</h3>
              {item.description && <p className="menu-desc">{item.description}</p>}
              <div className="menu-card-foot">
                <span className="price">{formatPrice(item.price_cents)}</span>
                <button
                  className="add-btn"
                  disabled={!item.available}
                  onClick={() => { add(item); onCartOpen(); }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {count > 0 && (
        <button className="floating-cart" onClick={onCartOpen}>
          {count} item{count > 1 ? 's' : ''} in cart - View
        </button>
      )}
    </div>
  );
}
