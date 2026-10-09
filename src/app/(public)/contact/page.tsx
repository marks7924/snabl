'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Clock, MessageSquare, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="gold" className="px-3 py-1 font-bold">
          {t('brand_name')}
        </Badge>
        <h1 className="text-4xl font-black font-serif text-stone-900">
          {t('nav_contact')}
        </h1>
        <p className="text-stone-600 max-w-md mx-auto">
          يسعدنا تواصلكم الدائم معنا للاستفسار والحجز في إل فيلا
        </p>
      </div>

      <Card className="p-8 bg-white border-[#e4ded4] shadow-md">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-[#2d3b2d] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Phone className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900 mb-1">رقم الإدارة الموحد</h2>
            <p className="text-sm text-stone-500">للحجوزات، الطلبات، والاستفسارات العامة</p>
          </div>

          <div>
            <a
              href="tel:01228852203"
              className="inline-flex items-center gap-3 text-3xl font-black text-[#2d3b2d] bg-[#f3eee7] px-8 py-4 rounded-2xl border border-[#e4ded4] hover:border-[#2d3b2d] transition-colors"
            >
              <span>01228852203</span>
            </a>
          </div>

          <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
              <span>ملاحظة: تفاصيل العنوان وساعات العمل الرسمية ومواقع التواصل الاجتماعي قابلة للتحديث عبر لوحة تحكم الإدارة (CMS).</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
