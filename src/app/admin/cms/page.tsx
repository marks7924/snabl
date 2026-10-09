'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { Save, CheckCircle2, Check, Zap, Power, Image as ImageIcon, Clock } from 'lucide-react';

export default function AdminCmsPage() {
  const { t } = useLanguage();

  const currentSettings = globalStore.getSettings();

  const [venueIsOpen, setVenueIsOpen] = useState(currentSettings.venue_is_open);
  const [heroImageUrl, setHeroImageUrl] = useState(currentSettings.hero_image_url);
  const [autoApproveBookings, setAutoApproveBookings] = useState(currentSettings.auto_approve_bookings);
  const [minOrderSubtotal, setMinOrderSubtotal] = useState(String(currentSettings.minimum_order_subtotal));
  const [minConsumptionPerPerson, setMinConsumptionPerPerson] = useState(String(currentSettings.min_consumption_per_person));
  const [outsideFoodFee, setOutsideFoodFee] = useState(String(currentSettings.outside_food_fee_per_person));
  const [openingTime, setOpeningTime] = useState(currentSettings.opening_time);
  const [closingTime, setClosingTime] = useState(currentSettings.closing_time);
  const [contactPhone, setContactPhone] = useState('01228852203');

  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    globalStore.updateSettings({
      venue_is_open: venueIsOpen,
      hero_image_url: heroImageUrl,
      auto_approve_bookings: autoApproveBookings,
      minimum_order_subtotal: parseFloat(minOrderSubtotal) || 20.00,
      outside_food_fee_per_person: parseFloat(outsideFoodFee) || 15.00,
      min_consumption_per_person: parseFloat(minConsumptionPerPerson) || 0.00,
      opening_time: openingTime,
      closing_time: closingTime,
    });

    setSavedMsg('تم حفظ وتحديث حالة المنشأة وصورة الهيرو وإعدادات السياسات بنجاح!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e3d9cc]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('cms_settings')}</h1>
          <p className="text-xs text-stone-500 mt-1">إغلاق/فتح المكان، مواعيد العمل، صورة الواجهة الرئيسية، وسياسات الحجز والطلبات</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Master Switch: Emergency Venue Closure Button */}
        <Card className={`p-6 space-y-4 shadow-sm border-2 ${venueIsOpen ? 'bg-white border-emerald-300' : 'bg-red-50 border-red-400'}`}>
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-3">
              <Power className={`w-6 h-6 ${venueIsOpen ? 'text-emerald-600' : 'text-red-600'}`} />
              <div>
                <h3 className="font-bold text-base text-stone-900">حالة تشغيل المكان (Master Emergency Switch)</h3>
                <p className="text-xs text-stone-500">مفتاح إغلاق المكان وإيقاف استقبال الطلبات والحجوزات فوراً بضغطة زر</p>
              </div>
            </div>
            <Badge variant={venueIsOpen ? 'success' : 'destructive'} className="font-bold">
              {venueIsOpen ? 'المكان مفتوح ويعمل' : 'المكان مغلق حالياً'}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-stone-800">حالة استقبال الطلبات:</span>
            <button
              type="button"
              onClick={() => setVenueIsOpen(!venueIsOpen)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs text-white transition-colors flex items-center gap-2 cursor-pointer shadow-md ${
                venueIsOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{venueIsOpen ? 'إغلاق المكان مؤقتاً بضغطة زر' : 'فتح المكان واستقبال الطلبات'}</span>
            </button>
          </div>
        </Card>

        {/* Operating Hours Settings */}
        <Card className="bg-white border-[#e3d9cc] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1b2e1b]" />
              <h3 className="font-bold text-base text-stone-900">مواعيد العمل الرسمية للمكان</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">وقت الفتح اليومي:</label>
              <Input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">وقت الإغلاق اليومي:</label>
              <Input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>
          </div>
        </Card>

        {/* Hero Image URL / Upload Editor */}
        <Card className="bg-white border-[#e3d9cc] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#c69214]" />
              <h3 className="font-bold text-base text-stone-900">تغيير صورة الواجهة الرئيسية (Hero Image)</h3>
            </div>
          </div>

          <ImageUploadInput
            label="صورة الواجهة الرئيسية (رفع ملف مباشرة أو إضافة رابط):"
            value={heroImageUrl}
            onChange={(newVal) => setHeroImageUrl(newVal)}
          />
        </Card>

        {/* Hall Bookings Approval Mode */}
        <Card className="bg-white border-2 border-[#c69214]/50 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c69214]" />
              <div>
                <h3 className="font-bold text-base text-stone-900">طريقة الموافقة على حجوزات القاعات (Hall Bookings Approval)</h3>
              </div>
            </div>
            <Badge variant={autoApproveBookings ? 'gold' : 'outline'} className="font-bold">
              {autoApproveBookings ? 'تأكيد تلقائي فوراً' : 'مراجعة يدوية'}
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#faf6f0] rounded-xl border border-[#e3d9cc]">
              <div>
                <span className="font-bold text-sm text-stone-900 block">تفعيل التأكيد التلقائي للحجوزات (Auto-Approve):</span>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  عند التفعيل: سيظهر للعميل المواعيد المتاحة فقط التي لا تحتوي على حجوزات سابقة، ويتم تأكيد الحجز فوراً بدون انتظار.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoApproveBookings(!autoApproveBookings)}
                className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer ${
                  autoApproveBookings ? 'bg-[#1b2e1b] justify-end' : 'bg-stone-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-[10px]">
                  {autoApproveBookings ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : 'Off'}
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Business Policy: Minimum Order & Outside Food */}
        <Card className="bg-white border-[#e3d9cc] p-6 space-y-4">
          <h3 className="font-bold text-base text-stone-900 border-b border-stone-200 pb-3">الحد الأدنى للطلب ورسوم المأكولات الخارجية</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">الحد الأدنى للطلب (EGP):</label>
              <Input
                type="number"
                value={minOrderSubtotal}
                onChange={(e) => setMinOrderSubtotal(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">رسوم أكل خارجي/فرد (EGP):</label>
              <Input
                type="number"
                value={outsideFoodFee}
                onChange={(e) => setOutsideFoodFee(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>
          </div>
        </Card>

        <div className="pt-2">
          <Button type="submit" variant="secondary" size="lg" className="w-full font-bold gap-2 rounded-xl">
            <Save className="w-5 h-5" />
            <span>حفظ جميع التغييرات والإعدادات</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
