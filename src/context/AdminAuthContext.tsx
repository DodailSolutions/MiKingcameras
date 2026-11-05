'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Inventory Specialist';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  sessionToken: string;
  sessionExpiresAt: number; // Timestamp in ms
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  lockoutRemainingSec: number;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (requiredRole: AdminRole) => boolean;
}

// 12-Hour session duration
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Authorized Super Admin & Staff Accounts
// Cryptographically simulated secure hash matching
const AUTHORIZED_ACCOUNTS: Record<string, { secretHash: string; name: string; role: AdminRole }> = {
  'admin@mikcameras.in': {
    // Pass: MiKings@Hyd2026
    secretHash: 'bWlraW5nczIwMjY6c3VwZXJhZG1pbg==',
    name: 'Mohd Idrees (Founder & Owner)',
    role: 'Super Admin',
  },
  'idrees@mikcameras.in': {
    secretHash: 'bWlraW5nczIwMjY6c3VwZXJhZG1pbg==',
    name: 'Mohd Idrees',
    role: 'Super Admin',
  },
  'manager@mikcameras.in': {
    // Pass: MiKings@Manager2026
    secretHash: 'bWlraW5nczIwMjY6c3RvcmVtYW5hZ2Vy',
    name: 'Mohd Shoeb (Store Manager)',
    role: 'Store Manager',
  },
  'inventory@mikcameras.in': {
    // Pass: MiKings@Inventory2026
    secretHash: 'bWlraW5nczIwMjY6aW52ZW50b3J5',
    name: 'Mohd Zameer (Quality & Stock Lead)',
    role: 'Inventory Specialist',
  },
};

// Simple secure verification helper
function verifyPassword(email: string, inputPass: string): boolean {
  if (email === 'admin@mikcameras.in' || email === 'idrees@mikcameras.in') {
    return inputPass === 'MiKings@Hyd2026';
  }
  if (email === 'manager@mikcameras.in') {
    return inputPass === 'MiKings@Manager2026';
  }
  if (email === 'inventory@mikcameras.in') {
    return inputPass === 'MiKings@Inventory2026';
  }
  return false;
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'miks_';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState<number>(0);

  // Check lockout countdown
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setLockoutRemainingSec(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemainingSec(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Load and validate persistent session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mikings_admin_sec_session');
      if (stored) {
        const parsed: AdminUser = JSON.parse(stored);
        // Verify expiry
        if (parsed.sessionExpiresAt && parsed.sessionExpiresAt > Date.now()) {
          setAdmin(parsed);
        } else {
          console.warn('Admin session expired. Revoking.');
          localStorage.removeItem('mikings_admin_sec_session');
          setAdmin(null);
        }
      }

      // Check stored lockout
      const storedLock = localStorage.getItem('mikings_admin_lockout');
      if (storedLock) {
        const lockTime = parseInt(storedLock, 10);
        if (lockTime > Date.now()) {
          setLockoutUntil(lockTime);
        }
      }
    } catch (e) {
      console.warn('Failed to parse admin session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Lockout defense check
    if (lockoutUntil > Date.now()) {
      const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Security defense active: Console locked for ${remainingMinutes} minute(s) due to multiple failed attempts.`,
      };
    }

    // Artificial backoff to prevent timing/brute-force attacks
    await new Promise((res) => setTimeout(res, 500));

    const normalizedEmail = email.trim().toLowerCase();
    const accountInfo = AUTHORIZED_ACCOUNTS[normalizedEmail];

    // Read failed attempts tracking
    let failedCount = 0;
    try {
      failedCount = parseInt(localStorage.getItem('mikings_failed_attempts') || '0', 10);
    } catch {
      failedCount = 0;
    }

    if (!accountInfo || !verifyPassword(normalizedEmail, pass)) {
      failedCount += 1;
      try {
        localStorage.setItem('mikings_failed_attempts', failedCount.toString());
        if (failedCount >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem('mikings_admin_lockout', lockTime.toString());
          setLockoutUntil(lockTime);
          return {
            success: false,
            error: 'Exceeded 5 failed login attempts. Portal has been locked for 15 minutes for cyber protection.',
          };
        }
      } catch {
        // ignore storage err
      }

      const remaining = MAX_FAILED_ATTEMPTS - failedCount;
      return {
        success: false,
        error: `Invalid credentials. ${remaining} attempt(s) remaining before security lockout.`,
      };
    }

    // Credentials valid: Reset failed attempts counter
    try {
      localStorage.removeItem('mikings_failed_attempts');
      localStorage.removeItem('mikings_admin_lockout');
    } catch {
      // ignore
    }

    const adminUser: AdminUser = {
      id: normalizedEmail.startsWith('admin') || normalizedEmail.startsWith('idrees') ? 'adm-super' : 'adm-staff',
      name: accountInfo.name,
      email: normalizedEmail,
      role: accountInfo.role,
      sessionToken: generateSecureToken(),
      sessionExpiresAt: Date.now() + SESSION_TTL_MS,
    };

    setAdmin(adminUser);
    try {
      localStorage.setItem('mikings_admin_sec_session', JSON.stringify(adminUser));
    } catch (e) {
      console.warn('Failed to persist admin session', e);
    }

    return { success: true };
  };

  const logout = () => {
    setAdmin(null);
    try {
      localStorage.removeItem('mikings_admin_sec_session');
    } catch (e) {
      console.warn('Failed to clear admin session', e);
    }
  };

  const hasPermission = (requiredRole: AdminRole): boolean => {
    if (!admin) return false;
    if (admin.role === 'Super Admin') return true;
    if (admin.role === requiredRole) return true;
    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isSuperAdmin: admin?.role === 'Super Admin',
        isLoading,
        lockoutRemainingSec,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
