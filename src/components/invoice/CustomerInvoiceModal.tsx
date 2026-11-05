'use client';

import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { OFFICIAL_LOGO_BASE64 } from '@/data/logo';

export interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    hsn?: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  date: string;
  trackingId?: string;
  courierPartner?: string;
}

interface CustomerInvoiceModalProps {
  invoice: InvoiceData;
  onClose: () => void;
}

export function CustomerInvoiceModal({ invoice, onClose }: CustomerInvoiceModalProps) {
  const [includeGst, setIncludeGst] = useState(true);

  // 18% GST Calculations: Base Price + 9% CGST + 9% SGST
  const totalAmount = invoice.totalAmount;
  const taxableValue = includeGst ? Math.round((totalAmount / 1.18) * 100) / 100 : totalAmount;
  const totalGst = includeGst ? Math.round((totalAmount - taxableValue) * 100) / 100 : 0;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = cgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Invoice Format:</span>
            <div className="inline-flex rounded-xl p-1 bg-stone-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIncludeGst(true)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  includeGst ? 'bg-[#F5821F] text-black shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                18% B2C/B2B GST Invoice
              </button>
              <button
                type="button"
                onClick={() => setIncludeGst(false)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !includeGst ? 'bg-[#F5821F] text-black shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                Retail Bill of Supply
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-300 text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div className="space-y-6 pt-4 text-xs text-stone-800 print:pt-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center p-2 rounded-xl bg-white border border-stone-200 shadow-xs mb-1">
                <img
                  src={OFFICIAL_LOGO_BASE64}
                  alt="MI King's Cameras"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h2 className="text-lg font-black tracking-tight text-black">
                MI KING&apos;S DSLR CAMERA SHOP
              </h2>
              <p className="text-[11px] text-stone-600 max-w-sm leading-tight">
                Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064
              </p>
              <p className="text-[11px] text-stone-600">
                <span className="font-bold">Hotlines:</span> +91 90322 85420 / +91 63058 75376
              </p>
              <p className="text-[11px] text-stone-600">
                <span className="font-bold">Email:</span> mikingsdslrshop@gmail.com
              </p>
              <p className="text-[11px] text-stone-600">
                <span className="font-bold">GSTIN:</span> 36AAACM1920K1ZX | <span className="font-bold">State Code:</span> 36 (Telangana)
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-base font-black text-stone-900 block uppercase tracking-wider">
                {includeGst ? 'TAX INVOICE' : 'RETAIL INVOICE / BILL OF SUPPLY'}
              </span>
              <span className="text-[10px] text-stone-500 block">
                Original for Recipient
              </span>
              <div className="pt-2">
                <p className="font-mono font-bold text-stone-900 text-sm">
                  Invoice #: {invoice.orderNumber}
                </p>
                <p className="text-stone-500 text-[11px]">Date: {invoice.date}</p>
                <p className="text-stone-500 text-[11px]">Payment Mode: {invoice.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Customer & Courier Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block">
                Billed &amp; Shipped To:
              </span>
              <p className="font-extrabold text-stone-900 text-sm mt-1">{invoice.customerName}</p>
              <p className="text-stone-600 mt-0.5">{invoice.shippingAddress}</p>
              <p className="text-stone-600">
                {invoice.city}, {invoice.state} - {invoice.pincode}
              </p>
              <p className="text-stone-600">Phone: {invoice.customerPhone}</p>
              <p className="text-stone-600">Email: {invoice.customerEmail}</p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block">
                Consignment &amp; Warranty:
              </span>
              <p className="text-stone-700 font-semibold mt-1">
                Courier: {invoice.courierPartner || 'Delhivery Express / In-Store Handover'}
              </p>
              <p className="text-stone-600 font-mono">
                AWB Tracking: {invoice.trackingId || 'Delivered'}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] mt-2 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>1-Year Store Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-y border-stone-300 bg-stone-100 font-bold text-stone-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val</th>
                  {includeGst && (
                    <>
                      <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                    </>
                  )}
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {invoice.items.map((item, idx) => {
                  const itemTotal = item.price * item.quantity;
                  const itemTaxable = includeGst ? Math.round((itemTotal / 1.18) * 100) / 100 : itemTotal;
                  const itemGst = includeGst ? Math.round((itemTotal - itemTaxable) * 100) / 100 : 0;
                  const itemHalfGst = Math.round((itemGst / 2) * 100) / 100;

                  return (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-mono text-stone-500">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        <span className="text-[10px] text-stone-500">25-Point Store Certified</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-stone-600">
                        {item.hsn || '900659'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatINR(itemTaxable)}</td>
                      {includeGst && (
                        <>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                            {formatINR(itemHalfGst)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                            {formatINR(itemHalfGst)}
                          </td>
                        </>
                      )}
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900 font-mono">
                        {formatINR(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary Breakdown */}
          <div className="flex justify-between items-start pt-3 border-t border-stone-200">
            <div className="space-y-2 max-w-sm text-[11px] text-stone-600">
              <p className="font-bold text-stone-800">Terms &amp; Warranty Conditions:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>1-Year Store Warranty covers internal shutter, sensor, and circuit boards.</li>
                <li>Physical liquid ingress and external breakage not covered under warranty.</li>
                <li>Goods once sold can be exchanged within 30 days under store policy.</li>
              </ul>
            </div>

            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Taxable Amount:</span>
                <span className="font-mono">{formatINR(taxableValue)}</span>
              </div>
              {includeGst && (
                <>
                  <div className="flex justify-between text-stone-600">
                    <span>Central GST (9%):</span>
                    <span className="font-mono">{formatINR(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>State GST (9%):</span>
                    <span className="font-mono">{formatINR(sgst)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-black text-sm text-stone-900 border-t border-stone-300 pt-2">
                <span>Net Total Amount:</span>
                <span className="font-mono text-[#F5821F]">{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature & Store Seal */}
          <div className="flex justify-between items-end pt-8 border-t border-stone-200">
            <div className="text-[10px] text-stone-500">
              <p>This is a computer-generated tax invoice verified by Mi King&apos;s Cameras.</p>
              <p>Pillar 103, Bank Colony, Near Tadbun, Mir Alam Tank, Hyderabad, Telangana 500064</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-stone-400 mb-1" />
              <p className="text-[11px] font-bold text-stone-800">Mohd Idrees</p>
              <p className="text-[10px] text-stone-500 uppercase">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
