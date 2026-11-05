'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Edit3,
  Search,
  Filter,
  Key,
  Lock,
  Mail,
  Phone,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface Permission {
  id: string;
  label: string;
  category: 'Catalog & CMS' | 'Orders & GST' | 'Inventory' | 'Administration';
  description: string;
}

const ALL_PERMISSIONS: Permission[] = [
  { id: 'p_catalog_edit', label: 'Edit Products & Prices', category: 'Catalog & CMS', description: 'Can modify prices, titles, specs, and SEO descriptions' },
  { id: 'p_catalog_create', label: 'Create & Publish Gear', category: 'Catalog & CMS', description: 'Can add new DSLR/mirrorless bodies and lenses' },
  { id: 'p_catalog_delete', label: 'Delete Gear Listings', category: 'Catalog & CMS', description: 'Can delete discontinued products from public catalog' },
  { id: 'p_inventory_shutter', label: 'Manage Stock & Shutter Counts', category: 'Inventory', description: 'Can verify physical store stock and pre-owned camera shutter counts' },
  { id: 'p_orders_view', label: 'View Customer Orders', category: 'Orders & GST', description: 'Can view customer shipping addresses and order details' },
  { id: 'p_orders_invoice', label: 'Generate GST Invoices', category: 'Orders & GST', description: 'Can issue official B2B/B2C GST tax invoices and credit notes' },
  { id: 'p_staff_manage', label: 'Manage Staff & Roles', category: 'Administration', description: 'Can invite employees and alter access permissions' },
  { id: 'p_analytics_view', label: 'View Revenue & Profit', category: 'Administration', description: 'Can access daily sales metrics and profit margins' },
];

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Store Manager' | 'Inventory Specialist' | 'Sales Associate';
  department: string;
  status: 'Active' | 'Suspended';
  permissions: string[];
  lastActive: string;
}

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Mohd Idrees',
    email: 'idrees@mikcameras.in',
    phone: '+91 90322 85420',
    role: 'Super Admin',
    department: 'Executive',
    status: 'Active',
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    lastActive: 'Just now',
  },
  {
    id: 'emp-2',
    name: 'Eldest Son (Founder)',
    email: 'founder@mikcameras.in',
    phone: '+91 63058 75376',
    role: 'Super Admin',
    department: 'Management',
    status: 'Active',
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    lastActive: '5 mins ago',
  },
  {
    id: 'emp-3',
    name: 'Middle Son (MBA & Expert)',
    email: 'expert@mikcameras.in',
    phone: '+91 98490 12345',
    role: 'Store Manager',
    department: 'Quality & Testing',
    status: 'Active',
    permissions: ['p_catalog_edit', 'p_catalog_create', 'p_inventory_shutter', 'p_orders_view'],
    lastActive: '1 hour ago',
  },
  {
    id: 'emp-4',
    name: 'Youngest Son (Operations)',
    email: 'operations@mikcameras.in',
    phone: '+91 63058 75376',
    role: 'Store Manager',
    department: 'E-Commerce Ops',
    status: 'Active',
    permissions: ['p_catalog_edit', 'p_inventory_shutter', 'p_orders_view', 'p_orders_invoice'],
    lastActive: '3 hours ago',
  },
];

export default function UserManagementPage() {
  const { isSuperAdmin, admin } = useAdminAuth();
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State for New / Edit Employee
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<Employee['role']>('Store Manager');
  const [formDepartment, setFormDepartment] = useState('Store Operations');
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mikings_employees');
    if (saved) {
      try {
        setEmployees(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem('mikings_employees', JSON.stringify(updated));
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('Store Manager');
    setFormDepartment('Retail Store');
    setFormPermissions(['p_catalog_edit', 'p_inventory_shutter', 'p_orders_view']);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormPhone(emp.phone);
    setFormRole(emp.role);
    setFormDepartment(emp.department);
    setFormPermissions([...emp.permissions]);
  };

  const togglePermission = (permId: string) => {
    if (formPermissions.includes(permId)) {
      setFormPermissions(formPermissions.filter((id) => id !== permId));
    } else {
      setFormPermissions([...formPermissions, permId]);
    }
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingEmployee) {
      // Update existing
      const updated = employees.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              name: formName,
              email: formEmail,
              phone: formPhone,
              role: formRole,
              department: formDepartment,
              permissions: formPermissions,
            }
          : emp
      );
      saveEmployees(updated);
      setEditingEmployee(null);
    } else {
      // Create new
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: formName,
        email: formEmail,
        phone: formPhone,
        role: formRole,
        department: formDepartment,
        status: 'Active',
        permissions: formPermissions,
        lastActive: 'Pending Invitation',
      };
      saveEmployees([...employees, newEmp]);
      setIsAddModalOpen(false);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = employees.map((emp) => {
      if (emp.id === id) {
        return {
          ...emp,
          status: (emp.status === 'Active' ? 'Suspended' : 'Active') as Employee['status'],
        };
      }
      return emp;
    });
    saveEmployees(updated);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery);
    const matchesRole = selectedRole === 'All' || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
            Access Control &amp; RBAC
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Employee &amp; User Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Create employees, assign roles, and precisely control what each staff member can view or edit.
          </p>
        </div>

        {isSuperAdmin ? (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-md shadow-[#F5821F]/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add New Employee
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Super Admin Read-Only Mode</span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Total Staff</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">
            {employees.length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Active Accounts</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {employees.filter((e) => e.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Super Admins</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">
            {employees.filter((e) => e.role === 'Super Admin').length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Store Managers</span>
          <div className="text-2xl font-black text-[#F5821F] mt-1">
            {employees.filter((e) => e.role === 'Store Manager').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-100 dark:bg-[#1e1b18] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 pl-9 pr-3 text-xs text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Super Admin', 'Store Manager', 'Inventory Specialist', 'Sales Associate'].map(
            (role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole === role
                    ? 'bg-[#F5821F] text-black shadow-sm'
                    : 'bg-stone-100 dark:bg-[#1e1b18] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {role}
              </button>
            )
          )}
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-[#1b1916] border-b border-stone-200 dark:border-[#24211d] text-stone-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role &amp; Dept</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Permissions Active</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#24211d]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1c1916]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-stone-800 flex items-center justify-center font-black text-stone-700 dark:text-stone-300">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <span>{emp.name}</span>
                        <div className="text-[11px] text-stone-500 font-normal flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" />
                            {emp.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {emp.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                        emp.role === 'Super Admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : emp.role === 'Store Manager'
                          ? 'bg-[#F5821F]/10 text-[#F5821F] border border-[#F5821F]/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {emp.role}
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-1">{emp.department}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleStatus(emp.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        emp.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {emp.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#F5821F]" />
                      <span className="font-bold text-stone-900 dark:text-white">
                        {emp.permissions.length} / {ALL_PERMISSIONS.length}
                      </span>
                      <span className="text-[11px] text-stone-500">privileges</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                    {emp.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEditModal(emp)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-[#F5821F] hover:text-black hover:border-[#F5821F] transition-all font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Employee Permissions */}
      <AnimatePresence>
        {(isAddModalOpen || editingEmployee) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingEmployee(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#24211d] pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    {editingEmployee ? `Configure Permissions: ${editingEmployee.name}` : 'Invite & Setup New Employee'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Control exact privileges for products, pricing, orders, and staff.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEmployee(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#201d19] text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-5">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 px-3 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. ramesh@mikcameras.in"
                      className="w-full bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 px-3 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 90000 00000"
                      className="w-full bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 px-3 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Role Template
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as Employee['role'])}
                      className="w-full bg-stone-100 dark:bg-[#201d19] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 px-3 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Inventory Specialist">Inventory Specialist</option>
                      <option value="Sales Associate">Sales Associate</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                {/* Granular Permission Checklist */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#F5821F]">
                      Granular Access Permissions ({formPermissions.length} selected)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormPermissions(
                          formPermissions.length === ALL_PERMISSIONS.length
                            ? []
                            : ALL_PERMISSIONS.map((p) => p.id)
                        )
                      }
                      className="text-[11px] text-stone-500 hover:text-[#F5821F] underline cursor-pointer"
                    >
                      {formPermissions.length === ALL_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = formPermissions.includes(perm.id);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isChecked
                              ? 'bg-[#F5821F]/10 border-[#F5821F]/40 text-stone-900 dark:text-white'
                              : 'bg-stone-50 dark:bg-[#201d19] border-stone-200 dark:border-[#2a2621] text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-[#F5821F] text-black font-bold'
                                : 'border border-stone-400 dark:border-stone-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-bold block leading-tight">{perm.label}</span>
                            <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                              {perm.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-[#24211d] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingEmployee(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-md shadow-[#F5821F]/20 transition-all cursor-pointer"
                  >
                    Save &amp; Apply Access
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
