'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { INITIAL_CATEGORIES } from '@/lib/supabase/mock-data';
import { Product, Category } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { Utensils, Plus, Edit, Trash2, Check, AlertCircle } from 'lucide-react';

export default function AdminMenuManagementPage() {
  const { language, t } = useLanguage();

  const [products, setProducts] = useState<Product[]>(globalStore.getProducts());
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Form State for Editing/New Product
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formPrice, setFormPrice] = useState('50');
  const [formCategoryId, setFormCategoryId] = useState(INITIAL_CATEGORIES[0].id);
  const [formIngredientsAr, setFormIngredientsAr] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  useEffect(() => {
    return globalStore.subscribe(() => {
      setProducts(globalStore.getProducts());
    });
  }, []);

  const handleToggleAvailability = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      globalStore.updateProduct(productId, { is_available: !prod.is_available });
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormNameAr(product.name_ar);
    setFormNameEn(product.name_en);
    setFormPrice(String(product.price));
    setFormCategoryId(product.category_id);
    setFormIngredientsAr(product.ingredients_ar || '');
    setFormImageUrl(product.image_url || '');
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormPrice('50');
    setFormCategoryId(INITIAL_CATEGORIES[0].id);
    setFormIngredientsAr('');
    setFormImageUrl('');
    setIsNewProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(formPrice) || 0;

    if (editingProduct) {
      globalStore.updateProduct(editingProduct.id, {
        name_ar: formNameAr,
        name_en: formNameEn,
        price: priceVal,
        category_id: formCategoryId,
        ingredients_ar: formIngredientsAr,
        image_url: formImageUrl
      });
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        category_id: formCategoryId,
        name_ar: formNameAr,
        name_en: formNameEn || formNameAr,
        price: priceVal,
        ingredients_ar: formIngredientsAr,
        is_available: true,
        is_featured: false,
        image_url: formImageUrl
      };
      globalStore.addProduct(newProduct);
      setIsNewProductModalOpen(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذا الصنف من المنيو؟')) {
      globalStore.deleteProduct(productId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e3d9cc]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('menu_management')}</h1>
          <p className="text-xs text-stone-500 mt-1">تحديث أصناف المنيو، رفع الصور، تعديل الأسعار والتوافر</p>
        </div>

        <Button onClick={handleOpenNew} variant="secondary" className="font-bold gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          <span>إضافة صنف جديد للمنيو</span>
        </Button>
      </div>

      {/* Product List Table / Grid */}
      <Card className="bg-white border-[#e3d9cc] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-[#faf6f0]/60">
          <span className="font-bold text-sm text-stone-900">إجمالي الأصناف: {products.length} صنف</span>
        </div>

        <div className="divide-y divide-stone-200">
          {products.map((product) => {
            const cat = categories.find(c => c.id === product.category_id);
            return (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                      alt={product.name_ar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{product.name_ar} ({product.name_en})</h4>
                      <Badge variant="outline" className="text-[10px]">{cat?.name_ar}</Badge>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      السعر: <strong className="text-[#1b2e1b] font-bold">{product.price} EGP</strong>
                      {product.ingredients_ar && ` | المكونات: ${product.ingredients_ar}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleAvailability(product.id)}
                    variant={product.is_available ? 'ghost' : 'outline'}
                    size="sm"
                    className={`text-xs font-bold rounded-xl ${product.is_available ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}
                  >
                    {product.is_available ? 'متاح للطلب' : 'غير متوفر'}
                  </Button>

                  <Button
                    onClick={() => handleOpenEdit(product)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold rounded-xl gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </Button>

                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="destructive"
                    size="sm"
                    className="text-xs font-bold rounded-xl gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add / Edit Product Dialog */}
      {(editingProduct || isNewProductModalOpen) && (
        <Dialog
          isOpen={!!editingProduct || isNewProductModalOpen}
          onClose={() => {
            setEditingProduct(null);
            setIsNewProductModalOpen(false);
          }}
          title={editingProduct ? `تعديل صنف: ${editingProduct.name_ar}` : 'إضافة صنف جديد للمنيو'}
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">اسم الصنف بالعربية:</label>
              <Input
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                className="h-10 text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">اسم الصنف بالإنجليزية:</label>
              <Input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">القسم (Category):</label>
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#e3d9cc] bg-white px-3 text-xs font-bold text-stone-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">السعر (EGP):</label>
                <Input
                  type="number"
                  step="0.5"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>
            </div>

            {/* Photo Upload for Menu Item */}
            <ImageUploadInput
              label="صورة الصنف (رفع من الجهاز 📁 أو رابط خارجي):"
              value={formImageUrl}
              onChange={(newVal) => setFormImageUrl(newVal)}
            />

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">المكونات / الوصف القصيرة:</label>
              <Input
                value={formIngredientsAr}
                onChange={(e) => setFormIngredientsAr(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditingProduct(null); setIsNewProductModalOpen(false); }} className="w-1/3 rounded-xl">
                إلغاء
              </Button>
              <Button type="submit" variant="secondary" className="w-2/3 font-bold rounded-xl">
                حفظ الصنف
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
