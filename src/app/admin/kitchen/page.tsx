'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { globalStore } from '@/lib/store';
import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, CheckCircle2, ArrowRight, Play, Check } from 'lucide-react';

export default function AdminKitchenPage() {
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>(globalStore.getOrders());

  useEffect(() => {
    return globalStore.subscribe(() => {
      setOrders(globalStore.getOrders());
    });
  }, []);

  const updateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    globalStore.updateOrderStatus(orderId, nextStatus);
  };

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#14110f] text-white p-5 rounded-2xl border border-[#26201b]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#c69214] text-stone-900 rounded-xl font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">{t('kitchen_display')}</h1>
            <p className="text-xs text-stone-300">متابعة فورية ومباشرة للطلبات المنيو أونلاين والطاولات والتحديث السريع للتحضير بالمطبخ</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant="gold" className="font-bold">
            {activeOrders.length} طلبات نشطة بالمطبخ
          </Badge>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <Card
            key={order.id}
            className={`border-2 flex flex-col justify-between p-5 space-y-4 shadow-md bg-white ${
              order.status === 'pending'
                ? 'border-amber-400 bg-amber-50/20'
                : order.status === 'preparing'
                ? 'border-blue-500 bg-blue-50/20'
                : order.status === 'ready'
                ? 'border-emerald-500 bg-emerald-50/20'
                : 'border-stone-200'
            }`}
          >
            <div className="space-y-4">
              {/* Order Card Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <div className="font-black text-lg text-stone-900">{order.order_number}</div>
                  <div className="text-xs font-bold text-[#1b2e1b]">
                    {order.customer_name ? `العميل: ${order.customer_name}` : `طاولة #${order.table_id || '1'}`}
                    <span className="text-stone-500 block text-[10px]">نوع الطلب: ({order.order_type})</span>
                  </div>
                </div>

                <div className="text-end">
                  <Badge
                    variant={
                      order.status === 'pending'
                        ? 'warning'
                        : order.status === 'preparing'
                        ? 'default'
                        : order.status === 'ready'
                        ? 'success'
                        : 'outline'
                    }
                    className="font-bold text-xs"
                  >
                    {order.status === 'pending' && 'جديد (انتظار)'}
                    {order.status === 'preparing' && 'جاري التحضير'}
                    {order.status === 'ready' && 'جاهز للتقديم'}
                  </Badge>
                  <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.created_at}</span>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#faf6f0] rounded-xl text-xs space-y-1 border border-[#e3d9cc]">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{item.product_name_ar} {item.variant_name_ar ? `(${item.variant_name_ar})` : ''}</span>
                      <span className="text-base text-[#1b2e1b]">x{item.quantity}</span>
                    </div>
                  </div>
                ))}

                {order.customer_notes && (
                  <div className="p-2 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold">
                    📝 ملاحظة العميل: {order.customer_notes}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Status Change */}
            <div className="pt-2">
              {order.status === 'pending' && (
                <Button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  variant="default"
                  className="w-full font-bold gap-2 rounded-xl"
                >
                  <Play className="w-4 h-4" />
                  <span>بدء التحضير</span>
                </Button>
              )}

              {order.status === 'preparing' && (
                <Button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  variant="secondary"
                  className="w-full font-bold gap-2 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تحديد كـ "جاهز للتقديم"</span>
                </Button>
              )}

              {order.status === 'ready' && (
                <Button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  variant="outline"
                  className="w-full font-bold gap-2 rounded-xl border-emerald-600 text-emerald-800 hover:bg-emerald-50"
                >
                  <Check className="w-4 h-4" />
                  <span>تم التسليم للعميل</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
