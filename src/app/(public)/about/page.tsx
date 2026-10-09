'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Coffee, Users, Calendar, Award } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="gold" className="px-3 py-1 font-bold">
          {t('brand_name')} — {t('nav_about')}
        </Badge>
        <h1 className="text-4xl font-black font-serif text-stone-900">
          عن إل فيلا (El Villa)
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          إل فيلا هو كافيه ومطعم وقاعة مناسبات متكاملة يوفر أجواءً راقية، وجبات شهية، وخدمات متميزة لاستضافة أروع الأوقات وأجمل المناسبات الخاصة.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#e4ded4]">
          <Coffee className="w-10 h-10 text-[#2d3b2d] mb-4" />
          <h3 className="font-bold text-xl text-stone-900 mb-2">كافيه ومطعم راقي</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            نقدم قائمة متنوعة تشمل الساندوتشات الشرقية والغربية، الباستا الإيطالية، والمشروبات الساخنة والباردة بعناية فائقة.
          </p>
        </Card>

        <Card className="p-6 bg-white border-[#e4ded4]">
          <Calendar className="w-10 h-10 text-[#2d3b2d] mb-4" />
          <h3 className="font-bold text-xl text-stone-900 mb-2">قاعات مناسبات مستقلة</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            نوفر قاعات خاصة مستقلة لأعياد الميلاد والاحتفالات العائلية والاجتماعات، مجهزة بأحدث الصوتيات والتكيفات.
          </p>
        </Card>

        <Card className="p-6 bg-white border-[#e4ded4]">
          <Users className="w-10 h-10 text-[#2d3b2d] mb-4" />
          <h3 className="font-bold text-xl text-stone-900 mb-2">خدمة ضيوف متميزة</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            فريق عمل مدرب يحرص على تقديم تجربة ضيافة استثنائية وسريعة لكافة الزوار والضيوف.
          </p>
        </Card>
      </div>

      {/* Contact Banner */}
      <div className="bg-[#1c231c] text-white rounded-3xl p-8 text-center space-y-4 border border-[#d4af37]/30">
        <h2 className="text-2xl font-bold font-serif text-[#d4af37]">
          تواصل مع إدارة إل فيلا
        </h2>
        <p className="text-stone-300 max-w-lg mx-auto text-sm">
          للحجز والاستفسارات الخاصة بالقاعات أو القائمة، يرجى الاتصال برقم الإدارة الموحد:
        </p>
        <div className="pt-2">
          <a
            href="tel:01228852203"
            className="inline-flex items-center gap-3 rounded-full bg-[#2d3b2d] px-8 py-3 text-lg font-black text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#283528]"
          >
            <Phone className="w-5 h-5" />
            <span>01228852203</span>
          </a>
        </div>
      </div>
    </div>
  );
}
