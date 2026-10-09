'use client';

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUploadInput({ label, value, onChange, className = '' }: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-stone-700">{label}</label>}

      {/* Image Preview & Upload Box */}
      {value ? (
        <div className="relative h-44 w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-900 group shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-[#c69214] text-stone-950 font-bold text-xs rounded-xl hover:bg-[#b5830f] transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>تغيير الصورة من الجهاز 📁</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition cursor-pointer"
              title="حذف الصورة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 rounded-xl p-5 text-center hover:border-[#c69214] bg-[#faf6f0] cursor-pointer transition flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#c69214]/15 flex items-center justify-center text-[#c69214]">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-800">اضغط هنا لرفع صورة جديدة من جهازك 📁</span>
          <span className="text-[10px] text-stone-500">يدعم PNG, JPG, WEBP (بدون حاجة لرابط خارجي)</span>
        </div>
      )}

      {/* Alternative URL Input */}
      <div className="flex gap-2 items-center pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أو أدخل رابط صورة (URL)..."
          className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#c69214]"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-[#c69214]" />
          رفع ملف 📁
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
