'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Phone, MapPin, Clock, Utensils, Calendar, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-[#e4ded4] bg-[#1c231c] text-[#f4f0eb]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37] text-stone-900 font-bold text-xl">
                V
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                {t('brand_name')}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t('brand_tagline')}
            </p>
            <div className="pt-2">
              <a
                href="tel:01228852203"
                className="inline-flex items-center gap-2 rounded-full bg-[#2d3b2d] px-4 py-2 text-sm font-semibold text-[#d4af37] hover:bg-[#384838] transition-colors border border-[#d4af37]/30"
              >
                <Phone className="w-4 h-4" />
                <span>01228852203</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#d4af37] uppercase">
              {t('nav_home')}
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/menu" className="hover:text-white transition-colors flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t('nav_menu')}</span>
                </Link>
              </li>
              <li>
                <Link href="/halls" className="hover:text-white transition-colors flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t('nav_halls')}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('nav_contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Location Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#d4af37] uppercase">
              {t('nav_contact')}
            </h4>
            <div className="space-y-2 text-sm text-stone-300">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">إدارة إل فيلا</div>
                  <a href="tel:01228852203" className="hover:underline">01228852203</a>
                </div>
              </div>
              <div className="flex items-start gap-2 text-stone-400 text-xs pt-1">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>الموقع والعنوان يتم تحديثهما من إعدادات الإدارة (CMS).</span>
              </div>
            </div>
          </div>

          {/* Staff & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#d4af37] uppercase">
              بوابة الموظفين والإدارة
            </h4>
            <p className="text-xs text-stone-400">
              دخول الموظفين المصرح لهم لإدارة الطاولات، طلبات الـ QR، الكاشير (POS)، والمطبخ.
            </p>
            <div className="pt-1 space-y-2">
              <Link href="/admin/pos" className="block text-xs text-stone-300 hover:text-white underline">
                • {t('nav_pos')}
              </Link>
              <Link href="/admin/kitchen" className="block text-xs text-stone-300 hover:text-white underline">
                • {t('nav_kitchen')}
              </Link>
              <Link href="/admin" className="block text-xs text-stone-300 hover:text-white underline">
                • {t('admin_dashboard')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 إل فيلا (El Villa). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>العملة: EGP</span>
            <span>•</span>
            <span>المنطقة الزمنية: Africa/Cairo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
