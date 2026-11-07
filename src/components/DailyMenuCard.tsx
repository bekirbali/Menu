import React, { useState } from "react";
import type { Meal } from "../types/meal";
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "../types/meal";
import { Check, Dices, Clock, ChevronDown, ChevronUp, Utensils } from "lucide-react";

interface DailyMenuCardProps {
  meal: Meal | null;
  onCooked: (mealId: string) => void;
  onReroll: () => void;
  remainingCount: number;
  disabled?: boolean;
}

export const DailyMenuCard: React.FC<DailyMenuCardProps> = ({
  meal,
  onCooked,
  onReroll,
  remainingCount,
  disabled = false,
}) => {
  const [showIngredients, setShowIngredients] = useState(false);

  if (!meal) {
    return (
      <div className="bg-[#151821] border border-[#272c3d] rounded-2xl p-6 text-center space-y-3 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 mx-auto flex items-center justify-center text-2xl">
          🍽️
        </div>
        <h3 className="text-base font-bold text-gray-200">Günün Menüsü Henüz Seçilmedi</h3>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Yukarıdaki çarkı çevirerek veya aşağıdaki butona basarak günün yemeğini belirle.
        </p>
        <button
          onClick={onReroll}
          disabled={disabled || remainingCount === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-xs transition-all shadow-md disabled:opacity-50"
        >
          <Dices className="w-4 h-4" />
          Rastgele Yemek Seç
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#1c202d] to-[#141620] border border-orange-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Arka plan hafif ışıltı */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Üst Rozetler */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500 text-white tracking-wider uppercase shadow-sm">
          <Utensils className="w-3 h-3" />
          GÜNÜN MENÜSÜ
        </span>

        <div className="flex items-center gap-1.5">
          {meal.isCustom && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Senin Tarifin
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#242838] text-gray-300 border border-[#333a50]">
            {CATEGORY_EMOJIS[meal.category] || "🍲"} {CATEGORY_LABELS[meal.category] || "Yemek"}
          </span>
        </div>
      </div>

      {/* Yemek Başlığı & Büyük İkon */}
      <div className="flex items-start gap-3 py-1">
        <div className="w-14 h-14 rounded-2xl bg-[#202534] border border-[#31384e] flex items-center justify-center text-3xl shadow-inner shrink-0">
          {meal.emoji || CATEGORY_EMOJIS[meal.category] || "🍲"}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {meal.name}
          </h2>
          {meal.prepTimeMinutes && (
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Hazırlık & Pişirme: ~{meal.prepTimeMinutes} dakika</span>
            </div>
          )}
        </div>
      </div>

      {/* Malzemeler Akordiyonu */}
      {meal.ingredients.length > 0 && (
        <div className="border-t border-[#262b3c] pt-2">
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-gray-200 py-1 transition-colors"
          >
            <span>Malzemeler ({meal.ingredients.length})</span>
            {showIngredients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showIngredients && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {meal.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg text-[11px] bg-[#1a1d27] border border-[#2b3145] text-gray-300"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aksiyon Butonları (Mobil Parmak Alanı) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={() => onCooked(meal.id)}
          disabled={disabled}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Pişirdim</span>
        </button>

        <button
          onClick={onReroll}
          disabled={disabled || remainingCount <= 1}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#1e2230] hover:bg-[#272c3d] active:scale-95 text-gray-200 border border-[#30364c] text-xs sm:text-sm font-semibold transition-all disabled:opacity-40"
          title="Kalan yemeklerden başka bir aday seç"
        >
          <Dices className="w-4 h-4 text-orange-400" />
          <span>Başka Seç</span>
        </button>
      </div>
    </div>
  );
};
