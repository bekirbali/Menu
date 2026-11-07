import React, { useState } from "react";
import type { Meal, MealCategory } from "../types/meal";
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "../types/meal";
import { X, Plus, Clock } from "lucide-react";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (mealData: Omit<Meal, "id" | "isCustom" | "createdAt">) => void;
}

const COMMON_EMOJIS = ["🍲", "🥘", "🍛", "🍝", "🥣", "🥙", "🍖", "🍗", "🍕", "🥩", "🥒", "🍆", "🫘", "🥪", "🍳"];

export const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MealCategory>("ana-yemek");
  const [emoji, setEmoji] = useState("🍲");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(30);
  const [ingredientsText, setIngredientsText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Lütfen yemek adını girin.");
      return;
    }

    const ingredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    onAdd({
      name: name.trim(),
      category,
      emoji,
      prepTimeMinutes: prepTimeMinutes > 0 ? prepTimeMinutes : undefined,
      ingredients,
    });

    // Formu temizle ve kapat
    setName("");
    setIngredientsText("");
    setPrepTimeMinutes(30);
    onClose();
  };

  const categories: MealCategory[] = [
    "ana-yemek",
    "corba",
    "etli",
    "tavuk",
    "zeytinyagli",
    "firin",
    "bakliyat",
    "makarna-hamur",
    "pratik",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Tıklayarak Kapatma Arka Planı */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom-Sheet Kutusu */}
      <div className="relative w-full max-w-md bg-[#161822] border-t sm:border border-[#2d3345] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto z-10">
        
        {/* Üst Başlık & Kapat Butonu */}
        <div className="flex items-center justify-between border-b border-[#262b3b] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-base font-bold text-white tracking-tight">Yeni Yemek Ekle</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#202534] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Yemek Adı */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-300">Yemek Adı *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Fırında Somon & Kuşkonmaz"
              className="w-full px-3 py-2.5 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs transition-all"
            />
          </div>

          {/* Kategori Seçimi */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">Kategori</label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 transition-all ${
                    category === cat
                      ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                      : "bg-[#11131c] border-[#252a3b] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <span>{CATEGORY_EMOJIS[cat]}</span>
                  <span className="truncate">{CATEGORY_LABELS[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Seçimi */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">İkon / Emoji</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {COMMON_EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center shrink-0 border transition-all ${
                    emoji === e
                      ? "bg-orange-500/20 border-orange-500 scale-110 shadow-sm"
                      : "bg-[#11131c] border-[#252a3b] hover:bg-[#1a1e2b]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Pişirme Süresi */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              Hazırlık / Pişirme Süresi (Dakika)
            </label>
            <input
              type="number"
              min={5}
              max={240}
              step={5}
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs"
            />
          </div>

          {/* Malzemeler (Virgülle ayrılmış) */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-300">
              Malzemeler (Virgülle Ayırın - İsteğe Bağlı)
            </label>
            <textarea
              rows={2}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Örn: Somon fileto, Kuşkonmaz, Sarımsak, Zeytinyağı, Limon"
              className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 text-xs resize-none"
            />
          </div>

          {/* Kaydet Butonu */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Yemeği Havuza ve Döngüye Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
