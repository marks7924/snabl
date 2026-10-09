'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/supabase/mock-data';
import { Hall } from '@/types';
import { Utensils, Calendar, Phone, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const { language, t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [settings, setSettings] = useState(globalStore.getSettings());
  const [halls, setHalls] = useState<Hall[]>(globalStore.getHalls());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setSettings(globalStore.getSettings());
      setHalls(globalStore.getHalls());
    });
  }, []);

  const featuredProducts = INITIAL_PRODUCTS.filter(p => p.is_featured);
  const activeHalls = halls.filter(h => h.is_active);

  return (
    <div className="space-y-16 pb-16">
      {/* Venue Closed Emergency Banner */}
      {!settings.venue_is_open && (
        <div className="bg-red-600 text-white py-3 px-4 text-center font-bold text-sm shadow-md flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>المكان مغلق حالياً بقرار من الإدارة. يسعدنا استقبال طلباتكم وحجوزاتكم خلال ساعات العمل الرسمية.</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14110f] via-[#1c1714] to-[#14110f] text-[#faf6f0] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#c69214]/20">
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-start">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif text-white leading-tight">
                {t('hero_title')}
              </h1>
              
              <p className="text-lg sm:text-xl text-stone-300 max-w-2xl leading-relaxed">
                {t('hero_subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/menu">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto font-bold gap-2 text-base px-8 py-6 rounded-full shadow-lg">
                    <Utensils className="w-5 h-5" />
                    <span>{t('cta_menu')}</span>
                  </Button>
                </Link>

                <Link href="/halls">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold gap-2 text-base px-8 py-6 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Calendar className="w-5 h-5 text-[#c69214]" />
                    <span>{t('cta_book_hall')}</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Contact Bar */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-sm text-stone-400 border-t border-white/10">
                <a href="tel:01228852203" className="flex items-center gap-2 text-[#c69214] font-semibold hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>01228852203</span>
                </a>
                <span>•</span>
                <span>المكان الأول للمناسبات والجلسات العائلية</span>
              </div>
            </div>

            {/* Dynamic Hero Visual Card (Editable by Admin in CMS) */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#c69214]/40 shadow-2xl bg-stone-900 aspect-4/3">
                <img
                  src={settings.hero_image_url}
                  alt="El Villa Atmosphere"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white space-y-1">
                  <div className="text-xs font-semibold text-[#c69214] uppercase tracking-wider">El Villa Venue</div>
                  <div className="text-lg font-bold">أجواء دافئة وضيافة فاخرة لكل الأوقات</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories Preview Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black font-serif text-stone-900">
            {t('section_categories')}
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            تصفح التشكيلة المتنوعة من الوجبات والساندوتشات، الباستا، والمشروبات الساخنة والباردة
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/menu?category=${cat.slug}`}>
              <Card className="h-full luxury-card text-center p-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] text-[#1b2e1b] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1b2e1b] group-hover:text-[#c69214] transition-colors">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  {language === 'ar' ? cat.name_ar : cat.name_en}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="bg-[#faf6f0] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#e3d9cc]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black font-serif text-stone-900">
                {t('section_featured')}
              </h2>
              <p className="text-stone-600">أشهر الأصناف وأحدث الإضافات المميزة في إل فيلا</p>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="rounded-full gap-2 border-[#1b2e1b] text-[#1b2e1b]">
                <span>{t('cta_menu')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col luxury-card">
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                    alt={language === 'ar' ? product.name_ar : product.name_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 ltr:right-3 rtl:left-3">
                    <Badge variant="gold" className="font-bold shadow-xs">
                      {product.price} {t('price_egp')}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 mb-1">
                      {language === 'ar' ? product.name_ar : product.name_en}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {language === 'ar' ? (product.ingredients_ar || product.description_ar || 'أجود المكونات الطازجة') : (product.ingredients_en || product.description_en || 'Fresh premium ingredients')}
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link href="/menu">
                      <Button variant="secondary" size="sm" className="w-full font-semibold">
                        {t('view_details')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Halls & Private Events Section (Dynamically Reacts to Admin Hall Changes) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#14110f] text-[#faf6f0] rounded-3xl p-8 lg:p-12 shadow-2xl border border-[#c69214]/30">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-white">
              قاعات المناسبات والاحتفالات
            </h2>

            <p className="text-stone-300 leading-relaxed text-base">
              نقدم باقات متكاملة لتنظيم أعياد الميلاد والاحتفالات الخاصة بأجواء مميزة وتنسيق احترافي. تتوفر لدينا قاعات مستقلة مجهزة بأحدث أجهزة الصوت والإضاءة والتكييف لتناسب كافة الاحتفالات.
            </p>

            <ul className="space-y-3 text-sm text-stone-200">
              {activeHalls.map((hall) => (
                <li key={hall.id} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#c69214]" />
                  <span>{language === 'ar' ? hall.name_ar : hall.name_en} — تتسع حتى {hall.capacity} فرد</span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#c69214]" />
                <span>تجهيزات خاصة وحجز مسبق بتأكيد الإدارة</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/halls">
                <Button variant="secondary" size="lg" className="font-bold gap-2 rounded-full px-8">
                  <Calendar className="w-5 h-5" />
                  <span>احجز قاعة مناسبات</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Halls Image Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeHalls.map((hall) => (
              <div key={hall.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden p-4 space-y-3">
                <div className="relative h-40 rounded-xl overflow-hidden">
                  <img
                    src={hall.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'}
                    alt={language === 'ar' ? hall.name_ar : hall.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 ltr:right-2 rtl:left-2">
                    <Badge variant="default" className="text-xs bg-black/80">
                      {hall.capacity} فرد
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {language === 'ar' ? hall.name_ar : hall.name_en}
                  </h4>
                  <p className="text-xs text-[#c69214] font-semibold mt-1">
                    ساعة: {hall.price_per_hour || Math.round(hall.base_price / 5)} ج.م | اليوم بالكامل: {hall.full_day_price || hall.base_price} {t('price_egp')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-[#faf6f0] rounded-3xl p-8 text-center space-y-4 border border-[#e3d9cc]">
          <h2 className="text-2xl font-bold font-serif text-stone-900">
            للتواصل والمزيد من الاستفسارات
          </h2>
          <p className="text-stone-600 max-w-lg mx-auto">
            تواصل مباشرة مع إدارة إل فيلا عبر الهاتف للاستفسار عن الحجوزات أو أسعار المناسبات.
          </p>
          <div className="pt-2">
            <a
              href="tel:01228852203"
              className="inline-flex items-center gap-3 rounded-full bg-[#1b2e1b] px-8 py-4 text-xl font-black text-[#c69214] shadow-md hover:bg-[#152415] transition-colors"
            >
              <Phone className="w-6 h-6" />
              <span>01228852203</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
