'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Globe, Menu as MenuIcon, X, Calendar, Utensils, Phone, ShieldCheck } from 'lucide-react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/about', label: t('nav_about') },
    { href: '/menu', label: t('nav_menu') },
    { href: '/halls', label: t('nav_halls') },
    { href: '/contact', label: t('nav_contact') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e4ded4] bg-[#faf8f5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2d3b2d] text-[#d4af37] font-bold text-xl shadow-md transition-transform group-hover:scale-105">
            V
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#1c1917] font-serif">
              {t('brand_name')}
            </span>
            <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">
              {t('brand_tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f3eee7] p-1.5 rounded-full border border-[#e4ded4]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
                isActive(link.href)
                  ? 'bg-[#2d3b2d] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-stone-700 hover:bg-[#f4f0eb] border border-[#e4ded4] rounded-full px-3"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-bold uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </Button>

          {/* Hall Booking CTA */}
          <Link href="/halls" className="hidden sm:inline-flex">
            <Button variant="secondary" size="sm" className="rounded-full shadow-xs gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{t('cta_book_hall')}</span>
            </Button>
          </Link>

          {/* Admin Portal Shortcut */}
          <Link href="/admin">
            <Button variant="outline" size="sm" className="rounded-full border-[#2d3b2d]/30 text-[#2d3b2d]">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline">{t('nav_admin')}</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-[#f4f0eb]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#e4ded4] bg-[#faf8f5] px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-[#2d3b2d] text-white font-bold'
                  : 'text-stone-800 hover:bg-[#f3eee7]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/halls" onClick={() => setMobileOpen(false)} className="block w-full">
              <Button variant="secondary" className="w-full justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t('cta_book_hall')}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
