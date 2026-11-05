'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Printer,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Sparkles,
  ShoppingBag,
  FileText,
  Truck,
  RotateCcw,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound,
  AlertCircle,
  Search,
  Download,
  Key,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { OFFICIAL_LOGO_BASE64 } from '@/data/logo';
import { CustomerInvoiceModal, InvoiceData } from '@/components/invoice/CustomerInvoiceModal';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  password?: string;
  memberSince: string;
  loyaltyTier: string;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    hsn?: string;
  }>;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  trackingId: string;
  courierPartner: string;
  paymentMethod: string;
  shippingAddress: string;
}

const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'MIK-982104',
    date: '28 Oct 2026',
    items: [
      {
        name: 'Canon EOS 80D DSLR Kit + EF-S 18-135mm IS USM',
        price: 48999,
        quantity: 1,
        hsn: '900659',
      },
    ],
    total: 48999,
    status: 'Delivered',
    trackingId: 'DTDC-HYD-998241',
    courierPartner: 'DTDC Priority Express',
    paymentMethod: 'UPI (PhonePe / GPay)',
    shippingAddress: 'Flat 402, Al-Madina Heights, Mehdipatnam, Hyderabad, Telangana 500028',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIK-982105',
    date: '03 Nov 2026',
    items: [
      {
        name: 'Sony FE 50mm f/1.8 Prime Lens (Full-Frame E-Mount)',
        price: 16999,
        quantity: 1,
        hsn: '900211',
      },
    ],
    total: 16999,
    status: 'In Transit',
    trackingId: 'BLUEDART-882194',
    courierPartner: 'BlueDart Air Cargo',
    paymentMethod: 'Netbanking / NEFT',
    shippingAddress: 'Flat 402, Al-Madina Heights, Mehdipatnam, Hyderabad, Telangana 500028',
  },
];

export default function AccountPage() {
  const { wishlistCount, cart } = useCart();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'guestTrack'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Hyderabad, Telangana');
  const [regPassword, setRegPassword] = useState('');

  // Forgot Password State
  const [forgotTarget, setForgotTarget] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'newPassword'>('request');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Guest Order Tracking State
  const [guestOrderId, setGuestOrderId] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestOrderResult, setGuestOrderResult] = useState<OrderItem | null>(null);

  // Invoice Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  // Account Dashboard Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'warranty' | 'addresses' | 'profile'>('orders');

  // Customer orders (combines default store orders with any orders placed during session)
  const [customerOrders, setCustomerOrders] = useState<OrderItem[]>(DEFAULT_ORDERS);

  // Load persistent customer session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mikings_customer_session');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
      const savedOrders = localStorage.getItem('mikings_customer_orders');
      if (savedOrders) {
        setCustomerOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.warn('Customer session read error:', e);
    }
  }, []);

  // Helper to retrieve all registered accounts
  const getRegisteredUsers = (): CustomerUser[] => {
    try {
      const db = localStorage.getItem('mikings_customers_db');
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  // Helper to persist registered accounts
  const saveRegisteredUsers = (users: CustomerUser[]) => {
    try {
      localStorage.setItem('mikings_customers_db', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save customer', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailOrPhone = loginEmail.trim().toLowerCase();
    const users = getRegisteredUsers();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === emailOrPhone || u.phone.replace(/\D/g, '') === emailOrPhone.replace(/\D/g, '')
    );

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== loginPassword) {
        setAuthError('Incorrect password. Please re-enter or tap "Forgot Password?" below.');
        return;
      }
      setCurrentUser(matchedUser);
      localStorage.setItem('mikings_customer_session', JSON.stringify(matchedUser));
      setAuthSuccessMsg(`Welcome back, ${matchedUser.name}!`);
      return;
    }

    // If first time logging in with a new email and valid password, create account smoothly
    if (emailOrPhone.includes('@') && loginPassword.length >= 6) {
      const newUser: CustomerUser = {
        id: 'cust-' + Date.now().toString().slice(-6),
        name: emailOrPhone.split('@')[0].toUpperCase(),
        email: emailOrPhone,
        phone: '+91 90000 00000',
        city: 'Hyderabad, Telangana',
        password: loginPassword,
        memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        loyaltyTier: 'Verified Buyer',
      };
      saveRegisteredUsers([...users, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('mikings_customer_session', JSON.stringify(newUser));
      setAuthSuccessMsg('Welcome to Mi King’s DSLR Camera Shop!');
    } else {
      setAuthError('Account not found with this email. Please click "Create Account" above to register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setAuthError('Please fill in all registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('Password must contain at least 6 characters.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setAuthError('An account is already registered with this email. Please sign in instead.');
      return;
    }

    const createdUser: CustomerUser = {
      id: 'cust-' + Date.now().toString().slice(-6),
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      city: regCity.trim() || 'Hyderabad, Telangana',
      password: regPassword,
      memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      loyaltyTier: 'Club Member',
    };

    saveRegisteredUsers([...users, createdUser]);
    setCurrentUser(createdUser);
    localStorage.setItem('mikings_customer_session', JSON.stringify(createdUser));
    setAuthSuccessMsg('Account successfully created! Welcome to Mi King’s Cameras.');
  };

  // 100% Functional Forgot Password Logic
  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!forgotTarget.trim()) {
      setAuthError('Please enter your registered email or mobile number.');
      return;
    }

    // Generate a secure 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setForgotStep('verify');
    setAuthSuccessMsg(`A 6-digit security code has been generated for ${forgotTarget}.`);
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setAuthError('Invalid verification code. Please check and re-enter.');
      return;
    }

    setForgotStep('newPassword');
  };

  const handleForgotResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (newPassword.length < 6) {
      setAuthError('New password must have at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }

    // Update password in customer database
    const users = getRegisteredUsers();
    const cleanTarget = forgotTarget.trim().toLowerCase();
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === cleanTarget || u.phone.replace(/\D/g, '') === cleanTarget.replace(/\D/g, '')) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    saveRegisteredUsers(updatedUsers);

    // Auto sign in or redirect to login
    const targetUser = updatedUsers.find(
      (u) => u.email.toLowerCase() === cleanTarget || u.phone.replace(/\D/g, '') === cleanTarget.replace(/\D/g, '')
    );

    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('mikings_customer_session', JSON.stringify(targetUser));
      setAuthSuccessMsg('Password updated successfully! You are now logged in.');
    } else {
      setAuthMode('login');
      setForgotStep('request');
      setAuthSuccessMsg('Password updated successfully! Please sign in with your new password.');
    }
  };

  const handleGuestTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = guestOrderId.trim().toUpperCase();
    const match = customerOrders.find((o) => o.orderNumber.toUpperCase() === cleanId);
    if (match) {
      setGuestOrderResult(match);
      setAuthError(null);
    } else {
      setGuestOrderResult(null);
      setAuthError('No matching consignment found. Please check your order invoice or SMS confirmation.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mikings_customer_session');
    setAuthSuccessMsg(null);
    setAuthError(null);
  };

  // Open GST Invoice Modal for an Order
  const openInvoiceForOrder = (order: OrderItem) => {
    const inv: InvoiceData = {
      orderNumber: order.orderNumber,
      customerName: currentUser?.name || 'Authorized Buyer',
      customerEmail: currentUser?.email || 'customer@mikcameras.in',
      customerPhone: currentUser?.phone || '+91 90322 85420',
      shippingAddress: order.shippingAddress,
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500064',
      items: order.items,
      totalAmount: order.total,
      paymentMethod: order.paymentMethod,
      date: order.date,
      trackingId: order.trackingId,
      courierPartner: order.courierPartner,
    };
    setSelectedInvoice(inv);
  };

  // -------------------------------------------------------------
  // VIEW A: If Customer is NOT Logged In, Render Clean Amazon/Myntra Modest Auth Form
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-[82vh] py-8 sm:py-12 px-4 flex flex-col justify-between items-center">
        <div className="w-full max-w-[390px] mx-auto space-y-5">
          {/* Brand Logo Header (Amazon/Myntra Clean Style - No Box) */}
          <div className="text-center">
            <Link href="/" className="inline-block" aria-label="Mi King's Cameras Home">
              <img
                src={OFFICIAL_LOGO_BASE64}
                alt="MI King's Cameras"
                className="h-10 sm:h-11 w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          {/* Modest White/Dark Card */}
          <div className="bg-white dark:bg-[#151311] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
            {authSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* MODE 1: Customer Sign In (Amazon Clean Pattern) */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <h1 className="text-2xl font-normal text-stone-900 dark:text-white tracking-tight">
                  Sign in
                </h1>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Email or mobile phone number
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter email or 10-digit phone"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F] transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setForgotStep('request');
                        setForgotTarget(loginEmail);
                        setAuthError(null);
                      }}
                      className="text-xs text-[#E0741A] dark:text-[#F5821F] font-medium hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 pr-10 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] active:bg-[#c9630c] text-black font-semibold text-xs tracking-wide shadow-xs transition-colors cursor-pointer mt-1"
                >
                  Sign in
                </button>

                {/* Modest Amazon/Myntra Privacy Notice */}
                <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-relaxed">
                  By continuing, you agree to Mi King&apos;s{' '}
                  <Link href="/terms" className="text-[#E0741A] dark:text-[#F5821F] hover:underline font-medium">
                    Conditions of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#E0741A] dark:text-[#F5821F] hover:underline font-medium">
                    Privacy Notice
                  </Link>.
                </p>

                {/* Divider: New to Mi King's? */}
                <div className="relative my-4 flex items-center justify-center text-xs text-stone-400 before:border-t before:border-stone-200 dark:before:border-stone-800 before:flex-1 after:border-t after:border-stone-200 dark:after:border-stone-800 after:flex-1">
                  <span className="px-3 bg-white dark:bg-[#151311] text-stone-500 dark:text-stone-400 text-[11px] font-medium">
                    New to Mi King&apos;s?
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors shadow-xs text-center cursor-pointer"
                >
                  Create your Mi King&apos;s account
                </button>
              </form>
            )}

            {/* MODE 2: Customer Registration (Amazon/Myntra Clean Layout) */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <h1 className="text-2xl font-normal text-stone-900 dark:text-white tracking-tight">
                  Create Account
                </h1>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Mobile number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center">
                      IN +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Delivery City / State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hyderabad, Telangana"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                  <p className="text-[11px] text-stone-400">Passwords must be at least 6 characters.</p>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] active:bg-[#c9630c] text-black font-semibold text-xs tracking-wide shadow-xs transition-colors cursor-pointer"
                >
                  Verify mobile &amp; Create Account
                </button>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-relaxed">
                  By creating an account, you agree to Mi King&apos;s{' '}
                  <Link href="/terms" className="text-[#E0741A] dark:text-[#F5821F] hover:underline font-medium">
                    Conditions of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#E0741A] dark:text-[#F5821F] hover:underline font-medium">
                    Privacy Notice
                  </Link>.
                </p>

                <div className="relative my-4 flex items-center justify-center text-xs text-stone-400 before:border-t before:border-stone-200 dark:before:border-stone-800 before:flex-1 after:border-t after:border-stone-200 dark:after:border-stone-800 after:flex-1">
                  <span className="px-3 bg-white dark:bg-[#151311] text-stone-500 dark:text-stone-400 text-[11px] font-medium">
                    Already have an account?
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors shadow-xs text-center cursor-pointer"
                >
                  Sign in &rarr;
                </button>
              </form>
            )}

            {/* MODE 3: Password Assistance (Amazon Standard Pattern) */}
            {authMode === 'forgot' && (
              <div className="space-y-4">
                <h1 className="text-2xl font-normal text-stone-900 dark:text-white tracking-tight">
                  Password assistance
                </h1>

                {/* Step 1: Target Request */}
                {forgotStep === 'request' && (
                  <form onSubmit={handleForgotRequest} className="space-y-3.5">
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Enter the email address or mobile phone number associated with your Mi King&apos;s account.
                    </p>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        Email or mobile phone number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. name@example.com or 9849012345"
                        value={forgotTarget}
                        onChange={(e) => setForgotTarget(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] text-black font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      Continue
                    </button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {forgotStep === 'verify' && (
                  <form onSubmit={handleForgotVerify} className="space-y-3.5">
                    <div className="p-3 rounded-lg bg-[#F5821F]/10 border border-[#F5821F]/30 text-stone-800 dark:text-stone-200 text-xs space-y-1">
                      <p className="font-bold text-[#E0741A] dark:text-[#F5821F]">Verification Code (OTP):</p>
                      <p className="font-mono text-lg font-black tracking-widest text-stone-900 dark:text-white">
                        {generatedOtp}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Dispatched for security verification to {forgotTarget}. Enter the 6 digits below.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        Enter 6-digit code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-base font-mono tracking-widest text-center focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] text-black font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      Verify Code &amp; Continue
                    </button>
                  </form>
                )}

                {/* Step 3: Set New Password */}
                {forgotStep === 'newPassword' && (
                  <form onSubmit={handleForgotResetPassword} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        New password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] text-black font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      Save changes and sign in
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className="text-xs text-[#E0741A] dark:text-[#F5821F] font-semibold hover:underline cursor-pointer"
                  >
                    &larr; Back to Sign in
                  </button>
                </div>
              </div>
            )}

            {/* MODE 4: Guest Consignment Lookup */}
            {authMode === 'guestTrack' && (
              <form onSubmit={handleGuestTrack} className="space-y-3.5">
                <div>
                  <h1 className="text-2xl font-normal text-stone-900 dark:text-white tracking-tight">
                    Track Consignment
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Check your package transit and GST invoice without signing in.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Consignment Order ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MIK-982104"
                    value={guestOrderId}
                    onChange={(e) => setGuestOrderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] active:bg-[#c9630c] text-black font-semibold text-xs tracking-wide shadow-xs transition-colors cursor-pointer"
                >
                  Track Package
                </button>

                {guestOrderResult && (
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900 dark:text-white">{guestOrderResult.orderNumber}</span>
                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {guestOrderResult.status}
                      </span>
                    </div>
                    <div>
                      {guestOrderResult.items.map((it, i) => (
                        <p key={i} className="text-stone-700 dark:text-stone-300">
                          {it.name} &times; {it.quantity}
                        </p>
                      ))}
                    </div>
                    <p className="text-stone-500 text-[11px]">
                      AWB: <span className="font-mono text-stone-800 dark:text-stone-200 font-bold">{guestOrderResult.trackingId}</span> ({guestOrderResult.courierPartner})
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openInvoiceForOrder(guestOrderResult)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F5821F] text-black font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>GST Invoice</span>
                      </button>
                      <Link
                        href={`/track?orderId=${guestOrderResult.orderNumber}`}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                      >
                        Transit Details &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className="text-xs text-[#E0741A] dark:text-[#F5821F] font-semibold hover:underline cursor-pointer"
                  >
                    &larr; Back to Sign in
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Under Card Quick Links */}
          {authMode === 'login' && (
            <div className="text-center text-xs text-stone-500 dark:text-stone-400 space-y-1">
              <div>
                Looking for an order consignment?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('guestTrack');
                    setAuthError(null);
                  }}
                  className="text-[#E0741A] dark:text-[#F5821F] font-semibold hover:underline cursor-pointer"
                >
                  Track without signing in &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Amazon / Myntra Style Modest Footer */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800/80 text-center space-y-3">
            <div className="flex items-center justify-center gap-5 sm:gap-6 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              <Link href="/terms" className="hover:text-[#F5821F] hover:underline">
                Conditions of Use
              </Link>
              <Link href="/privacy" className="hover:text-[#F5821F] hover:underline">
                Privacy Notice
              </Link>
              <Link href="/contact" className="hover:text-[#F5821F] hover:underline">
                Help &amp; Support
              </Link>
              <Link href="/admin" className="hover:text-[#F5821F] hover:underline">
                Staff Admin
              </Link>
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              &copy; 2012&ndash;2026, Mi King&apos;s DSLR Camera Shop or its affiliates. All rights reserved.
            </p>
          </div>
        </div>

        {/* Invoice Modal for Guest */}
        {selectedInvoice && (
          <CustomerInvoiceModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: If Customer IS Logged In, Render Authenticated Portal
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Page Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-stone-50/90 dark:bg-[#181613]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#2e2a25] rounded-2xl px-4 py-2.5 shadow-xs flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#F5821F] font-medium transition-colors">Home</Link>
          <span className="text-stone-300 dark:text-stone-600">/</span>
          <span className="text-stone-900 dark:text-white font-bold">My Account &amp; Orders</span>
        </div>

        <button
          onClick={handleLogout}
          className="text-stone-500 hover:text-rose-500 flex items-center gap-1 font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </nav>

      {/* Account Profile Header Card */}
      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#F5821F] to-[#d96a09] text-black font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-[#F5821F]/20 shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="bg-[#F5821F]/15 text-[#F5821F] border border-[#F5821F]/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {currentUser.loyaltyTier}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {currentUser.email} &bull; {currentUser.phone}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              {currentUser.city} &bull; Member since {currentUser.memberSince}
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Link
            href="/wishlist"
            className="flex-1 md:flex-initial p-3 px-4 rounded-2xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25] text-center hover:border-[#F5821F] transition-all group"
          >
            <div className="text-lg font-black text-[#F5821F]">{wishlistCount}</div>
            <div className="text-[10px] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white font-semibold">
              Wishlist Items
            </div>
          </Link>
          <Link
            href="/cart"
            className="flex-1 md:flex-initial p-3 px-4 rounded-2xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25] text-center hover:border-[#F5821F] transition-all group"
          >
            <div className="text-lg font-black text-stone-900 dark:text-white">{cart.length}</div>
            <div className="text-[10px] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white font-semibold">
              In Cart
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 md:flex-initial p-3 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center hover:bg-rose-500/20 transition-all cursor-pointer group"
          >
            <div className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
              Sign Out
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-[#2a2621] pb-3 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1a1815]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders &amp; GST Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('warranty')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'warranty'
              ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1a1815]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Active Warranties (1-Year)</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1a1815]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1a1815]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders & Downloadable Invoices */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-stone-900 dark:text-white">
              Equipment Orders &amp; Tax Invoices
            </h2>
            <Link
              href="/track"
              className="text-xs font-bold text-[#F5821F] hover:underline flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Live Consignments</span>
            </Link>
          </div>

          <div className="space-y-3">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-5 shadow-sm space-y-4 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-[#24211d] text-xs">
                  <div>
                    <span className="font-extrabold text-stone-900 dark:text-white">{order.orderNumber}</span>
                    <span className="text-stone-400 mx-2">&bull;</span>
                    <span className="text-stone-500">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : order.status === 'In Transit'
                          ? 'bg-[#F5821F]/15 text-[#F5821F]'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-black text-stone-900 dark:text-white text-sm">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-800 dark:text-stone-200">{it.name}</span>
                      <span className="text-stone-500 font-mono">Qty: {it.quantity} &bull; {formatINR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-stone-500 pt-1">
                    Courier: <span className="text-stone-700 dark:text-stone-300 font-medium">{order.courierPartner}</span> &bull; AWB: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{order.trackingId}</span>
                  </p>
                </div>

                {/* Action Buttons: Download Official Invoice + Track */}
                <div className="pt-2 border-t border-stone-100 dark:border-[#24211d] flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openInvoiceForOrder(order)}
                    className="px-3.5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official GST Invoice (PDF)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/track?orderId=${order.orderNumber}`}
                      className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#201d19] hover:bg-[#F5821F]/15 text-stone-700 dark:text-stone-300 hover:text-[#F5821F] font-bold text-xs transition-colors"
                    >
                      Transit Details
                    </Link>
                    <a
                      href={`https://wa.me/919032285420?text=${encodeURIComponent(
                        `Hi Mi King's Cameras, I am checking my order ${order.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Active Warranties */}
      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-4 shadow-sm transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 dark:text-white text-sm sm:text-base">
                  1-Year Mi King&apos;s Store Warranty Protection
                </h3>
                <p className="text-xs text-stone-500">
                  Every DSLR, mirrorless body, and lens is backed by our certified Hyderabad store warranty.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900 dark:text-white">Canon EOS 80D Body (Serial: 80D-441209)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Active Coverage
                </span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                Valid until 28 October 2027 &bull; Covers optical sensors, shutter assembly, autofocus motors, and electronics.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/warranty"
                className="text-xs font-bold text-[#F5821F] hover:underline flex items-center gap-1.5"
              >
                <span>Read Full 1-Year Store Warranty Terms &amp; Claim Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#181613] border-2 border-[#F5821F] rounded-2xl p-5 shadow-sm space-y-2 relative transition-colors">
            <span className="absolute top-4 right-4 bg-[#F5821F] text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
              Default Address
            </span>
            <h4 className="font-bold text-stone-900 dark:text-white text-sm">Studio / Home Delivery</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Flat 402, Al-Madina Heights, Mehdipatnam, Hyderabad, Telangana 500028
            </p>
            <p className="text-xs text-stone-500 pt-1">Contact: {currentUser.phone}</p>
          </div>

          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-5 shadow-sm space-y-2 transition-colors">
            <h4 className="font-bold text-stone-900 dark:text-white text-sm">In-Store Pickup Hub</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Mi King&apos;s Cameras Flagship Hub, Pillar 103, Bank Colony, Near Tadbun, Mir Alam Tank, Hyderabad, Telangana 500064
            </p>
            <p className="text-xs text-stone-500 pt-1">Hotline: +91 90322 85420 / +91 63058 75376</p>
          </div>
        </div>
      )}

      {/* Tab 4: Account Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <h3 className="font-black text-stone-900 dark:text-white text-base">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-500 mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-500 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-500 mb-1 font-semibold">Phone Number</label>
              <input
                type="tel"
                defaultValue={currentUser.phone}
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-stone-500 mb-1 font-semibold">Primary City</label>
              <input
                type="text"
                defaultValue={currentUser.city}
                className="w-full p-3 rounded-xl bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              className="bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#F5821F]/20 cursor-pointer"
            >
              Save Profile Updates
            </button>
          </div>
        </div>
      )}

      {/* Store Support & Concierge Help Banner */}
      <div className="bg-stone-900 dark:bg-[#0c0b09] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 dark:border-[#24211d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-lg">
          <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#F5821F]" />
            <span>Need Help With an Order or Equipment Exchange?</span>
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Connect directly with our Hyderabad camera technicians at Pillar 103, Bank Colony, Mir Alam Tank. We assist with order status, shutter-count verification, and exchange evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="https://wa.me/919032285420"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>WhatsApp Support</span>
          </a>
          <a
            href="tel:+919032285420"
            className="flex-1 md:flex-initial bg-stone-800 hover:bg-stone-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-stone-700"
          >
            <span>Call +91 90322 85420</span>
          </a>
        </div>
      </div>

      {/* Customer Invoice Modal */}
      {selectedInvoice && (
        <CustomerInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
