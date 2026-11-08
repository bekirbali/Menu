import React, { useState, useMemo } from "react";
import type { Meal, MealCategory } from "../types/meal";
import { CATEGORY_LABELS } from "../types/meal";
import { X, Search, Check, Dices, RotateCcw } from "lucide-react";

interface CustomWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMeals: Meal[];
  selectedMealIds: string[];
  onSaveSelection: (ids: string[]) => void;
}

export const CustomWheelModal: React.FC<CustomWheelModalProps> = ({
  isOpen,
  onClose,
  availableMeals,
  selectedMealIds,
  onSaveSelection,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMealIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | "all">("all");

  const filteredMeals = useMemo(() => {
    return availableMeals.filter((meal) => {
      const matchSearch =
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === "all" || meal.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [availableMeals, searchTerm, selectedCategory]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePickRandom10 = () => {
    const shuffled = [...availableMeals].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 10).map((m) => m.id);
    setSelectedIds(picked);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSave = () => {
    onSaveSelection(selectedIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#131620] border border-[#262c3e] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Başlık */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232839]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Özel Çark Hazırla</h2>
            <p className="text-xs text-gray-400">
              Çarkta dönmesini istediğin yemekleri seç ({selectedIds.length} seçili)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-[#1c202e] hover:bg-[#252b3d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aksiyon Butonları (Hızlı İşlemler) */}
        <div className="flex items-center justify-between py-3 gap-2 text-xs">
          <button
            onClick={handlePickRandom10}
            className="flex-1 py-1.5 px-3 rounded-xl bg-[#1d2232] hover:bg-[#262c40] text-orange-300 border border-orange-500/20 font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Rastgele 10 Yemek Seç</span>
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleClearAll}
              className="py-1.5 px-3 rounded-xl bg-[#1d2232] hover:bg-[#262c40] text-gray-400 hover:text-red-400 border border-[#2a3146] font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}
        </div>

        {/* Arama Kutusu */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Yemek ara..."
            className="w-full pl-9 pr-3 py-2 bg-[#0e1017] border border-[#232839] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Kategori Filtresi */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar text-[11px]">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-orange-500 text-white font-semibold"
                : "bg-[#1b1f2c] text-gray-400 border border-[#282f42]"
            }`}
          >
            Tümü
          </button>
          {(["corba", "ana-yemek", "etli", "tavuk", "zeytinyagli", "tatli"] as MealCategory[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white font-semibold"
                    : "bg-[#1b1f2c] text-gray-400 border border-[#282f42]"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            )
          )}
        </div>

        {/* Seçilebilir Yemek Listesi */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 my-2 max-h-[300px]">
          {filteredMeals.map((meal) => {
            const isSelected = selectedIds.includes(meal.id);
            return (
              <div
                key={meal.id}
                onClick={() => toggleSelect(meal.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                    : "bg-[#0f1118] border-[#1f2433] text-gray-300 hover:border-[#2f3549]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-white truncate text-xs">{meal.name}</p>
                  <p className="text-[11px] text-gray-400">{CATEGORY_LABELS[meal.category]}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-gray-600 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alt Butonlar */}
        <div className="pt-3 border-t border-[#232839] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#1a1e2b] hover:bg-[#23283a] text-gray-300 text-xs font-semibold transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSave}
            disabled={selectedIds.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-40"
          >
            Çarkı Güncelle ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};
