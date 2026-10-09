'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, CircleDollarSign, Calendar, Download, Printer } from 'lucide-react';

export default function AdminReportsPage() {
  const { t } = useLanguage();

  const reportData = {
    totalSales: 1840.00,
    ordersCount: 14,
    sandwichesSales: 850.00,
    drinksSales: 540.00,
    pastasSales: 450.00,
    cashCollected: 1840.00,
    hallBookingsConfirmed: 2,
    hallBookingsRevenue: 5300.00
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e4ded4]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('reports_analytics')}</h1>
          <p className="text-xs text-stone-500 mt-1">تقرير المبيعات اليومية، المقبوضات النقدية، وإيرادات القاعات</p>
        </div>

        <Button onClick={() => window.print()} variant="outline" size="sm" className="font-bold gap-2 rounded-xl">
          <Printer className="w-4 h-4" />
          <span>طباعة التقرير</span>
        </Button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-white border-[#e4ded4] p-5">
          <div className="text-xs font-bold text-stone-500 uppercase">إجمالي إيرادات المبيعات اليوم</div>
          <div className="text-3xl font-black text-[#2d3b2d] mt-2">{reportData.totalSales} EGP</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">من {reportData.ordersCount} طلبات مؤكدة</div>
        </Card>

        <Card className="bg-white border-[#e4ded4] p-5">
          <div className="text-xs font-bold text-stone-500 uppercase">المقبوضات النقدية (Cash Collected)</div>
          <div className="text-3xl font-black text-stone-900 mt-2">{reportData.cashCollected} EGP</div>
          <div className="text-xs text-stone-500 mt-1">مطابقة لورديات الكاشير</div>
        </Card>

        <Card className="bg-white border-[#e4ded4] p-5">
          <div className="text-xs font-bold text-stone-500 uppercase">إيرادات حجز القاعات</div>
          <div className="text-3xl font-black text-[#d4af37] mt-2">{reportData.hallBookingsRevenue} EGP</div>
          <div className="text-xs text-stone-500 mt-1">عن {reportData.hallBookingsConfirmed} حجوزات مؤكدة</div>
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card className="bg-white border-[#e4ded4] p-6 space-y-4">
        <h3 className="font-bold text-lg text-stone-900">توزيع المبيعات حسب التصنيف:</h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
            <span className="font-bold text-stone-800">الساندوتشات والوجبات (Sandwiches)</span>
            <span className="font-black text-[#2d3b2d]">{reportData.sandwichesSales} EGP</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
            <span className="font-bold text-stone-800">المشروبات الساخنة والباردة (Drinks)</span>
            <span className="font-black text-[#2d3b2d]">{reportData.drinksSales} EGP</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
            <span className="font-bold text-stone-800">الباستا (Pastas)</span>
            <span className="font-black text-[#2d3b2d]">{reportData.pastasSales} EGP</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
