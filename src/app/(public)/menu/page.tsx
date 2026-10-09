'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/supabase/mock-data';
import { Product, ProductVariant, ProductAddon, Order, OrderType } from '@/types';
import { Search, Utensils, Info, Check, Plus, AlertCircle, ShoppingBag, CheckCircle2, Phone, MapPin, Send } from 'lucide-react';

function MenuContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [productsList, setProductsList] = useState<Product[]>(globalStore.getProducts());
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    return globalStore.subscribe(() => {
      setProductsList(globalStore.getProducts());
    });
  }, []);

  // Cart State
  const [cartItems, setCartItems] = useState<{
    id: string;
    product: Product;
    variant?: ProductVariant;
    addons: ProductAddon[];
    quantity: number;
  }[]>([]);

  // Selected variant & add-ons for detail modal
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumberInput, setTableNumberInput] = useState('1');
  const [customerNotes, setCustomerNotes] = useState('');

  const [submittedOrderNum, setSubmittedOrderNum] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Store settings
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

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveVariant(product.variants?.[0] || null);
    setSelectedAddons([]);
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
      quantity: 1
    };

    const existingIdx = cartItems.findIndex(item => item.id === newItem.id);
    if (existingIdx >= 0) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, newItem]);
    }

    setSelectedProduct(null);
  };

  // Submit Direct Order
  const handleFinalSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeSettings.venue_is_open) {
      setErrorMsg('المكان مغلق حالياً. لا يمكن استقبال طلبات جديدة.');
      return;
    }

    if (orderType === 'takeaway' && (!customerName.trim() || !customerPhone.trim())) {
      setErrorMsg('يرجى إدخال الاسم ورقم الهاتف لتأكيد الطلب التيك أواي');
      return;
    }

    if (orderType === 'indoor' && !tableNumberInput.trim()) {
      setErrorMsg('يرجى تحديد رقم الترابيزة لتأكيد الطلب داخل المكان');
      return;
    }

    const finalOrderTotal = Math.max(cartSubtotal, MIN_ORDER_SUBTOTAL);
    const newOrderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderRecord: Order = {
      id: `ord-${Date.now()}`,
      order_number: newOrderNum,
      order_type: orderType,
      status: 'pending',
      subtotal: cartSubtotal,
      discount_amount: 0,
      outside_food_fee: 0,
      total: finalOrderTotal,
      payment_status: 'unpaid',
      table_number: orderType === 'indoor' ? parseInt(tableNumberInput) || 1 : undefined,
      customer_name: orderType === 'takeaway' ? customerName : `طاولة #${tableNumberInput}`,
      customer_phone: orderType === 'takeaway' ? customerPhone : undefined,
      customer_notes: customerNotes,
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

    setSubmittedOrderNum(newOrderNum);
    setCartItems([]);
    setErrorMsg('');
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedCategory !== 'all') {
        const cat = INITIAL_CATEGORIES.find(c => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = product.name_ar.toLowerCase().includes(q);
        const matchEn = product.name_en.toLowerCase().includes(q);
        const matchIng = product.ingredients_ar?.toLowerCase().includes(q) || product.ingredients_en?.toLowerCase().includes(q);
        if (!matchAr && !matchEn && !matchIng) return false;
      }
      return true;
    });
  }, [productsList, selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* Header Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black font-serif text-stone-900">
          قائمة الطعام والمشروبات
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto">
          اختر وجباتك ومشروباتك المفضلة وتأكيد الطلب مباشرة
        </p>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 text-stone-400" />
          <Input
            type="text"
            placeholder={t('menu_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ltr:pl-10 rtl:pr-10 h-11 rounded-full border-[#e3d9cc] bg-white text-base shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="rounded-full px-4 text-xs font-bold"
          >
            {t('menu_all_categories')}
          </Button>
          {INITIAL_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
              className="rounded-full px-4 text-xs font-bold whitespace-nowrap"
            >
              {language === 'ar' ? cat.name_ar : cat.name_en}
            </Button>
          ))}
        </div>
      </div>

      {/* Minimum Charge Policy Notice */}
      <div className="bg-[#faf6f0] rounded-xl p-4 border border-[#e3d9cc] flex items-center justify-between text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1b2e1b] shrink-0" />
          <span>
            سياسة الحد الأدنى للاستهلاك (Minimum Charge): <strong>{MIN_ORDER_SUBTOTAL} ج.م</strong> 
            (إذا كان طلبك أكبر من {MIN_ORDER_SUBTOTAL} ج.م تُدفع قيمة الطلب فقط، وإذا لم تطلب أو طلبت بأقل يتم دفع {MIN_ORDER_SUBTOTAL} ج.م كحد أدنى).
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] shrink-0">سياسة المكان</Badge>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isAvailable = product.is_available;

          return (
            <Card
              key={product.id}
              className={`luxury-card overflow-hidden flex flex-col justify-between transition-all ${
                !isAvailable ? 'opacity-75 bg-stone-100/80 border-stone-300' : 'bg-white cursor-pointer'
              }`}
            >
              <div>
                <div
                  className="relative h-48 w-full bg-stone-100 overflow-hidden"
                  onClick={() => isAvailable && handleOpenProduct(product)}
                >
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                    alt={language === 'ar' ? product.name_ar : product.name_en}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isAvailable ? 'hover:scale-105' : 'grayscale-25'
                    }`}
                  />
                  <div className="absolute top-3 ltr:right-3 rtl:left-3 flex gap-1">
                    <Badge variant="gold" className="font-black shadow-md text-sm">
                      {product.price} {t('price_egp')}
                    </Badge>
                  </div>

                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 text-center">
                      <Badge variant="destructive" className="font-extrabold text-xs px-3 py-1.5 shadow-lg tracking-wide uppercase">
                        Out of Stock • غير متاح حالياً 🚫
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-stone-900">
                      {language === 'ar' ? product.name_ar : product.name_en}
                    </h3>
                  </div>

                  {(product.ingredients_ar || product.description_ar) && (
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {t('ingredients')}: {language === 'ar' ? (product.ingredients_ar || product.description_ar) : (product.ingredients_en || product.description_en)}
                    </p>
                  )}
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                {isAvailable ? (
                  <Button
                    onClick={() => handleOpenProduct(product)}
                    variant="secondary"
                    size="sm"
                    className="w-full font-bold gap-1.5 rounded-xl shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة للطلب</span>
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    size="sm"
                    className="w-full font-bold gap-1.5 rounded-xl border-stone-300 bg-stone-200 text-stone-500 cursor-not-allowed"
                  >
                    <span>غير متاح حالياً (Out of Stock)</span>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-xl mx-auto z-40 bg-[#161210] text-white rounded-2xl p-4 shadow-2xl border border-[#c69214]/40 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c69214] text-stone-900 rounded-xl font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">السلة: {cartItems.reduce((a, b) => a + b.quantity, 0)} أصناف</div>
              <div className="text-xs text-[#c69214] font-black">{cartSubtotal.toFixed(2)} EGP</div>
            </div>
          </div>

          <Button
            onClick={() => {
              setIsCheckoutOpen(true);
              setSubmittedOrderNum(null);
            }}
            variant="secondary"
            className="font-bold rounded-xl gap-2 shadow-md"
          >
            <span>تأكيد الطلب</span>
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Checkout Drawer / Modal */}
      {isCheckoutOpen && (
        <Dialog
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title="تأكيد الطلب"
        >
          {submittedOrderNum ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">تم تأكيد طلبك بنجاح! 🎉</h3>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                رقم الطلب: <strong className="text-[#1b2e1b] font-black">{submittedOrderNum}</strong>
                <br />
                تم استلام طلبك وبدأ المطبخ في تجهيزه.
              </p>
              <div className="pt-2">
                <Button onClick={() => setIsCheckoutOpen(false)} variant="default" className="w-full rounded-xl">
                  موافق
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmitOrder} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Cart Summary List */}
              <div className="p-3 bg-[#faf6f0] rounded-xl space-y-2 border border-[#e3d9cc]">
                <div className="font-bold text-stone-900 text-xs border-b border-stone-200 pb-1.5">ملخص الحساب والحد الأدنى (Minimum Charge):</div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span>{item.quantity}x {item.product.name_ar} {item.variant ? `(${item.variant.name_ar})` : ''}</span>
                    <span className="font-bold text-[#1b2e1b]">{(item.product.price + (item.variant?.price_delta || 0)) * item.quantity} EGP</span>
                  </div>
                ))}
                
                {cartSubtotal < MIN_ORDER_SUBTOTAL && (
                  <div className="flex justify-between items-center text-xs text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span>فرق الحد الأدنى للاستهلاك (Minimum Charge Top-up):</span>
                    <span>+{(MIN_ORDER_SUBTOTAL - cartSubtotal).toFixed(2)} EGP</span>
                  </div>
                )}

                <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-200">
                  <span>إجمالي المبلغ المستحق للدفع:</span>
                  <span className="text-[#c69214]">{Math.max(cartSubtotal, MIN_ORDER_SUBTOTAL).toFixed(2)} EGP</span>
                </div>
              </div>

              {/* Order Type Selection */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">مكان تواجدك / نوع الطلب:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('indoor')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                      orderType === 'indoor'
                        ? 'bg-[#1b2e1b] text-white border-[#1b2e1b]'
                        : 'bg-white text-stone-800 border-stone-200'
                    }`}
                  >
                    داخل المكان (Indoor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                      orderType === 'takeaway'
                        ? 'bg-[#1b2e1b] text-white border-[#1b2e1b]'
                        : 'bg-white text-stone-800 border-stone-200'
                    }`}
                  >
                    تيك أواي (Takeaway)
                  </button>
                </div>
              </div>

              {/* Conditional Inputs based on Order Type */}
              {orderType === 'indoor' ? (
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">رقم الترابيزة *</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    placeholder="أدخل رقم الترابيزة..."
                    value={tableNumberInput}
                    onChange={(e) => setTableNumberInput(e.target.value)}
                    className="h-10 text-xs font-bold text-center"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">الاسم بالكامل *</label>
                    <Input
                      type="text"
                      placeholder="الاسم"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 block">رقم التليفون *</label>
                    <Input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات إضافية على الطلب</label>
                <Input
                  placeholder="بدون بصل، زيارة كاتشب..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} className="w-1/3 rounded-xl">
                  إلغاء
                </Button>
                <Button type="submit" variant="secondary" className="w-2/3 font-bold rounded-xl gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الطلب</span>
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      )}

      {/* Detail Modifier Modal */}
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
                <label className="font-bold text-stone-900 block">اختر النوع / النكهة:</label>
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

            <div className="pt-3 flex gap-2">
              <Button variant="outline" onClick={() => setSelectedProduct(null)} className="w-1/3 rounded-xl">
                إلغاء
              </Button>
              <Button onClick={handleAddToCart} variant="secondary" className="w-2/3 font-bold rounded-xl gap-2">
                <Plus className="w-4 h-4" />
                <span>إضافة للسلة</span>
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">جاري تحميل قائمة الطعام...</div>}>
      <MenuContent />
    </Suspense>
  );
}
