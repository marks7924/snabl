'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Ingredient } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, CheckCircle2, ShoppingCart, AlertCircle, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const { language, t } = useLanguage();

  const [ingredients, setIngredients] = useState<Ingredient[]>(globalStore.getIngredients());

  // Modal States
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  // Form State for Add/Edit
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formUnit, setFormUnit] = useState<Ingredient['unit']>('kg');
  const [formCurrentStock, setFormCurrentStock] = useState('10');
  const [formReorderThreshold, setFormReorderThreshold] = useState('3');
  const [formCostPerUnit, setFormCostPerUnit] = useState('50');

  // Waste Form State
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [wasteQuantity, setWasteQuantity] = useState('1');
  const [wasteReason, setWasteReason] = useState('تلف أثناء الإعداد / Expiry');

  // Restock Form State
  const [restockQuantity, setRestockQuantity] = useState('5');
  const [restockCost, setRestockCost] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    return globalStore.subscribe(() => {
      setIngredients(globalStore.getIngredients());
    });
  }, []);

  const handleOpenAddModal = () => {
    setEditingIngredient(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormUnit('kg');
    setFormCurrentStock('10');
    setFormReorderThreshold('3');
    setFormCostPerUnit('50');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (ing: Ingredient) => {
    setEditingIngredient(ing);
    setFormNameAr(ing.name_ar);
    setFormNameEn(ing.name_en);
    setFormUnit(ing.unit);
    setFormCurrentStock(String(ing.current_stock));
    setFormReorderThreshold(String(ing.reorder_threshold));
    setFormCostPerUnit(String(ing.cost_per_unit));
  };

  const handleSaveIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const stockVal = parseFloat(formCurrentStock) || 0;
    const thresholdVal = parseFloat(formReorderThreshold) || 0;
    const costVal = parseFloat(formCostPerUnit) || 0;

    if (editingIngredient) {
      globalStore.updateIngredient(editingIngredient.id, {
        name_ar: formNameAr,
        name_en: formNameEn || formNameAr,
        unit: formUnit,
        current_stock: stockVal,
        reorder_threshold: thresholdVal,
        cost_per_unit: costVal,
      });
      setEditingIngredient(null);
    } else {
      const newIng: Ingredient = {
        id: `ing-${Date.now()}`,
        name_ar: formNameAr,
        name_en: formNameEn || formNameAr,
        unit: formUnit,
        current_stock: stockVal,
        reorder_threshold: thresholdVal,
        cost_per_unit: costVal,
        is_active: true,
      };
      globalStore.addIngredient(newIng);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteIngredient = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت تأكد من رغبتك في حذف هذا العنصر من المخزون؟' : 'Are you sure you want to delete this item?')) {
      globalStore.deleteIngredient(id);
    }
  };

  // Restock handler
  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    const ing = ingredients.find(i => i.id === selectedIngredientId);
    if (!ing) return;

    const qty = parseFloat(restockQuantity) || 0;
    if (qty <= 0) return;

    const newStock = ing.current_stock + qty;
    const updates: Partial<Ingredient> = { current_stock: newStock };
    if (restockCost && parseFloat(restockCost) > 0) {
      updates.cost_per_unit = parseFloat(restockCost);
    }

    globalStore.updateIngredient(ing.id, updates);

    setSuccessMsg(language === 'ar' ? 'تم إضافة الشحنة والمشتريات وتحديث رصيد المخزون بنجاح!' : 'Stock restocked successfully!');
    setTimeout(() => {
      setIsRestockModalOpen(false);
      setSuccessMsg('');
    }, 1500);
  };

  // Waste Log handler
  const handleRecordWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const ing = ingredients.find(i => i.id === selectedIngredientId);
    if (!ing) return;

    const qty = parseFloat(wasteQuantity) || 0;
    if (qty <= 0) return;

    const newStock = Math.max(0, ing.current_stock - qty);
    globalStore.updateIngredient(ing.id, { current_stock: newStock });

    setSuccessMsg(language === 'ar' ? 'تم تسجيل التالف وخصمه من رصيد المخزون بنجاح!' : 'Waste recorded successfully!');
    setTimeout(() => {
      setIsWasteModalOpen(false);
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e3d9cc]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('inventory_management')}</h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'ar' 
              ? 'متابعة وإدارة المكونات والمشتريات، إضافة وحذف وتعديل عناصر المخزون وتسجيل التالف'
              : 'Track & manage ingredients, inventory items, purchases, waste logs, and reorder levels'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleOpenAddModal} variant="secondary" size="sm" className="font-bold gap-1.5 rounded-xl cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item'}</span>
          </Button>

          <Button
            onClick={() => {
              if (ingredients.length > 0) setSelectedIngredientId(ingredients[0].id);
              setIsRestockModalOpen(true);
            }}
            variant="default"
            size="sm"
            className="font-bold gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل مشتريات وتوريد' : 'Record Purchase'}</span>
          </Button>

          <Button
            onClick={() => {
              if (ingredients.length > 0) setSelectedIngredientId(ingredients[0].id);
              setIsWasteModalOpen(true);
            }}
            variant="destructive"
            size="sm"
            className="font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل تالف' : 'Log Waste'}</span>
          </Button>
        </div>
      </div>

      {/* Ingredients Table Card */}
      <Card className="bg-white border-[#e3d9cc] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-[#faf6f0]/60">
          <span className="font-bold text-sm text-stone-900">
            {language === 'ar' ? `إجمالي المكونات بالمخزن: ${ingredients.length} عنصر` : `Total Stock Items: ${ingredients.length}`}
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {ingredients.map((ing) => {
            const isLowStock = ing.current_stock <= ing.reorder_threshold;

            return (
              <div key={ing.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-stone-900">
                      {language === 'ar' ? ing.name_ar : ing.name_en}
                    </h4>
                    <span className="text-xs text-stone-400">({ing.name_en})</span>
                    {isLowStock && (
                      <Badge variant="warning" className="font-bold text-[10px] gap-1 bg-amber-100 text-amber-900 border-amber-300">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{language === 'ar' ? 'منخفض المخزون' : 'Low Stock'}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 flex flex-wrap gap-4 pt-0.5">
                    <span>
                      {language === 'ar' ? 'حد التنبيه:' : 'Reorder level:'} <strong>{ing.reorder_threshold} {ing.unit}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {language === 'ar' ? 'سعر التكلفة للوحدة:' : 'Unit Cost:'} <strong>{ing.cost_per_unit} EGP</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <div className="text-lg font-black text-[#1b2e1b]">
                      {ing.current_stock} {ing.unit}
                    </div>
                    <div className="text-[10px] text-stone-400 font-semibold">
                      {language === 'ar' ? 'الرصيد المتاح' : 'Current Stock'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleOpenEditModal(ing)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold rounded-xl gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </Button>

                    <Button
                      onClick={() => handleDeleteIngredient(ing.id)}
                      variant="destructive"
                      size="sm"
                      className="text-xs font-bold rounded-xl gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'حذف' : 'Delete'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add / Edit Ingredient Modal */}
      {(editingIngredient || isAddModalOpen) && (
        <Dialog
          isOpen={!!editingIngredient || isAddModalOpen}
          onClose={() => {
            setEditingIngredient(null);
            setIsAddModalOpen(false);
          }}
          title={editingIngredient ? (language === 'ar' ? `تعديل عنصر: ${editingIngredient.name_ar}` : `Edit Item: ${editingIngredient.name_en}`) : (language === 'ar' ? 'إضافة عنصر مخزون جديد' : 'Add New Inventory Item')}
        >
          <form onSubmit={handleSaveIngredient} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">{language === 'ar' ? 'الاسم بالعربية:' : 'Arabic Name:'}</label>
              <Input
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                className="h-10 text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">{language === 'ar' ? 'الاسم بالإنجليزية:' : 'English Name:'}</label>
              <Input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="h-10 text-xs font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'وحدة القياس:' : 'Measurement Unit:'}</label>
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value as Ingredient['unit'])}
                  className="w-full h-10 rounded-lg border border-[#e3d9cc] bg-white px-3 text-xs font-bold text-stone-900"
                >
                  <option value="kg">كيلوجرام (kg)</option>
                  <option value="g">جرام (g)</option>
                  <option value="l">لتر (l)</option>
                  <option value="ml">مليلتر (ml)</option>
                  <option value="pcs">قطعة (pcs)</option>
                  <option value="pack">عبوة (pack)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'الرصيد الحالي:' : 'Current Stock:'}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formCurrentStock}
                  onChange={(e) => setFormCurrentStock(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'حد التنبيه للطلب:' : 'Reorder Threshold:'}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formReorderThreshold}
                  onChange={(e) => setFormReorderThreshold(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'تكلفة الوحدة (EGP):' : 'Unit Cost (EGP):'}</label>
                <Input
                  type="number"
                  step="0.5"
                  value={formCostPerUnit}
                  onChange={(e) => setFormCostPerUnit(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditingIngredient(null); setIsAddModalOpen(false); }} className="w-1/3 rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" variant="secondary" className="w-2/3 font-bold rounded-xl">
                {language === 'ar' ? 'حفظ العنصر' : 'Save Item'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Purchase / Restock Dialog */}
      {isRestockModalOpen && (
        <Dialog
          isOpen={isRestockModalOpen}
          onClose={() => setIsRestockModalOpen(false)}
          title={language === 'ar' ? 'تسجيل توريد ومشتريات جديدة' : 'Record New Purchase / Stock Receipt'}
        >
          {successMsg ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="font-bold text-base text-stone-900">{successMsg}</div>
            </div>
          ) : (
            <form onSubmit={handleRestock} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'اختر المكون:' : 'Select Ingredient:'}</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#e3d9cc] bg-white px-3 text-xs font-bold text-stone-900"
                >
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {language === 'ar' ? ing.name_ar : ing.name_en} ({ing.current_stock} {ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'الكمية المشترات الإضافية:' : 'Purchased Quantity:'}</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'سعر التكلفة الجديد للوحدة (اختياري EGP):' : 'New Unit Cost (Optional):'}</label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="أدخل تكلفة الشراء للوحدة..."
                  value={restockCost}
                  onChange={(e) => setRestockCost(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsRestockModalOpen(false)} className="w-1/3 rounded-xl">
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="default" className="w-2/3 font-bold rounded-xl bg-emerald-800 hover:bg-emerald-900">
                  {language === 'ar' ? 'تأكيد التوريد وإضافة الرصيد' : 'Confirm Purchase'}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      )}

      {/* Waste Log Dialog */}
      {isWasteModalOpen && (
        <Dialog
          isOpen={isWasteModalOpen}
          onClose={() => setIsWasteModalOpen(false)}
          title={language === 'ar' ? 'تسجيل هالك / تالف من المخزون' : 'Record Inventory Waste'}
        >
          {successMsg ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="font-bold text-base text-stone-900">{successMsg}</div>
            </div>
          ) : (
            <form onSubmit={handleRecordWaste} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'اختر المكون التالف:' : 'Select Waste Item:'}</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#e3d9cc] bg-white px-3 text-xs font-bold text-stone-900"
                >
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {language === 'ar' ? ing.name_ar : ing.name_en} ({ing.current_stock} {ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'الكمية التالفة:' : 'Waste Quantity:'}</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={wasteQuantity}
                  onChange={(e) => setWasteQuantity(e.target.value)}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">{language === 'ar' ? 'سبب التلف:' : 'Reason for Waste:'}</label>
                <Input
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsWasteModalOpen(false)} className="w-1/3 rounded-xl">
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="destructive" className="w-2/3 font-bold rounded-xl">
                  {language === 'ar' ? 'تأكيد وخصم التالف' : 'Confirm Waste Log'}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      )}
    </div>
  );
}
