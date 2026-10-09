'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Hall, Booking } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Calendar, Users, CheckCircle2, Clock, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

const TIME_SLOTS = [
  { id: 's1', label: '10:00 صباحاً', start: '10:00', end: '14:00' },
  { id: 's2', label: '02:00 ظهراً', start: '14:00', end: '18:00' },
  { id: 's3', label: '06:00 مساءً', start: '18:00', end: '22:00' },
  { id: 's4', label: '10:00 مساءً', start: '22:00', end: '02:00' },
];

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 8];

export default function HallsPage() {
  const { language, t } = useLanguage();

  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  // Settings & Store State
  const [storeSettings, setStoreSettings] = useState(globalStore.getSettings());
  const [existingBookings, setExistingBookings] = useState<Booking[]>(globalStore.getBookings());
  const [hallsList, setHallsList] = useState<Hall[]>(globalStore.getHalls());

  // Form State
  const [bookingType, setBookingType] = useState<'hourly' | 'full_day'>('hourly');
  const [durationHours, setDurationHours] = useState(3);
  const [eventType, setEventType] = useState('Birthday Party');
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [guestCount, setGuestCount] = useState('50');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingNum, setConfirmedBookingNum] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    return globalStore.subscribe(() => {
      setStoreSettings(globalStore.getSettings());
      setExistingBookings(globalStore.getBookings());
      setHallsList(globalStore.getHalls());
    });
  }, []);

  const handleOpenBooking = (hall: Hall) => {
    setSelectedHall(hall);
    setIsSuccess(false);
    setErrorMsg('');
  };

  const isSlotBooked = (hallId: string, date: string, slotStart: string) => {
    return existingBookings.some(b =>
      b.hall_id === hallId &&
      b.booking_date === date &&
      (b.status === 'confirmed' || b.status === 'pending') &&
      b.start_time === slotStart
    );
  };

  // Price Calculation Logic
  const getCalculatedPrice = (hall: Hall) => {
    const hourlyRate = hall.price_per_hour || Math.round(hall.base_price / 5);
    const fullDayRate = hall.full_day_price || hall.base_price;

    if (bookingType === 'full_day') {
      return fullDayRate;
    }
    return durationHours * hourlyRate;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHall) return;

    if (!contactName.trim() || !contactPhone.trim() || !bookingDate) {
      setErrorMsg('يرجى استكمال جميع البيانات الأساسية (الاسم، رقم الهاتف، والتاريخ)');
      return;
    }

    if (parseInt(guestCount) > selectedHall.capacity) {
      setErrorMsg(`عدد الضيوف المتوقع يتجاوز سعة القاعة القصوى (${selectedHall.capacity} فرد)`);
      return;
    }

    if (bookingType === 'hourly' && isSlotBooked(selectedHall.id, bookingDate, selectedSlot.start)) {
      setErrorMsg('هذا الموعد تم حجزه بالفعل لقاعة أخرى في نفس اليوم. اختر موعداً آخر.');
      return;
    }

    const isAutoApprove = storeSettings.auto_approve_bookings;
    const newBookingNumber = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalPrice = getCalculatedPrice(selectedHall);

    const newBookingRecord: Booking = {
      id: `b-${Date.now()}`,
      booking_number: newBookingNumber,
      hall_id: selectedHall.id,
      event_type: eventType,
      booking_type: bookingType,
      duration_hours: bookingType === 'hourly' ? durationHours : 12,
      booking_date: bookingDate,
      start_time: bookingType === 'full_day' ? '10:00' : selectedSlot.start,
      end_time: bookingType === 'full_day' ? '24:00' : selectedSlot.end,
      guest_count: parseInt(guestCount) || 50,
      contact_name: contactName,
      contact_phone: contactPhone,
      notes,
      status: isAutoApprove ? 'confirmed' : 'pending',
      total_price: finalPrice,
      deposit_amount: Math.min(500, finalPrice * 0.3),
      deposit_status: isAutoApprove ? 'paid' : 'unpaid',
      created_at: new Date().toISOString(),
      hall: selectedHall
    };

    globalStore.addBooking(newBookingRecord);

    setConfirmedBookingNum(newBookingNumber);
    setIsSuccess(true);
    setErrorMsg('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black font-serif text-stone-900">
          قاعات المناسبات والاحتفالات الخاصة
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed text-sm">
          احجز القاعة بالساعة أو اليوم بالكامل لاحتفالك (أعياد ميلاد، احتفالات عائلية، اجتماعات)، وتصفح المواعيد المتاحة مباشرة.
        </p>

        {storeSettings.auto_approve_bookings && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>نظام التأكيد الفوري المباشر للحجوزات مفعّل (Auto-Approve Active)</span>
          </div>
        )}
      </div>

      {/* Halls Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {hallsList.map((hall) => {
          const hourlyRate = hall.price_per_hour || Math.round(hall.base_price / 5);
          const fullDayRate = hall.full_day_price || hall.base_price;

          return (
            <Card key={hall.id} className="luxury-card overflow-hidden flex flex-col justify-between">
              <div>
                {/* Hall Image */}
                <div className="relative h-64 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={hall.images[0]}
                    alt={language === 'ar' ? hall.name_ar : hall.name_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 ltr:right-4 rtl:left-4 flex flex-col gap-1 items-end">
                    <Badge variant="gold" className="font-black text-xs shadow-md">
                      {hourlyRate} ج.م / ساعة ⏱️
                    </Badge>
                    <Badge variant="secondary" className="font-bold text-xs bg-stone-900/90 text-amber-300 border border-amber-400/40">
                      {fullDayRate} ج.م / اليوم بالكامل ☀️
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 ltr:left-4 rtl:right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-white/20">
                    <Users className="w-4 h-4 text-[#c69214]" />
                    <span>{t('hall_capacity', { count: hall.capacity })}</span>
                  </div>
                </div>

                {/* Hall Content */}
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-stone-900">
                      {language === 'ar' ? hall.name_ar : hall.name_en}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      {language === 'ar' ? hall.description_ar : hall.description_en}
                    </p>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">التجهيزات والخدمات المتاحة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {hall.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs font-normal">
                          ✓ {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* CTA Button */}
              <div className="p-6 pt-0">
                <Button
                  onClick={() => handleOpenBooking(hall)}
                  variant="default"
                  className="w-full font-bold py-6 text-base rounded-xl gap-2 shadow-sm cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t('book_now')}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Booking Form Modal */}
      {selectedHall && (
        <Dialog
          isOpen={!!selectedHall}
          onClose={() => setSelectedHall(null)}
          title={t('booking_form_title')}
          description={`القاعة المختارة: ${language === 'ar' ? selectedHall.name_ar : selectedHall.name_en}`}
        >
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                {storeSettings.auto_approve_bookings ? 'تم تأكيد حجزك فوراً بنجاح! 🎉' : 'تم تقديم طلب الحجز بنجاح!'}
              </h3>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                رقم الحجز الخاص بك: <strong className="text-[#1b2e1b] font-black">{confirmedBookingNum}</strong>
                <br />
                {storeSettings.auto_approve_bookings
                  ? 'تم تأكيد الموعد والقاعة في النظام وإبلاغ إدارة إل فيلا.'
                  : 'سيقوم مسؤول الحجوزات بمراجعة الموعد والتواصل معكم عبر الهاتف للتأكيد.'}
              </p>
              <div className="pt-2">
                <Button onClick={() => setSelectedHall(null)} variant="default" className="w-full rounded-xl">
                  موافق
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Booking Type Switcher: Hourly vs Full Day */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">نوع ونظام الحجز:</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#faf6f0] rounded-xl border border-[#e3d9cc]">
                  <button
                    type="button"
                    onClick={() => setBookingType('hourly')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                      bookingType === 'hourly'
                        ? 'bg-[#1b2e1b] text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    ⏱️ حجز بالساعات
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('full_day')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                      bookingType === 'full_day'
                        ? 'bg-[#1b2e1b] text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    ☀️ حجز اليوم بالكامل
                  </button>
                </div>
              </div>

              {/* Hourly Selection Details */}
              {bookingType === 'hourly' && (
                <div className="space-y-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-900 block">اختر عدد الساعات المطلوبة:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DURATION_OPTIONS.map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setDurationHours(hrs)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            durationHours === hrs
                              ? 'bg-[#c69214] text-stone-950 border-[#c69214] shadow-xs'
                              : 'bg-white text-stone-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {hrs} {hrs === 1 ? 'ساعة' : hrs === 2 ? 'ساعتان' : 'ساعات'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('event_type')}</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#e3d9cc] bg-white px-3 text-xs font-medium text-stone-900"
                  >
                    <option value="Birthday Party">عيد ميلاد</option>
                    <option value="Private Celebration">احتفال خاص / عائلي</option>
                    <option value="Corporate Meeting">اجتماع / عمل</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('guest_count')}</label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedHall.capacity}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="h-10 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{t('booking_date')}</label>
                <Input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="h-10 text-xs font-bold"
                />
              </div>

              {/* Time Slots Selector (Only if hourly) */}
              {bookingType === 'hourly' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    وقت بدء الحجز ليوم ({bookingDate}):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const booked = isSlotBooked(selectedHall.id, bookingDate, slot.start);
                      const isSelected = selectedSlot.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={booked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                            booked
                              ? 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#1b2e1b] text-white border-[#1b2e1b] shadow-xs'
                              : 'bg-white text-stone-800 border-[#e3d9cc] hover:bg-[#faf6f0]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#c69214]" />
                            <span>{slot.label}</span>
                          </div>
                          {booked && <Badge variant="destructive" className="text-[9px]">محجوز</Badge>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('contact_name')} *</label>
                  <Input
                    type="text"
                    placeholder="الاسم بالكامل"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('contact_phone')} *</label>
                  <Input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{t('special_requests')}</label>
                <textarea
                  rows={2}
                  placeholder="أي تجهيزات أو طلبات خاصة تود إضافتها..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-[#e3d9cc] bg-white p-2.5 text-xs text-stone-900"
                />
              </div>

              {/* Total Price Calculation Summary Card */}
              <div className="p-3.5 bg-[#1b2e1b] text-white rounded-xl text-xs space-y-1.5 border border-stone-800 shadow-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-bold">حساب إجمالي السعر المحسوب:</span>
                  <span className="text-amber-300 text-base font-black">
                    {getCalculatedPrice(selectedHall)} ج.م
                  </span>
                </div>
                <div className="text-[11px] text-stone-300">
                  {bookingType === 'hourly' ? (
                    <span>
                      سعر الساعة: ({selectedHall.price_per_hour || Math.round(selectedHall.base_price / 5)} ج.م) × {durationHours} ساعات = {getCalculatedPrice(selectedHall)} ج.م
                    </span>
                  ) : (
                    <span>سعر حجز اليوم بالكامل = {getCalculatedPrice(selectedHall)} ج.م</span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setSelectedHall(null)} className="w-1/3 rounded-xl">
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="secondary" className="w-2/3 font-bold rounded-xl">
                  تأكيد إرسال الحجز
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      )}
    </div>
  );
}
