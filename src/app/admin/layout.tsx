'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleName } from '@/types';
import {
  LayoutDashboard,
  Utensils,
  QrCode,
  Calendar,
  Package,
  CircleDollarSign,
  ChefHat,
  Monitor,
  FileText,
  Users,
  Settings,
  Globe,
  Menu as MenuIcon,
  X,
  LogOut,
  ShieldCheck,
  Bell
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active role selector for demonstration / RBAC testing
  const [currentRole, setCurrentRole] = useState<RoleName>('Owner');

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navItems = [
    { href: '/admin', label: t('admin_dashboard'), icon: LayoutDashboard, role: 'all' },
    { href: '/admin/pos', label: t('pos_terminal'), icon: CircleDollarSign, role: 'Cashier' },
    { href: '/admin/kitchen', label: t('kitchen_display'), icon: ChefHat, role: 'Kitchen Staff' },
    { href: '/admin/tables', label: t('table_management'), icon: QrCode, role: 'Cashier' },
    { href: '/admin/menu', label: t('menu_management'), icon: Utensils, role: 'Administrator' },
    { href: '/admin/bookings', label: t('hall_management'), icon: Calendar, role: 'Booking Manager' },
    { href: '/admin/inventory', label: t('inventory_management'), icon: Package, role: 'Inventory Manager' },
    { href: '/admin/reports', label: t('reports_analytics'), icon: FileText, role: 'Accountant' },
    { href: '/admin/cms', label: t('cms_settings'), icon: Settings, role: 'Administrator' },
    { href: '/admin/staff', label: t('staff_permissions'), icon: Users, role: 'Owner' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex bg-[#f4f0eb]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#1c231c] text-[#f4f0eb] border-r border-[#2c362c]">
        {/* Brand */}
        <div className="p-5 border-b border-[#2c362c] flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37] text-stone-900 font-bold text-xl">
            V
          </div>
          <div>
            <div className="font-bold text-base text-white font-serif">{t('brand_name')} Admin</div>
            <div className="text-[10px] text-[#a39e97]">نظام الإدارة التشغيلية</div>
          </div>
        </div>

        {/* Role Selector Badge (RBAC Tester) */}
        <div className="p-4 border-b border-[#2c362c] bg-[#242e24]">
          <div className="text-[10px] font-bold text-[#d4af37] uppercase mb-1">الدور الحالي (RBAC Role):</div>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as RoleName)}
            className="w-full h-8 rounded-lg bg-[#1c231c] border border-[#384838] text-xs font-semibold text-white px-2"
          >
            <option value="Owner">المالك (Owner)</option>
            <option value="General Manager">المدير العام (General Manager)</option>
            <option value="Administrator">المسؤول (Administrator)</option>
            <option value="Booking Manager">مسؤول الحجوزات (Booking Manager)</option>
            <option value="Cashier">الكاشير (Cashier)</option>
            <option value="Kitchen Staff">طاقم المطبخ (Kitchen Staff)</option>
            <option value="Inventory Manager">مسؤول المخزون (Inventory Manager)</option>
            <option value="Accountant">المحاسب (Accountant)</option>
          </select>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#2d3b2d] text-white shadow-sm border border-[#d4af37]/30 font-bold'
                    : 'text-[#a39e97] hover:bg-[#2c362c] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#d4af37]' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2c362c] text-xs text-[#a39e97] flex items-center justify-between">
          <Link href="/" className="hover:underline flex items-center gap-1 text-[#d4af37]">
            <span>الموقع العام</span>
          </Link>
          <span>v1.0.0</span>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-[#e4ded4] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-[#f4f0eb]"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="font-bold text-lg text-stone-900 font-serif">
              {navItems.find(i => isActive(i.href))?.label || 'لوحة التحكم'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="rounded-full text-xs font-bold gap-1 border border-[#e4ded4]">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </Button>

            {/* Notification Bell */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full text-stone-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </Button>
            </div>

            {/* Current Active Role Badge */}
            <Badge variant="gold" className="hidden sm:inline-flex font-bold">
              {currentRole}
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-64 bg-[#1c231c] text-[#f4f0eb] flex flex-col z-10">
            <div className="p-4 border-b border-[#2c362c] flex items-center justify-between">
              <div className="font-bold text-white font-serif">{t('brand_name')} Admin</div>
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-[#2d3b2d] text-white font-bold' : 'text-[#a39e97]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#d4af37]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
