'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { RoleName, PermissionCode } from '@/types';
import { ROLE_PERMISSIONS_MAP } from '@/lib/supabase/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShieldCheck, Lock, UserPlus, Key } from 'lucide-react';

export default function AdminStaffPage() {
  const { t } = useLanguage();

  const [staffUsers, setStaffUsers] = useState<{
    id: string;
    fullName: string;
    email: string;
    role: RoleName;
    status: 'active' | 'inactive';
  }[]>([
    { id: 'u1', fullName: 'مالك المنشأة (Owner)', email: 'owner@elvilla.com', role: 'Owner', status: 'active' },
    { id: 'u2', fullName: 'أحمد محمود', email: 'cashier@elvilla.com', role: 'Cashier', status: 'active' },
    { id: 'u3', fullName: 'شف الشيفات', email: 'kitchen@elvilla.com', role: 'Kitchen Staff', status: 'active' },
    { id: 'u4', fullName: 'مسؤول الحجوزات', email: 'booking@elvilla.com', role: 'Booking Manager', status: 'active' },
    { id: 'u5', fullName: 'المحاسب المالي', email: 'accountant@elvilla.com', role: 'Accountant', status: 'active' }
  ]);

  const [selectedRoleView, setSelectedRoleView] = useState<RoleName>('Owner');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e4ded4]">
        <div>
          <h1 className="text-2xl font-black font-serif text-stone-900">{t('staff_permissions')}</h1>
          <p className="text-xs text-stone-500 mt-1">إدارة حسابات الموظفين ومنح الأدوار والصلاحيات الدقيقة (Granular RBAC)</p>
        </div>
      </div>

      {/* Staff Accounts List */}
      <Card className="bg-white border-[#e4ded4] overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-[#f3eee7]/50 font-bold text-sm text-stone-900">
          حسابات موظفي وإداريي المنشأة:
        </div>

        <div className="divide-y divide-stone-200">
          {staffUsers.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d3b2d] text-[#d4af37] font-bold flex items-center justify-center text-sm">
                  {user.fullName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{user.fullName}</h4>
                  <div className="text-xs text-stone-500">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="gold" className="font-bold text-xs">{user.role}</Badge>
                <Badge variant="success">نشط</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Granular Permissions Matrix Inspector */}
      <Card className="bg-white border-[#e4ded4] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#2d3b2d]" />
            <h3 className="font-bold text-lg text-stone-900">مصفوفة الصلاحيات حسب الدور (Permissions Matrix)</h3>
          </div>
        </div>

        {/* Role Tabs Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(Object.keys(ROLE_PERMISSIONS_MAP) as RoleName[]).map((role) => (
            <Button
              key={role}
              variant={selectedRoleView === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRoleView(role)}
              className="rounded-full text-xs font-bold shrink-0"
            >
              {role}
            </Button>
          ))}
        </div>

        {/* Permissions Checklist Grid */}
        <div className="p-4 bg-[#f3eee7] rounded-2xl border border-[#e4ded4]">
          <h4 className="font-bold text-xs text-stone-900 mb-3">
            الصلاحيات الممنوحة لدور ({selectedRoleView}):
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {ROLE_PERMISSIONS_MAP[selectedRoleView].map((perm) => (
              <div key={perm} className="p-2 bg-white rounded-lg border border-stone-200 font-semibold text-emerald-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
