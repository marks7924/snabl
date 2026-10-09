'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_TABLES } from '@/lib/supabase/mock-data';
import { Product, ProductVariant, ProductAddon, OrderItem, Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Utensils, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Clock, Info, ShieldAlert } from 'lucide-react';

function QrTableOrderingContent() {
  const { tableId } = useParams();
  const { language, t } = useLanguage();

  const tableNumber = parseInt(String(tableId) || '1');
  const activeTable = INITIAL_TABLES.find(t => t.table_number === tableNumber) || INITIAL_TABLES[0];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<{
    id: string;
    product: Product;
    variant?: ProductVariant;
    addons: ProductAddon[];
    quantity: number;
  }[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Submitted Order tracking state
  const [activeOrder, setActiveOrder] = useState<{
    orderNumber: string;
    status: string;
    items: any[];
    total: number;
    submittedAt: string;
  } | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const storeSettings = globalStore.getSettings();
  const MIN_ORDER_SUBTOTAL = storeSettings.minimum_order_subtotal;

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      let unitPrice = item.product.price;
      if (item.variant) unitPrice += item.variant.price_delta;
      const addonsPrice = item.addons.reduce((a, add) => a + add.price, 0);
      return acc + (unitPrice + addonsPrice) * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleOpenModifierModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveVariant(product.variants?.[0] || null);
    setSelectedAddons([]);
    setQuantity(1);
    setNotes('');
  };

  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const newItem = {
      id: `${selectedProduct.id}-${activeVariant?.id || 'base'}-${selectedAddons.map(a => a.id).sort().join('-')}`,
      product: selectedProduct,
      variant: activeVariant || undefined,
      addons: [...selectedAddons],
      quantity
    };

    const existingIdx = cartItems.findIndex(item => item.id === newItem.id);
    if (existingIdx >= 0) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += quantity;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, newItem]);
    }

    setSelectedProduct(null);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleSubmitOrder = () => {
    if (!storeSettings.venue_is_open) {
      setErrorMsg('المكان مغلق حالياً. لا يمكن استقبال طلبات جديدة.');
      return;
    }

    const finalOrderTotal = Math.max(cartSubtotal, MIN_ORDER_SUBTOTAL);
    const newOrderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderRecord: Order = {
      id: `ord-${Date.now()}`,
      order_number: newOrderNumber,
      order_type: 'qr_table',
      status: 'pending',
      subtotal: cartSubtotal,
      discount_amount: 0,
      outside_food_fee: 0,
      total: finalOrderTotal,
      payment_status: 'unpaid',
      table_number: activeTable.table_number,
      customer_name: `طاولة #${activeTable.table_number}`,
      customer_notes: notes,
      created_at: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      items: cartItems.map(item => ({
        id: `i-${Math.random()}`,
        order_id: `ord-${Date.now()}`,
        product_name_ar: item.product.name_ar,
        product_name_en: item.product.name_en,
        variant_name_ar: item.variant?.name_ar,
        variant_name_en: item.variant?.name_en,
        unit_price: item.product.price + (item.variant?.price_delta || 0),
        quantity: item.quantity,
        subtotal: (item.product.price + (item.variant?.price_delta || 0)) * item.quantity
      }))
    };

    globalStore.addOrder(newOrderRecord);

    setActiveOrder({
      orderNumber: newOrderNumber,
      status: 'pending',
      items: [...cartItems],
      total: finalOrderTotal,
      submittedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    });

    setCartItems([]);
    setIsCartOpen(false);
    setErrorMsg('');
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return INITIAL_PRODUCTS;
    const cat = INITIAL_CATEGORIES.find(c => c.slug === selectedCategory);
    if (!cat) return INITIAL_PRODUCTS;
    return INITIAL_PRODUCTS.filter(p => p.category_id === cat.id);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14110f] text-white py-4 px-4 shadow-md flex items-center justify-between border-b border-[#c69214]/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c69214] text-stone-900 font-bold text-lg">
            V
          </div>
          <div>
            <div className="text-base font-bold font-serif text-[#c69214]">
              إل فيلا (El Villa)
            </div>
            <div className="text-xs text-stone-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('table_number')} {activeTable.table_number}</span>
            </div>
          </div>
        </div>

        {cartItems.length > 0 && (
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="secondary"
            size="sm"
            className="rounded-full font-bold gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سلة الطلب ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
          </Button>
        )}
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {/* Policy Notices Banner */}
        <div className="bg-[#faf6f0] rounded-xl p-3 border border-[#e3d9cc] space-y-1 text-xs text-stone-700">
          <div className="flex items-center justify-between font-bold text-stone-900">
            <span>تنبيهات طاولات إل فيلا:</span>
            <Badge variant="outline" className="text-[10px]">سياسة المكان</Badge>
          </div>
          <p>• الحد الأدنى للطلب: <strong>{MIN_ORDER_SUBTOTAL} ج.م</strong> | يمنع إدخال المأكولات والمشروبات الخارجية.</p>
        </div>

        {/* Live Active Order Status Tracker */}
        {activeOrder && (
          <Card className="bg-emerald-950 text-white border border-emerald-800 p-4 rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="font-bold text-base">متابعة حالة الطلب #{activeOrder.orderNumber}</span>
              </div>
              <Badge variant="gold" className="text-xs">
                {activeOrder.status === 'pending' && 'قيد الانتظار (وصل للمطبخ)'}
                {activeOrder.status === 'preparing' && 'جاري التحضير الآن'}
                {activeOrder.status === 'ready' && 'جاهز للتقديم'}
              </Badge>
            </div>

            <div className="text-xs text-stone-300 space-y-1">
              <div>وقت الإرسال: {activeOrder.submittedAt}</div>
              <div>إجمالي الحساب: <strong className="text-emerald-300">{activeOrder.total} ج.م</strong></div>
            </div>

            <div className="text-[11px] text-emerald-300 bg-emerald-900/50 p-2 rounded-lg">
              ✓ تم إرسال الطلب لشاشة الكاشير والمطبخ بنجاح. يمكنك إضافة طلبات جديدة في أي وقت.
            </div>
          </Card>
        )}

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="rounded-full px-4 text-xs font-bold shrink-0"
          >
            الكل
          </Button>
          {INITIAL_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
              className="rounded-full px-4 text-xs font-bold shrink-0"
            >
              {language === 'ar' ? cat.name_ar : cat.name_en}
            </Button>
          ))}
        </div>

        {/* Menu Product Grid */}
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => product.is_available && handleOpenModifierModal(product)}
              className={`p-3 bg-white border-[#e3d9cc] flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-[#1b2e1b] ${
                !product.is_available ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                  alt={product.name_ar}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    {language === 'ar' ? product.name_ar : product.name_en}
                  </h4>
                  {(product.ingredients_ar || product.description_ar) && (
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {language === 'ar' ? (product.ingredients_ar || product.description_ar) : (product.ingredients_en || product.description_en)}
                    </p>
                  )}
                  <div className="text-xs font-black text-[#1b2e1b] mt-1">
                    {product.price} {t('price_egp')}
                  </div>
                </div>
              </div>

              <Button size="sm" variant="secondary" className="h-8 px-3 rounded-full text-xs font-bold shrink-0">
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary Drawer / Modal */}
      {isCartOpen && (
        <Dialog
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          title={`سلة طلب طاولة ${activeTable.table_number}`}
        >
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                let unitPrice = item.product.price;
                if (item.variant) unitPrice += item.variant.price_delta;
                const addonsPrice = item.addons.reduce((a, add) => a + add.price, 0);
                const itemSubtotal = (unitPrice + addonsPrice) * item.quantity;

                return (
                  <div key={item.id} className="p-3 bg-[#faf6f0] rounded-xl flex items-center justify-between text-xs border border-[#e3d9cc]">
                    <div>
                      <div className="font-bold text-stone-900">
                        {language === 'ar' ? item.product.name_ar : item.product.name_en}
                        {item.variant && <span className="text-[#1b2e1b]"> ({language === 'ar' ? item.variant.name_ar : item.variant.name_en})</span>}
                      </div>
                      {item.addons.length > 0 && (
                        <div className="text-[10px] text-stone-500">
                          إضافات: {item.addons.map(a => language === 'ar' ? a.name_ar : a.name_en).join(', ')}
                        </div>
                      )}
                      <div className="font-semibold text-stone-700 mt-0.5">
                        {itemSubtotal} ج.م
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-stone-700 font-bold flex items-center justify-center border border-stone-300"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#1b2e1b] text-white font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-stone-700">إجمالي الطلب:</span>
                <span className="text-xl font-black text-[#1b2e1b]">{cartSubtotal} {t('price_egp')}</span>
              </div>

              {cartSubtotal < MIN_ORDER_SUBTOTAL && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  الحد الأدنى للطلب هو {MIN_ORDER_SUBTOTAL} ج.م. يرجى إضافة أصناف بقيمة {MIN_ORDER_SUBTOTAL - cartSubtotal} ج.م للتمكن من تأكيد الطلب.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCartOpen(false)} className="w-1/3 rounded-xl">
                  متابعة التسوق
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={cartSubtotal < MIN_ORDER_SUBTOTAL}
                  variant="secondary"
                  className="w-2/3 font-bold rounded-xl gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الطلب</span>
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Item Modifiers Selector Modal */}
      {selectedProduct && (
        <Dialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={language === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
        >
          <div className="space-y-4 text-xs">
            {/* Variants */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-bold text-[#1c1917] block">اختر النوع / النكهة:</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariant(v)}
                      className={`p-2 rounded-lg border text-xs font-semibold text-center transition-colors ${
                        activeVariant?.id === v.id
                          ? 'bg-[#1b2e1b] text-white border-[#1b2e1b]'
                          : 'bg-white text-stone-800 border-stone-200'
                      }`}
                    >
                      {language === 'ar' ? v.name_ar : v.name_en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {selectedProduct.addons && selectedProduct.addons.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-bold text-stone-900 block">إضافات متاح اختيارها:</label>
                {selectedProduct.addons.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-2.5 rounded-lg border flex items-center justify-between ${
                        isChecked ? 'bg-[#c69214]/20 border-[#c69214] font-bold' : 'bg-white border-stone-200'
                      }`}
                    >
                      <span>{language === 'ar' ? addon.name_ar : addon.name_en}</span>
                      <span className="text-[#1b2e1b]">+{addon.price} ج.م</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-stone-900">الكمية:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-200 text-stone-800 font-bold"
                >
                  -
                </button>
                <span className="font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-[#1b2e1b] text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <Button variant="outline" onClick={() => setSelectedProduct(null)} className="w-1/3 rounded-xl">
                إلغاء
              </Button>
              <Button onClick={handleAddToCart} variant="secondary" className="w-2/3 font-bold rounded-xl">
                إضافة للسلة
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default function QrTableOrderingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">جاري تحميل قائمة الطاولة...</div>}>
      <QrTableOrderingContent />
    </Suspense>
  );
}
