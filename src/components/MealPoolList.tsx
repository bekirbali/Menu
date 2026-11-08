import React, { useState, useMemo } from "react";
import type { Meal, MealCategory } from "../types/meal";
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "../types/meal";
import { Search, Clock, Trash2, CheckCircle2, CircleDot, RotateCcw } from "lucide-react";

interface MealPoolListProps {
  remainingMeals: Meal[];
  cookedMeals: Meal[];
  currentMealId: string | null;
  onSelectMeal: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  onRestoreMeal: (mealId: string) => void;
}

export const MealPoolList: React.FC<MealPoolListProps> = ({
  remainingMeals,
  cookedMeals,
  currentMealId,
  onSelectMeal,
  onDeleteMeal,
  onRestoreMeal,
}) => {
  const [activeTab, setActiveTab] = useState<"remaining" | "cooked">("remaining");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | "all">("all");

  const currentList = activeTab === "remaining" ? remainingMeals : cookedMeals;

  // Filtreleme (Arama + Kategori)
  const filteredMeals = useMemo(() => {
    return currentList.filter((meal) => {
      const matchSearch =
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === "all" || meal.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [currentList, searchTerm, selectedCategory]);

  const categories: (MealCategory | "all")[] = [
    "all",
    "ana-yemek",
    "corba",
    "etli",
    "tavuk",
    "zeytinyagli",
    "firin",
    "bakliyat",
    "makarna-hamur",
    "pratik",
    "tatli",
  ];

  return (
    <div className="bg-[#151720] border border-[#232734] rounded-2xl p-4 space-y-3.5 shadow-md">
      {/* İki Sekmeli Buton (Segmented Control) */}
      <div className="grid grid-cols-2 p-1 bg-[#10121a] rounded-xl border border-[#202534] text-xs">
        <button
          onClick={() => setActiveTab("remaining")}
          className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "remaining"
              ? "bg-[#202536] text-orange-400 shadow-sm border border-orange-500/20"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>Kalanlar ({remainingMeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cooked")}
          className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "cooked"
              ? "bg-[#202536] text-emerald-400 shadow-sm border border-emerald-500/20"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Pişirilenler ({cookedMeals.length})</span>
        </button>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Yemek veya malzeme ara (örn: patlıcan, çorba)..."
          className="w-full pl-9 pr-3 py-2 bg-[#10121a] border border-[#252a3a] rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Kategori Filtre Pilleri (Yatay Kayan) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-orange-500 text-white font-semibold"
                : "bg-[#1d212e] text-gray-400 hover:text-gray-200 border border-[#292f42]"
            }`}
          >
            {cat === "all" ? "Tümü" : `${CATEGORY_EMOJIS[cat]} ${CATEGORY_LABELS[cat]}`}
          </button>
        ))}
      </div>

      {/* Liste Öğeleri (Kayan Alan) */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 space-y-1">
            <p>Aradığın kriterlere uygun yemek bulunamadı.</p>
            {searchTerm && <p className="text-[11px] text-gray-400">Aramayı temizleyip tekrar dene.</p>}
          </div>
        ) : (
          filteredMeals.map((meal) => {
            const isSelected = meal.id === currentMealId;
            return (
              <div
                key={meal.id}
                onClick={() => activeTab === "remaining" && onSelectMeal(meal)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                  activeTab === "remaining" ? "cursor-pointer" : ""
                } ${
                  isSelected
                    ? "bg-orange-500/10 border-orange-500/40 text-orange-200"
                    : "bg-[#11131c] border-[#222634] text-gray-300 hover:border-[#2f354a]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-xl shrink-0">
                    {meal.emoji || CATEGORY_EMOJIS[meal.category] || "🍲"}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-white truncate text-xs">
                        {meal.name}
                      </p>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-500 text-white shrink-0">
                          SEÇİLİ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{CATEGORY_LABELS[meal.category]}</span>
                      {meal.prepTimeMinutes && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {meal.prepTimeMinutes} dk
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {meal.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`"${meal.name}" yemeğini listeden silmek istediğine emin misin?`)) {
                          onDeleteMeal(meal.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Özel yemeği sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {activeTab === "cooked" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreMeal(meal.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      title="Havuza Geri Al"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Havuza Al</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
