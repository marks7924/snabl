'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Booking, Hall } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Users, Phone, Plus, Edit, Trash2, Power, Image as ImageIcon } from 'lucide-react';

export default function AdminBookingsPage() {
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'bookings' | 'halls'>('bookings');

  // Reactive store state
  const [bookings, setBookings] = useState<Booking[]>(globalStore.getBookings());
  const [halls, setHalls] = useState<Hall[]>(globalStore.getHalls());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setBookings(globalStore.getBookings());
      setHalls(globalStore.getHalls());
    });
  }, []);

  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  // Hall CRUD Modal State
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [isNewHallModalOpen, setIsNewHallModalOpen] = useState(false);

  // Form State for Hall Add/Edit
  const [formHallNameAr, setFormHallNameAr] = useState('');
  const [formHallNameEn, setFormHallNameEn] = useState('');
  const [formHallCapacity, setFormHallCapacity] = useState('100');
  const [formHallPricePerHour, setFormHallPricePerHour] = useState('500');
  const [formHallFullDayPrice, setFormHallFullDayPrice] = useState('2500');
  const [formHallImage, setFormHallImage] = useState('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80');
  const [formHallDescAr, setFormHallDescAr] = useState('');

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    globalStore.updateBookingStatus(bookingId, newStatus);
    setSelectedBookingDetails(null);
  };

  const handleOpenEditHall = (hall: Hall) => {
    setEditingHall(hall);
    setFormHallNameAr(hall.name_ar);
    setFormHallNameEn(hall.name_en);
    setFormHallCapacity(String(hall.capacity));
    setFormHallPricePerHour(String(hall.price_per_hour || Math.round(hall.base_price / 5)));
    setFormHallFullDayPrice(String(hall.full_day_price || hall.base_price));
    setFormHallImage(hall.images[0] || '');
    setFormHallDescAr(hall.description_ar);
  };

  const handleSaveHall = (e: React.FormEvent) => {
    e.preventDefault();
    const pPerHour = parseFloat(formHallPricePerHour) || 500;
    const pFullDay = parseFloat(formHallFullDayPrice) || 2500;

    if (editingHall) {
      globalStore.updateHall(editingHall.id, {
        name_ar: formHallNameAr,
        name_en: formHallNameEn,
        capacity: parseInt(formHallCapacity) || editingHall.capacity,
        base_price: pFullDay,
        price_per_hour: pPerHour,
        full_day_price: pFullDay,
        images: [formHallImage],
        description_ar: formHallDescAr
      });
      setEditingHall(null);
    } else {
      const newHall: Hall = {
        id: `h-${Date.now()}`,
        name_ar: formHallNameAr,
        name_en: formHallNameEn,
        slug: `hall-${Date.now()}`,
        description_ar: formHallDescAr || 'قاعة مناسبات مجهزة',
        description_en: 'Event hall',
        capacity: parseInt(formHallCapacity) || 50,
        base_price: pFullDay,
        price_per_hour: pPerHour,
        full_day_price: pFullDay,
        amenities: ['نظام صوتي', 'تكييف مركزي'],
        images: [formHallImage],
        is_active: true
      };
      globalStore.addHall(newHall);
      setIsNewHallModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e3d9cc]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('hall_management')}</h1>
          <p className="text-xs text-stone-500 mt-1">إضافة قاعات، تعديل الصور والأسعار، وتأكيد طلبات الحجوزات</p>
        </div>

        <div className="flex gap-2 bg-[#faf6f0] p-1.5 rounded-full border border-[#e3d9cc]">
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('bookings')}
            className="rounded-full text-xs font-bold"
          >
            طلبات الحجز ({bookings.length})
          </Button>
          <Button
            variant={activeTab === 'halls' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('halls')}
            className="rounded-full text-xs font-bold"
          >
            إدارة القاعات ({halls.length})
          </Button>
        </div>
      </div>

      {/* TAB 1: BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <Card className="bg-white border-[#e3d9cc] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-[#faf6f0]/60">
            <span className="font-bold text-sm text-stone-900">سجل طلبات حجوزات القاعات:</span>
          </div>

          <div className="divide-y divide-stone-200">
            {bookings.map((booking) => {
              const hallName = booking.hall ? (language === 'ar' ? booking.hall.name_ar : booking.hall.name_en) : 'قاعة إل فيلا';

              return (
                <div key={booking.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-base">{booking.booking_number}</span>
                      <Badge variant="outline">{hallName}</Badge>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'pending'
                            ? 'warning'
                            : booking.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="font-bold text-xs"
                      >
                        {booking.status === 'pending' && 'معلق (انتظار الموافقة)'}
                        {booking.status === 'confirmed' && 'مؤكد'}
                        {booking.status === 'rejected' && 'مرفوض'}
                      </Badge>
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap gap-4 pt-1">
                      <span>العميل: <strong>{booking.contact_name}</strong> ({booking.contact_phone})</span>
                      <span>التاريخ: <strong>{booking.booking_date}</strong> ({booking.start_time} - {booking.end_time})</span>
                      <span>عدد الضيوف: <strong>{booking.guest_count}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                          variant="default"
                          size="sm"
                          className="text-xs font-bold gap-1 rounded-xl bg-emerald-700 hover:bg-emerald-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>موافقة وتأكيد</span>
                        </Button>
                        <Button
                          onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                          variant="destructive"
                          size="sm"
                          className="text-xs font-bold gap-1 rounded-xl"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => setSelectedBookingDetails(booking)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold rounded-xl"
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* TAB 2: HALLS CRUD MANAGEMENT */}
      {activeTab === 'halls' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingHall(null);
                setFormHallNameAr('');
                setFormHallNameEn('');
                setFormHallCapacity('80');
                setFormHallPricePerHour('400');
                setFormHallFullDayPrice('2000');
                setFormHallImage('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80');
                setFormHallDescAr('');
                setIsNewHallModalOpen(true);
              }}
              variant="secondary"
              className="font-bold gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قاعة جديدة</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {halls.map((hall) => (
              <Card key={hall.id} className="bg-white border-[#e3d9cc] overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100">
                    <img src={hall.images[0]} alt={hall.name_ar} className="w-full h-full object-cover" />
                    <div className="absolute top-3 ltr:right-3 rtl:left-3">
                      <Badge variant={hall.is_active ? 'success' : 'destructive'} className="font-bold">
                        {hall.is_active ? 'نشطة ومتاحة للحجز' : 'موقوفة مؤقتاً'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-stone-900">{hall.name_ar} ({hall.name_en})</h3>
                    <p className="text-xs text-stone-500 mt-1">{hall.description_ar}</p>
                    <div className="text-xs font-bold text-[#1b2e1b] mt-2 flex flex-wrap justify-between gap-1">
                      <span>ساعة: {hall.price_per_hour || Math.round(hall.base_price / 5)} ج.م | اليوم بالكامل: {hall.full_day_price || hall.base_price} ج.م</span>
                      <span>السعة: حتى {hall.capacity} فرد</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200">
                  <Button
                    onClick={() => globalStore.toggleHallActive(hall.id)}
                    variant={hall.is_active ? 'outline' : 'default'}
                    size="sm"
                    className="text-xs font-bold rounded-xl gap-1"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{hall.is_active ? 'إيقاف مؤقت' : 'تفعيل القاعة'}</span>
                  </Button>

                  <Button
                    onClick={() => handleOpenEditHall(hall)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold rounded-xl gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </Button>

                  <Button
                    onClick={() => globalStore.deleteHall(hall.id)}
                    variant="destructive"
                    size="sm"
                    className="text-xs font-bold rounded-xl gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hall Add/Edit Modal */}
      {(editingHall || isNewHallModalOpen) && (
        <Dialog
          isOpen={!!editingHall || isNewHallModalOpen}
          onClose={() => {
            setEditingHall(null);
            setIsNewHallModalOpen(false);
          }}
          title={editingHall ? `تعديل القاعة: ${editingHall.name_ar}` : 'إضافة قاعة جديدة'}
        >
          <form onSubmit={handleSaveHall} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">اسم القاعة بالعربية:</label>
              <Input
                value={formHallNameAr}
                onChange={(e) => setFormHallNameAr(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">اسم القاعة بالإنجليزية:</label>
              <Input
                value={formHallNameEn}
                onChange={(e) => setFormHallNameEn(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">السعة (أفراد):</label>
                <Input
                  type="number"
                  value={formHallCapacity}
                  onChange={(e) => setFormHallCapacity(e.target.value)}
                  className="h-10 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">سعر الساعة (ج.م):</label>
                <Input
                  type="number"
                  value={formHallPricePerHour}
                  onChange={(e) => setFormHallPricePerHour(e.target.value)}
                  className="h-10 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">سعر اليوم بالكامل (ج.م):</label>
                <Input
                  type="number"
                  value={formHallFullDayPrice}
                  onChange={(e) => setFormHallFullDayPrice(e.target.value)}
                  className="h-10 text-xs font-bold"
                />
              </div>
            </div>

            <ImageUploadInput
              label="صورة القاعة (رفع من الجهاز 📁 أو رابط خارجي):"
              value={formHallImage}
              onChange={(newVal) => setFormHallImage(newVal)}
            />

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">وصف القاعة:</label>
              <Input
                value={formHallDescAr}
                onChange={(e) => setFormHallDescAr(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditingHall(null); setIsNewHallModalOpen(false); }} className="w-1/3 rounded-xl">
                إلغاء
              </Button>
              <Button type="submit" variant="secondary" className="w-2/3 font-bold rounded-xl">
                حفظ القاعة
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <Dialog
          isOpen={!!selectedBookingDetails}
          onClose={() => setSelectedBookingDetails(null)}
          title={`تفاصيل الحجز ${selectedBookingDetails.booking_number}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#faf6f0] rounded-xl space-y-1.5 border border-[#e3d9cc]">
              <div className="font-bold text-stone-900 text-sm">بيانات العميل والمناسبة:</div>
              <div>الاسم: <strong>{selectedBookingDetails.contact_name}</strong></div>
              <div>الهاتف: <a href={`tel:${selectedBookingDetails.contact_phone}`} className="text-blue-700 underline font-bold">{selectedBookingDetails.contact_phone}</a></div>
              <div>نوع المناسبة: <strong>{selectedBookingDetails.event_type}</strong></div>
              <div>عدد الضيوف المتوقع: <strong>{selectedBookingDetails.guest_count} فرد</strong></div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200">
              <div className="font-bold text-stone-900 text-sm">الموعد والقاعة:</div>
              <div>القاعة: <strong>{selectedBookingDetails.hall?.name_ar}</strong></div>
              <div>التاريخ: <strong>{selectedBookingDetails.booking_date}</strong></div>
              <div>التوقيت: <strong>من {selectedBookingDetails.start_time} إلى {selectedBookingDetails.end_time}</strong></div>
              <div>الإجمالي: <strong>{selectedBookingDetails.total_price} EGP</strong></div>
            </div>

            {selectedBookingDetails.notes && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl">
                📝 ملاحظات خاصة: {selectedBookingDetails.notes}
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <Button variant="outline" onClick={() => setSelectedBookingDetails(null)} className="w-full rounded-xl">
                إغلاق
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
