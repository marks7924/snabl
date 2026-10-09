'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CircleDollarSign,
  Utensils,
  QrCode,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ShoppingBag
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { language, t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [orders, setOrders] = useState<Order[]>(globalStore.getOrders());
  const [bookings, setBookings] = useState(globalStore.getBookings());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setOrders(globalStore.getOrders());
      setBookings(globalStore.getBookings());
    });
  }, []);

  // Compute live dynamic metrics
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((a, b) => a + b.total, 1840.00);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e3d9cc] shadow-xs">
        <div>
          <Badge variant="gold" className="font-bold mb-1">
            {t('admin_dashboard')}
          </Badge>
          <h1 className="text-2xl font-black font-serif text-stone-900">
            مرحباً بك في لوحة تحكم إداري إل فيلا (El Villa)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            متابعة فورية ومباشرة للطلبات الواردة من المنيو أونلاين والطاولات، ورديات الكاشير، وحجوزات القاعات
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/pos">
            <Button variant="default" size="sm" className="font-bold gap-2">
              <CircleDollarSign className="w-4 h-4" />
              <span>{t('pos_terminal')}</span>
            </Button>
          </Link>
          <Link href="/admin/kitchen">
            <Button variant="secondary" size="sm" className="font-bold gap-2">
              <Utensils className="w-4 h-4" />
              <span>{t('kitchen_display')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Orders Arrival Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-[#c69214] rounded-2xl flex items-center justify-between animate-pulse text-amber-900">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#c69214]" />
            <div>
              <div className="font-black text-sm">تنبيه: يوجد {pendingOrders.length} طلبات جديدة من المنيو أونلاين / الطاولات!</div>
              <div className="text-xs text-amber-800">أحدث طلب: #{pendingOrders[0].order_number} ({pendingOrders[0].customer_name || 'عميل'}) — بقيمة {pendingOrders[0].total} EGP</div>
            </div>
          </div>
          <Link href="/admin/kitchen">
            <Button variant="secondary" size="sm" className="font-bold">
              عرض في شاشة المطبخ (KDS)
            </Button>
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue Today */}
        <Card className="luxury-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">{t('revenue_today')}</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">{totalRevenue.toFixed(2)} EGP</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مقبوضات نقدية ومبيعات مؤكدة</span>
            </div>
          </div>
        </Card>

        {/* Orders Today */}
        <Card className="luxury-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">{t('orders_today')}</span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">{orders.length} طلبات</div>
            <div className="text-[11px] text-stone-500 mt-1">
              {preparingOrders.length} قيد التحضير الان بالمطبخ
            </div>
          </div>
        </Card>

        {/* Active Table Sessions */}
        <Card className="luxury-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">{t('active_tables')}</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">3 طاولات</div>
            <div className="text-[11px] text-stone-500 mt-1">
              جلسات QR الصالة
            </div>
          </div>
        </Card>

        {/* Pending Hall Bookings */}
        <Card className="luxury-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">{t('pending_bookings')}</span>
            <div className="p-2 bg-[#c69214]/20 text-amber-900 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-stone-900">{pendingBookings.length} طلبات</div>
            <div className="text-[11px] text-amber-800 font-semibold mt-1">
              حجوزات تنتظر التأكيد
            </div>
          </div>
        </Card>
      </div>

      {/* Operational Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Cashier Shift */}
        <Card className="bg-white border-[#e3d9cc] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#1b2e1b]" />
              <h3 className="font-bold text-lg text-stone-900">{t('shift_status')}</h3>
            </div>
            <Badge variant="success">نشطة الان</Badge>
          </div>

          <div className="text-xs text-stone-700 space-y-2">
            <div>الكاشير المسؤول: <strong>أحمد محمود</strong></div>
            <div>رصيد الافتتاح: <strong>500.00 EGP</strong></div>
            <div>المقبوضات المسجلة: <strong>{totalRevenue.toFixed(2)} EGP</strong></div>
          </div>

          <div className="pt-2">
            <Link href="/admin/pos">
              <Button variant="outline" size="sm" className="w-full font-semibold gap-2">
                <span>فتح شاشة الكاشير (POS)</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-white border-[#e3d9cc] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-lg text-stone-900">{t('low_stock_alert')}</h3>
            </div>
            <Badge variant="warning">2 أصناف</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex justify-between">
              <div>
                <span className="font-bold text-stone-900">بن قهوة تركي</span>
                <span className="text-stone-500 block text-[10px]">المخزون الحالي: 1.5 kg (حد إعادة الطلب: 2.0 kg)</span>
              </div>
              <Badge variant="destructive" className="h-6">منخفض جداً</Badge>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex justify-between">
              <div>
                <span className="font-bold text-stone-900">عيش سوري</span>
                <span className="text-stone-500 block text-[10px]">المخزون الحالي: 18 قطعة (حد إعادة الطلب: 20 قطعة)</span>
              </div>
              <Badge variant="warning" className="h-6">منخفض</Badge>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm" className="w-full font-semibold gap-2">
                <span>إدارة المخزون والمشتريات</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
