// Shared admin order records: seeded baseline + storefront checkout orders.

export interface CustomerOrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  customerType: 'Repeat Customer (Reordered)' | 'First-Time Buyer';
  totalOrdersByCustomer: number;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    category: string;
    imageUrl?: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  status: 'Processing' | 'Verified' | 'Dispatched' | 'Delivered' | 'Cancelled';
  courierPartner: string;
  trackingAwb: string;
  reorderNotes?: string;
}

export const DEFAULT_ORDERS: CustomerOrderRecord[] = [
  {
    id: 'ord-104',
    orderNumber: 'MIK-982107',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    address: 'Flat 402, Aditya Elite, Jubilee Hills Road 36, Hyderabad 500033',
    customerType: 'Repeat Customer (Reordered)',
    totalOrdersByCustomer: 2,
    date: '05 Nov 2026, 04:30 PM',
    items: [
      {
        name: 'Canon RF 50mm f/1.8 STM Prime Lens',
        quantity: 1,
        price: 18999,
        category: 'Lenses',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'SanDisk Extreme Pro 128GB UHS-I SD Card',
        quantity: 2,
        price: 2499,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 23997,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    status: 'Processing',
    courierPartner: 'Delhivery Surface Pro',
    trackingAwb: 'DEL-HYD-982107',
    reorderNotes: 'Reordered accessories after purchasing Canon EOS R6 Mark II yesterday!',
  },
  {
    id: 'ord-101',
    orderNumber: 'MIK-982104',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    address: 'Flat 402, Aditya Elite, Jubilee Hills Road 36, Hyderabad 500033',
    customerType: 'First-Time Buyer',
    totalOrdersByCustomer: 2,
    date: '04 Nov 2026, 11:15 AM',
    items: [
      {
        name: 'Canon EOS R6 Mark II Mirrorless Body',
        quantity: 1,
        price: 195000,
        category: 'Mirrorless',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 195000,
    paymentMethod: 'Credit Card (HDFC)',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courierPartner: 'Showroom VIP Hand-Delivery',
    trackingAwb: 'HYD-LOCAL-VIP-01',
    reorderNotes: 'First purchase - Hand delivered to Jubilee Hills studio.',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIK-982105',
    customerName: 'Syed Mansoor Ahmed',
    customerEmail: 'mansoor.cinematics@gmail.com',
    customerPhone: '+91 70321 99887',
    address: 'H.No 12-2-418/A, Mehdipatnam Pillar 45, Hyderabad 500028',
    customerType: 'Repeat Customer (Reordered)',
    totalOrdersByCustomer: 3,
    date: '03 Nov 2026, 02:45 PM',
    items: [
      {
        name: 'Sony Alpha FX3 Cinema Line Camera',
        quantity: 1,
        price: 365000,
        category: 'Mirrorless',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 365000,
    paymentMethod: 'Bank NEFT Transfer',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courierPartner: 'Shiprocket Bluedart',
    trackingAwb: 'SR-EXP-77291',
    reorderNotes: 'Frequent commercial studio client. 3rd flagship cinema camera order.',
  },
  {
    id: 'ord-103',
    orderNumber: 'MIK-982106',
    customerName: 'Anil Reddy Photography',
    customerEmail: 'anil.creatives@yahoo.com',
    customerPhone: '+91 99890 87654',
    address: 'Plot 89, Kakatiya Hills, Madhapur, Hyderabad 500081',
    customerType: 'First-Time Buyer',
    totalOrdersByCustomer: 1,
    date: '02 Nov 2026, 05:20 PM',
    items: [
      {
        name: 'Sigma 24-70mm f/2.8 DG DN Art Lens for Sony E',
        quantity: 1,
        price: 89000,
        category: 'Lenses',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 89000,
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Pending',
    status: 'Processing',
    courierPartner: 'DTDC Priority Express',
    trackingAwb: 'DTDC-HYD-55120',
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Merge storefront checkout orders (localStorage) with the seeded baseline orders. */
export function loadAdminOrders(): CustomerOrderRecord[] {
  if (typeof window === 'undefined') return DEFAULT_ORDERS;
  try {
    const stored = localStorage.getItem('mikings_customer_orders');
    const parsed = stored ? JSON.parse(stored) : null;
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ORDERS;
    const formatted: CustomerOrderRecord[] = parsed.map((ord: any, idx: number) => ({
      id: `real-ord-${idx}`,
      orderNumber: ord.trackingId || `MIK-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: ord.customerName || 'Online Buyer',
      customerEmail: ord.customerEmail || 'customer@gmail.com',
      customerPhone: ord.customerPhone || '+91 90322 85420',
      address: ord.shippingAddress || 'Hyderabad, Telangana',
      customerType: 'First-Time Buyer',
      totalOrdersByCustomer: 1,
      date: 'Today, Just Now',
      items: (ord.items || []).map((it: any) => ({
        name: it.name || it.product?.name || 'Camera Gear',
        quantity: it.quantity || 1,
        price: it.price || it.product?.salePrice || 10000,
        category: it.product?.category || 'Photography',
        imageUrl: it.product?.imageUrl,
      })),
      totalAmount: ord.total || ord.totalAmount || 15000,
      paymentMethod: ord.paymentMethod || 'Online Pre-order',
      paymentStatus: 'Paid',
      status: ord.status || 'Processing',
      courierPartner: ord.courierPartner || 'Delhivery Surface',
      trackingAwb: ord.trackingId || 'HYD-EXP-PENDING',
    }));
    return [...formatted, ...DEFAULT_ORDERS];
  } catch (e) {
    console.warn('Error loading admin orders:', e);
    return DEFAULT_ORDERS;
  }
}
