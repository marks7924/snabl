'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { INITIAL_TABLES } from '@/lib/supabase/mock-data';
import { DiningTable, TableSession } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { QrCode, Users, Play, Power, ExternalLink, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminTablesPage() {
  const { t } = useLanguage();

  const [tables, setTables] = useState<DiningTable[]>(INITIAL_TABLES);
  const [sessions, setSessions] = useState<Record<number, {
    guestCount: number;
    tokenHash: string;
    startedAt: string;
    totalOrdersAmount: number;
  }>>({
    1: { guestCount: 4, tokenHash: 'tok_table_1_active', startedAt: '18:30', totalOrdersAmount: 210.00 },
    3: { guestCount: 6, tokenHash: 'tok_table_3_active', startedAt: '19:15', totalOrdersAmount: 450.00 }
  });

  const [selectedQrTable, setSelectedQrTable] = useState<DiningTable | null>(null);
  const [openSessionModalTable, setOpenSessionModalTable] = useState<DiningTable | null>(null);
  const [guestCountInput, setGuestCountInput] = useState('4');

  const handleStartSession = (tableNumber: number) => {
    setSessions({
      ...sessions,
      [tableNumber]: {
        guestCount: parseInt(guestCountInput) || 4,
        tokenHash: `tok_table_${tableNumber}_${Date.now()}`,
        startedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        totalOrdersAmount: 0.00
      }
    });
    setOpenSessionModalTable(null);
  };

  const handleCloseSession = (tableNumber: number) => {
    const updated = { ...sessions };
    delete updated[tableNumber];
    setSessions(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e4ded4]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('table_management')}</h1>
          <p className="text-xs text-stone-500 mt-1">إدارة طاولات الصالة، فتح وقطع جلسات الـ QR، وحساب الاستهلاك الفردي</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const activeSession = sessions[table.table_number];

          return (
            <Card key={table.id} className="bg-white border-[#e4ded4] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#2d3b2d] text-[#d4af37] font-black text-lg flex items-center justify-center">
                    {table.table_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{table.name}</h3>
                    <div className="text-xs text-stone-500">السعة القصوى: {table.capacity} أفراد</div>
                  </div>
                </div>

                <Badge variant={activeSession ? 'success' : 'outline'}>
                  {activeSession ? 'جلسة نشطة' : 'طاولة فارغة'}
                </Badge>
              </div>

              {activeSession ? (
                <div className="space-y-2 text-xs bg-[#f3eee7] p-3 rounded-xl border border-[#e4ded4]">
                  <div className="flex justify-between">
                    <span className="text-stone-600">عدد الضيوف للجلسة:</span>
                    <strong className="text-stone-900">{activeSession.guestCount} ضيوف</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">وقت لبدء:</span>
                    <strong className="text-stone-900">{activeSession.startedAt}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">إجمالي الطلبات المسجلة:</span>
                    <strong className="text-emerald-700 font-bold">{activeSession.totalOrdersAmount} EGP</strong>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-500 py-3 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  لا توجد جلسة نشطة لهذه الطاولة حالياً
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {activeSession ? (
                  <Button
                    onClick={() => handleCloseSession(table.table_number)}
                    variant="destructive"
                    size="sm"
                    className="w-full text-xs font-bold gap-1 rounded-xl"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>إنهاء الجلسة</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setOpenSessionModalTable(table);
                      setGuestCountInput(String(table.capacity));
                    }}
                    variant="default"
                    size="sm"
                    className="w-full text-xs font-bold gap-1 rounded-xl"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>فتح جلسة</span>
                  </Button>
                )}

                <Button
                  onClick={() => setSelectedQrTable(table)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold gap-1 rounded-xl"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#2d3b2d]" />
                  <span>رمز QR</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* QR Display / Print Modal */}
      {selectedQrTable && (
        <Dialog
          isOpen={!!selectedQrTable}
          onClose={() => setSelectedQrTable(null)}
          title={`رمز QR لطلب الطاولة رقم ${selectedQrTable.table_number}`}
        >
          <div className="py-4 text-center space-y-4">
            <div className="p-6 bg-white border-2 border-[#2d3b2d] rounded-2xl w-56 h-56 mx-auto flex flex-col items-center justify-center space-y-2 shadow-md">
              <QrCode className="w-32 h-32 text-[#2d3b2d]" />
              <span className="text-xs font-bold text-stone-700">El Villa — Table #{selectedQrTable.table_number}</span>
            </div>

            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              يمكنك طباعة هذا الرمز ولصقه على الطاولة ليتمكن العميل من مسحه والطلب مباشرة.
            </p>

            <div className="pt-2 flex gap-2">
              <Link href={`/qr/${selectedQrTable.table_number}`} target="_blank" className="w-1/2">
                <Button variant="outline" className="w-full text-xs font-bold gap-1 rounded-xl">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة صفحة QR</span>
                </Button>
              </Link>
              <Button onClick={() => window.print()} variant="secondary" className="w-1/2 text-xs font-bold gap-1 rounded-xl">
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الرمز</span>
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Open Session Modal */}
      {openSessionModalTable && (
        <Dialog
          isOpen={!!openSessionModalTable}
          onClose={() => setOpenSessionModalTable(null)}
          title={`فتح جلسة جديدة — ${openSessionModalTable.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">عدد الضيوف على الطاولة:</label>
              <Input
                type="number"
                min={1}
                max={12}
                value={guestCountInput}
                onChange={(e) => setGuestCountInput(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="p-3 bg-[#f3eee7] rounded-xl space-y-1 text-stone-700">
              <div className="font-bold text-stone-900">حساب الحد الأدنى للاستهلاك (Min Consumption):</div>
              <p>يتم احتساب الحد الأدنى بحاصل ضرب عدد الضيوف في المبلغ المحدد من الإدارة.</p>
            </div>

            <div className="pt-2 flex gap-2">
              <Button variant="outline" onClick={() => setOpenSessionModalTable(null)} className="w-1/3 rounded-xl">
                إلغاء
              </Button>
              <Button onClick={() => handleStartSession(openSessionModalTable.table_number)} variant="default" className="w-2/3 font-bold rounded-xl">
                تأكيد وفتح الجلسة
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
