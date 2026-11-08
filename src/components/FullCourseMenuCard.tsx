import React, { useState } from "react";
import type { CuratedMenu } from "../types/meal";
import { Check, UtensilsCrossed, Dices } from "lucide-react";

interface FullCourseMenuCardProps {
  menu: CuratedMenu | null;
  onCookMenu: (menu: CuratedMenu) => void;
  onRerollMenu: () => void;
}

interface CourseRowProps {
  step: string;
  label: string;
  dishName: string;
}

const CourseRow: React.FC<CourseRowProps> = ({ step, label, dishName }) => {
  return (
    <div className="p-3 rounded-2xl bg-[#161923] border border-[#252a3a] flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
            {step} {label}
          </span>
        </div>
        <p className="font-semibold text-xs sm:text-sm text-white truncate">{dishName}</p>
      </div>
    </div>
  );
};

export const FullCourseMenuCard: React.FC<FullCourseMenuCardProps> = ({
  menu,
  onCookMenu,
  onRerollMenu,
}) => {
  const [cookedMenuId, setCookedMenuId] = useState<string | null>(null);

  if (!menu) {
    return (
      <div className="bg-[#141622] border border-[#252b3d] rounded-3xl p-6 text-center space-y-3 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 mx-auto flex items-center justify-center">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-200">Günün Menüsü</h3>
        <button
          onClick={onRerollMenu}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs transition-all shadow-md"
        >
          <Dices className="w-4 h-4" />
          Rastgele Menü Seç
        </button>
      </div>
    );
  }

  const isCooked = Boolean(menu && cookedMenuId === menu.id);

  const handleCook = () => {
    if (!menu) return;
    setCookedMenuId(menu.id);
    onCookMenu(menu);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#191c28] to-[#12141d] border border-orange-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5">
      {/* Üst Başlık */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-[#24293a]">
        <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
          <UtensilsCrossed className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400 block leading-tight">
            GÜNÜN MENÜSÜ
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {menu.name}
          </h3>
        </div>
      </div>

      {/* 4'lü Menü Akışı */}
      <div className="space-y-2">
        <CourseRow step="1." label="Çorba" dishName={menu.soup} />
        <CourseRow step="2." label="Ana Yemek" dishName={menu.mainDish} />
        <CourseRow step="3." label="Eşlikçi" dishName={menu.sideDish} />
        <CourseRow step="4." label="Tatlı" dishName={menu.dessert} />
      </div>

      {/* Alt Aksiyon Butonları (Pişirdim ve Başka Seç) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={handleCook}
          disabled={isCooked}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all ${
            isCooked
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white shadow-orange-500/20"
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{isCooked ? "Pişirildi" : "Pişirdim"}</span>
        </button>

        <button
          onClick={onRerollMenu}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#1e2230] hover:bg-[#272c3d] active:scale-95 text-gray-200 border border-[#30364c] text-xs sm:text-sm font-semibold transition-all"
        >
          <Dices className="w-4 h-4 text-orange-400" />
          <span>Başka Seç</span>
        </button>
      </div>
    </div>
  );
};
