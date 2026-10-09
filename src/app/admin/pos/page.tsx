'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/language-context';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_TABLES } from '@/lib/supabase/mock-data';
import { Product, ProductVariant, ProductAddon, DiningTable } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import {
  CircleDollarSign,
  Utensils,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  ShieldAlert,
  UserCheck,
  Percent,
  AlertCircle
} from 'lucide-react';

export default function AdminPosPage() {
  const { language, t } = useLanguage();

  // Cashier Shift State
  const [shiftStatus, setShiftStatus] = useState<'open' | 'closed'>('open');
  const [openingCash, setOpeningCash] = useState(500.00);

  // Active Table Selection
  const [selectedTable, setSelectedTable] = useState<DiningTable>(INITIAL_TABLES[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Active Order Cart State
  const [orderItems, setOrderItems] = useState<{
    id: string;
    product: Product;
    variant?: ProductVariant;
    addons: ProductAddon[];
    quantity: number;
    unitPrice: number;
  }[]>([]);

  // Policy & Discount Adjustments
  const [discountAmount, setDiscountAmount] = useState(0);
  const [outsideFoodGuests, setOutsideFoodGuests] = useState(0); // 15 EGP per guest fee if violation recorded
  const OUTSIDE_FOOD_FEE_PER_PERSON = 15.00;

  // Receipt Modal State
  const [receiptModal, setReceiptModal] = useState<{
    receiptNumber: string;
    items: any[];
    subtotal: number;
    discount: number;
    outsideFee: number;
    total: number;
    tableNumber: number;
    date: string;
  } | null>(null);

  const subtotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [orderItems]);

  const outsideFoodTotalFee = outsideFoodGuests * OUTSIDE_FOOD_FEE_PER_PERSON;
  const finalTotal = Math.max(0, subtotal - discountAmount + outsideFoodTotalFee);

  const handleAddProduct = (product: Product) => {
    const itemUnitPrice = product.price;
    const itemId = `${product.id}-base`;

    const existingIdx = orderItems.findIndex(i => i.id === itemId);
    if (existingIdx >= 0) {
      const updated = [...orderItems];
      updated[existingIdx].quantity += 1;
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: itemId,
          product,
          addons: [],
          quantity: 1,
          unitPrice: itemUnitPrice
        }
      ]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleCheckoutCash = () => {
    if (orderItems.length === 0) return;

    const receipt = {
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...orderItems],
      subtotal,
      discount: discountAmount,
      outsideFee: outsideFoodTotalFee,
      total: finalTotal,
      tableNumber: selectedTable.table_number,
      date: new Date().toLocaleString('ar-EG')
    };

    setReceiptModal(receipt);
    setOrderItems([]);
    setDiscountAmount(0);
    setOutsideFoodGuests(0);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return INITIAL_PRODUCTS;
    const cat = INITIAL_CATEGORIES.find(c => c.slug === selectedCategory);
    return cat ? INITIAL_PRODUCTS.filter(p => p.category_id === cat.id) : INITIAL_PRODUCTS;
  }, [selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Shift Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1c231c] text-white p-4 rounded-2xl border border-[#2c362c]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#d4af37] text-stone-900 rounded-xl font-bold">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold font-serif text-white">كاشير نقطة البيع (El Villa POS)</div>
            <div className="text-xs text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>الوردية الحالية: #104 (مبلغ الافتتاح: {openingCash} EGP)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" className="font-bold">الكاشير: أحمد محمود</Badge>
        </div>
      </div>

      {/* POS Two-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Product Selection Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Table Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-700 shrink-0">الطاولة:</span>
            {INITIAL_TABLES.map((t) => (
              <Button
                key={t.id}
                variant={selectedTable.id === t.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTable(t)}
                className="rounded-full text-xs font-bold shrink-0"
              >
                {t.name}
              </Button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Button
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="rounded-full text-xs font-bold shrink-0"
            >
              الكل
            </Button>
            {INITIAL_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className="rounded-full text-xs font-bold shrink-0"
              >
                {language === 'ar' ? cat.name_ar : cat.name_en}
              </Button>
            ))}
          </div>

          {/* Product Cards Quick-Add Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                onClick={() => handleAddProduct(product)}
                className="p-3 bg-white border-[#e4ded4] cursor-pointer hover:border-[#2d3b2d] transition-all hover:shadow-md flex flex-col justify-between h-28"
              >
                <div>
                  <div className="font-bold text-xs text-stone-900 line-clamp-1">
                    {language === 'ar' ? product.name_ar : product.name_en}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {product.ingredients_ar?.slice(0, 25) || 'صنف كافيه'}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs font-black text-[#2d3b2d]">{product.price} EGP</span>
                  <div className="w-6 h-6 rounded-full bg-[#f3eee7] text-[#2d3b2d] flex items-center justify-center font-bold text-xs">
                    +
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Current Order Cart & Settlement */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white border-[#e4ded4] p-5 space-y-4 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-bold text-base text-stone-900">
                  طلب {selectedTable.name}
                </h3>
                <Badge variant="outline">{orderItems.reduce((a, b) => a + b.quantity, 0)} أصناف</Badge>
              </div>

              {/* Order Items Table */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {orderItems.map((item) => (
                  <div key={item.id} className="p-2.5 bg-[#f3eee7] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">
                        {language === 'ar' ? item.product.name_ar : item.product.name_en}
                      </div>
                      <div className="text-[10px] text-stone-500">{item.unitPrice} EGP / وحدة</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-white text-stone-800 font-bold border border-stone-300"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-[#2d3b2d] text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {orderItems.length === 0 && (
                  <div className="text-center text-stone-400 py-12 text-xs">
                    انقر على أصناف القائمة لإضافتها للطلب
                  </div>
                )}
              </div>
            </div>

            {/* Calculations & Policy Adjustments */}
            <div className="space-y-3 pt-3 border-t border-stone-200 text-xs">
              {/* Outside Food Fee Policy Control */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>رسوم مأكولات خارجية (15 EGP/شخص):</span>
                  <input
                    type="number"
                    min={0}
                    value={outsideFoodGuests}
                    onChange={(e) => setOutsideFoodGuests(parseInt(e.target.value) || 0)}
                    className="w-16 h-7 rounded border border-amber-300 bg-white text-center font-bold"
                  />
                </div>
                {outsideFoodTotalFee > 0 && (
                  <div className="text-[10px] text-amber-800 font-bold">
                    إجمالي الرسوم المضافة: +{outsideFoodTotalFee} EGP ({outsideFoodGuests} ضيوف)
                  </div>
                )}
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700">خصم إضافي مصرح (EGP):</span>
                <input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-20 h-8 rounded border border-stone-300 bg-white text-center font-bold"
                />
              </div>

              {/* Totals Summary */}
              <div className="space-y-1 pt-2 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>المجموع الفرعي (Subtotal):</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                {outsideFoodTotalFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold">
                    <span>رسوم مأكولات خارجية:</span>
                    <span>+{outsideFoodTotalFee.toFixed(2)} EGP</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>الخصم المطبق:</span>
                    <span>-{discountAmount.toFixed(2)} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-[#2d3b2d] pt-1 border-t border-stone-300">
                  <span>الإجمالي النهائي:</span>
                  <span>{finalTotal.toFixed(2)} EGP</span>
                </div>
              </div>

              {/* Cash Checkout Button */}
              <Button
                onClick={handleCheckoutCash}
                disabled={orderItems.length === 0}
                variant="secondary"
                size="lg"
                className="w-full font-bold text-base rounded-xl gap-2 shadow-md"
              >
                <CircleDollarSign className="w-5 h-5" />
                <span>تحصيل نقدي (Cash Settlement)</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {receiptModal && (
        <Dialog
          isOpen={!!receiptModal}
          onClose={() => setReceiptModal(null)}
          title={`إيصال تحصيل — ${receiptModal.receiptNumber}`}
        >
          <div className="space-y-4 printable-receipt text-xs">
            {/* Header Print Receipt */}
            <div className="text-center border-b border-stone-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-stone-900">إل فيلا (El Villa)</h2>
              <p className="text-[10px] text-stone-600">كافيه ومطعم وقاعة مناسبات</p>
              <div className="text-[10px] mt-1 font-bold">إدارة: 01228852203</div>
              <div className="text-[10px] text-stone-500 mt-1">
                رقم الإيصال: {receiptModal.receiptNumber} | {receiptModal.date}
              </div>
            </div>

            {/* Receipt Items */}
            <div className="space-y-1 border-b border-stone-800 pb-3">
              {receiptModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.product.name_ar}</span>
                  <span>{(item.unitPrice * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
            </div>

            {/* Receipt Totals */}
            <div className="space-y-1 font-semibold border-b border-stone-800 pb-3">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{receiptModal.subtotal.toFixed(2)} EGP</span>
              </div>
              {receiptModal.outsideFee > 0 && (
                <div className="flex justify-between">
                  <span>رسوم مأكولات خارجية:</span>
                  <span>+{receiptModal.outsideFee.toFixed(2)} EGP</span>
                </div>
              )}
              {receiptModal.discount > 0 && (
                <div className="flex justify-between">
                  <span>الخصم:</span>
                  <span>-{receiptModal.discount.toFixed(2)} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-black pt-1">
                <span>الإجمالي المدفوع:</span>
                <span>{receiptModal.total.toFixed(2)} EGP</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-stone-500">
              شكراً لزيارتكم إل فيلا!
            </div>

            <div className="pt-2 flex gap-2 no-print">
              <Button variant="outline" onClick={() => setReceiptModal(null)} className="w-1/2 rounded-xl">
                إغلاق
              </Button>
              <Button onClick={() => window.print()} variant="secondary" className="w-1/2 font-bold rounded-xl gap-1">
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة</span>
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
