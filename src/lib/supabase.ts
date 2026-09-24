import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  icon: string | null;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  available: boolean;
  prep_time_minutes: number;
  sort_order: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name_snapshot: string;
  price_cents: number;
  quantity: number;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'upi' | 'cash';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Order {
  id: string;
  order_number: number;
  student_name: string;
  student_room: string | null;
  status: OrderStatus;
  total_cents: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  pickup_time: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export const STATUS_FLOW: OrderStatus[] = ['placed', 'preparing', 'ready', 'completed'];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Default seed data for mock canteen ordering system
const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Snacks & Quick Bites', slug: 'snacks', sort_order: 1, icon: '🥪' },
  { id: 'cat-2', name: 'Chai & Beverages', slug: 'beverages', sort_order: 2, icon: '☕' },
  { id: 'cat-3', name: 'Hostel Thali & Meals', slug: 'meals', sort_order: 3, icon: '🍛' },
  { id: 'cat-4', name: 'Maggi & Rolls', slug: 'maggi-rolls', sort_order: 4, icon: '🍜' },
  { id: 'cat-5', name: 'Desserts & Sweets', slug: 'desserts', sort_order: 5, icon: '🍰' },
];

const SEED_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    category_id: 'cat-1',
    name: 'Crispy Samosa (2 Pcs)',
    description: 'Golden flaky pastry stuffed with spiced potatoes and peas, served with mint & tamarind chutney',
    price_cents: 3000,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 5,
    sort_order: 1,
  },
  {
    id: 'item-2',
    category_id: 'cat-1',
    name: 'Veg Grilled Cheese Sandwich',
    description: 'Double-decker toasted sandwich packed with fresh veggies, green chutney, and melted cheese',
    price_cents: 6500,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 8,
    sort_order: 2,
  },
  {
    id: 'item-3',
    category_id: 'cat-1',
    name: 'Bun Maska & Jam',
    description: 'Fresh bakery bun slathered with generous butter and mixed fruit jam, hostel morning favorite',
    price_cents: 3500,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 4,
    sort_order: 3,
  },
  {
    id: 'item-4',
    category_id: 'cat-2',
    name: 'Adrak Elaichi Masala Chai',
    description: 'Freshly brewed strong Indian milk tea infused with crushed ginger and aromatic green cardamom',
    price_cents: 1500,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 5,
    sort_order: 4,
  },
  {
    id: 'item-5',
    category_id: 'cat-2',
    name: 'Thick Cold Coffee with Ice Cream',
    description: 'Chilled blended creamy coffee topped with chocolate drizzle and vanilla ice cream',
    price_cents: 5500,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 6,
    sort_order: 5,
  },
  {
    id: 'item-6',
    category_id: 'cat-2',
    name: 'Fresh Mint Lemon Soda',
    description: 'Refreshing sparkling cooler with fresh mint leaves, squeezed lemon, black salt, and cumin',
    price_cents: 3500,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 3,
    sort_order: 6,
  },
  {
    id: 'item-7',
    category_id: 'cat-3',
    name: 'Special Deluxe Hostel Thali',
    description: 'Paneer butter masala, dal fry, 3 butter rotis, steamed jeera rice, salad, pickle, and sweet gulab jamun',
    price_cents: 12000,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 15,
    sort_order: 7,
  },
  {
    id: 'item-8',
    category_id: 'cat-3',
    name: 'Delhi Style Chole Bhature',
    description: 'Two fluffy puffed bhaturas served with spicy Amritsari chole, pickled onions, and green chilies',
    price_cents: 9500,
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 12,
    sort_order: 8,
  },
  {
    id: 'item-9',
    category_id: 'cat-4',
    name: 'Classic Double Masala Maggi',
    description: 'Late-night hostel classic cooked with extra seasoning, butter, diced onions, and green peas',
    price_cents: 4500,
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 7,
    sort_order: 9,
  },
  {
    id: 'item-10',
    category_id: 'cat-4',
    name: 'Cheese Burst Veggie Maggi',
    description: 'Steaming hot noodles loaded with crunchy vegetables and melted mozzarella & cheddar cheese',
    price_cents: 6500,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 8,
    sort_order: 10,
  },
  {
    id: 'item-11',
    category_id: 'cat-4',
    name: 'Paneer Tikka Kathi Roll',
    description: 'Tandoori spiced paneer cubes tossed in capsicum and onions wrapped in a soft flaky paratha',
    price_cents: 8000,
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 10,
    sort_order: 11,
  },
  {
    id: 'item-12',
    category_id: 'cat-5',
    name: 'Warm Chocolate Walnut Brownie',
    description: 'Fudgy rich dark chocolate brownie loaded with toasted walnuts and chocolate fudge sauce',
    price_cents: 5000,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 3,
    sort_order: 12,
  },
  {
    id: 'item-13',
    category_id: 'cat-5',
    name: 'Hot Gulab Jamun (2 Pcs)',
    description: 'Soft melt-in-mouth milk dough dumplings soaked in rose and cardamom flavored sugar syrup',
    price_cents: 3500,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    available: true,
    prep_time_minutes: 2,
    sort_order: 13,
  },
];

// In-memory data store for mock operations
class MockDatabase {
  private categories: Category[] = [...SEED_CATEGORIES];
  private menuItems: MenuItem[] = [...SEED_MENU_ITEMS];
  private orders: Map<string, Order> = new Map();
  private orderItems: OrderItem[] = [];
  private orderCounter = 101;
  private channelListeners: Map<string, Array<() => void>> = new Map();
  private timers: Map<string, any[]> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedOrders = localStorage.getItem('campusbite_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders) as Order[];
        parsed.forEach((ord) => this.orders.set(ord.id, ord));
      }
      const savedItems = localStorage.getItem('campusbite_order_items');
      if (savedItems) {
        this.orderItems = JSON.parse(savedItems) as OrderItem[];
      }
      const savedCounter = localStorage.getItem('campusbite_order_counter');
      if (savedCounter) {
        this.orderCounter = parseInt(savedCounter, 10);
      }
    } catch {
      // Local storage unavailable or failed
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('campusbite_orders', JSON.stringify(Array.from(this.orders.values())));
      localStorage.setItem('campusbite_order_items', JSON.stringify(this.orderItems));
      localStorage.setItem('campusbite_order_counter', this.orderCounter.toString());
    } catch {
      // Ignore
    }
  }

  public getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  public getMenuItems(): MenuItem[] {
    return [...this.menuItems].sort((a, b) => a.sort_order - b.sort_order);
  }

  public createOrder(data: {
    student_name: string;
    student_room?: string | null;
    total_cents: number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    notes?: string | null;
  }): Order {
    const id = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newOrder: Order = {
      id,
      order_number: this.orderCounter++,
      student_name: data.student_name,
      student_room: data.student_room ?? null,
      status: 'placed',
      total_cents: data.total_cents,
      payment_method: data.payment_method,
      payment_status: data.payment_status,
      notes: data.notes ?? null,
      pickup_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: [],
    };
    this.orders.set(id, newOrder);
    this.saveToStorage();

    // Schedule automated order progression for demo purposes
    this.scheduleStatusProgression(id);

    return newOrder;
  }

  public addOrderItems(items: Array<Omit<OrderItem, 'id'>>): OrderItem[] {
    const created: OrderItem[] = items.map((it) => ({
      ...it,
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    this.orderItems.push(...created);
    this.saveToStorage();

    // Update order with its items
    if (items.length > 0) {
      const orderId = items[0].order_id;
      const order = this.orders.get(orderId);
      if (order) {
        order.order_items = this.getOrderItems(orderId);
      }
    }

    return created;
  }

  public getOrder(id: string): Order | null {
    const ord = this.orders.get(id);
    if (!ord) return null;
    return {
      ...ord,
      order_items: this.getOrderItems(id),
    };
  }

  public getOrderItems(orderId: string): OrderItem[] {
    return this.orderItems.filter((i) => i.order_id === orderId);
  }

  public subscribe(channelName: string, cb: () => void): () => void {
    if (!this.channelListeners.has(channelName)) {
      this.channelListeners.set(channelName, []);
    }
    this.channelListeners.get(channelName)!.push(cb);

    return () => {
      const listeners = this.channelListeners.get(channelName) ?? [];
      this.channelListeners.set(
        channelName,
        listeners.filter((fn) => fn !== cb)
      );
    };
  }

  private notify(orderId: string) {
    const channelName = `order-${orderId}`;
    const listeners = this.channelListeners.get(channelName) ?? [];
    listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error invoking channel listener', err);
      }
    });
  }

  private scheduleStatusProgression(orderId: string) {
    const t1 = setTimeout(() => {
      const ord = this.orders.get(orderId);
      if (ord && ord.status === 'placed') {
        ord.status = 'preparing';
        ord.updated_at = new Date().toISOString();
        this.saveToStorage();
        this.notify(orderId);
      }
    }, 7000);

    const t2 = setTimeout(() => {
      const ord = this.orders.get(orderId);
      if (ord && ord.status === 'preparing') {
        ord.status = 'ready';
        ord.updated_at = new Date().toISOString();
        this.saveToStorage();
        this.notify(orderId);
      }
    }, 18000);

    const t3 = setTimeout(() => {
      const ord = this.orders.get(orderId);
      if (ord && ord.status === 'ready') {
        ord.status = 'completed';
        ord.updated_at = new Date().toISOString();
        this.saveToStorage();
        this.notify(orderId);
      }
    }, 35000);

    this.timers.set(orderId, [t1, t2, t3]);
  }

  public clearTimers(orderId: string) {
    const timers = this.timers.get(orderId);
    if (timers) {
      timers.forEach((t) => clearTimeout(t));
      this.timers.delete(orderId);
    }
  }
}

const mockDb = new MockDatabase();

function createMockSupabaseClient(): any {
  return {
    from(tableName: string) {
      return {
        select(_fields: string = '*') {
          let filterField: string | null = null;
          let filterValue: any = null;

          const queryObj = {
            order(_orderField: string) {
              return queryObj;
            },
            eq(column: string, value: any) {
              filterField = column;
              filterValue = value;
              return queryObj;
            },
            async single() {
              return queryObj.executeSingle();
            },
            async maybeSingle() {
              return queryObj.executeSingle();
            },
            async executeSingle() {
              if (tableName === 'orders' && filterField === 'id') {
                const order = mockDb.getOrder(filterValue);
                return { data: order, error: null };
              }
              return { data: null, error: null };
            },
            then(resolve: any, reject: any) {
              return this.execute().then(resolve, reject);
            },
            async execute() {
              if (tableName === 'categories') {
                return { data: mockDb.getCategories(), error: null };
              }
              if (tableName === 'menu_items') {
                return { data: mockDb.getMenuItems(), error: null };
              }
              if (tableName === 'orders') {
                if (filterField === 'id') {
                  const ord = mockDb.getOrder(filterValue);
                  return { data: ord ? [ord] : [], error: null };
                }
                return { data: [], error: null };
              }
              if (tableName === 'order_items') {
                if (filterField === 'order_id') {
                  return { data: mockDb.getOrderItems(filterValue), error: null };
                }
                return { data: [], error: null };
              }
              return { data: [], error: null };
            },
          };
          return queryObj;
        },

        insert(records: any) {
          const insertArray = Array.isArray(records) ? records : [records];

          return {
            select() {
              return {
                async single() {
                  if (tableName === 'orders') {
                    const createdOrder = mockDb.createOrder(insertArray[0]);
                    return { data: createdOrder, error: null };
                  }
                  return { data: insertArray[0], error: null };
                },
                then(resolve: any, reject: any) {
                  return this.execute().then(resolve, reject);
                },
                async execute() {
                  if (tableName === 'orders') {
                    const created = insertArray.map((r) => mockDb.createOrder(r));
                    return { data: created, error: null };
                  }
                  if (tableName === 'order_items') {
                    const created = mockDb.addOrderItems(insertArray);
                    return { data: created, error: null };
                  }
                  return { data: insertArray, error: null };
                },
              };
            },
            then(resolve: any, reject: any) {
              return this.execute().then(resolve, reject);
            },
            async execute() {
              if (tableName === 'order_items') {
                const created = mockDb.addOrderItems(insertArray);
                return { data: created, error: null };
              }
              if (tableName === 'orders') {
                const created = insertArray.map((r) => mockDb.createOrder(r));
                return { data: created, error: null };
              }
              return { data: insertArray, error: null };
            },
          };
        },
      };
    },

    channel(channelName: string) {
      let registeredCallback: (() => void) | null = null;
      let unsubscribe: (() => void) | null = null;

      const chan = {
        name: channelName,
        on(_event: string, _filter: any, callback: () => void) {
          registeredCallback = callback;
          return chan;
        },
        subscribe() {
          if (registeredCallback) {
            unsubscribe = mockDb.subscribe(channelName, registeredCallback);
          }
          return chan;
        },
        unsubscribe() {
          if (unsubscribe) {
            unsubscribe();
          }
        },
      };
      return chan;
    },

    removeChannel(channelObj: any) {
      if (channelObj && typeof channelObj.unsubscribe === 'function') {
        channelObj.unsubscribe();
      }
    },
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const hasValidSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('example.com')
);

let clientInstance: SupabaseClient | any;

if (hasValidSupabaseConfig) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[CampusBite] Could not initialize Supabase client, using in-memory mock backend instead.', err);
    clientInstance = createMockSupabaseClient();
  }
} else {
  // Use in-memory mock client so the app works seamlessly out-of-the-box
  clientInstance = createMockSupabaseClient();
}

export const supabase = clientInstance;
