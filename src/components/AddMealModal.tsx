import React, { useState } from "react";
import type { Meal, MealCategory, CuratedMenu } from "../types/meal";
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "../types/meal";
import { X, Plus, Clock, UtensilsCrossed, PlusCircle } from "lucide-react";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMeals: Meal[];
  onAddMeal: (mealData: Omit<Meal, "id" | "isCustom" | "createdAt">) => void;
  onAddMenu: (menuData: Omit<CuratedMenu, "id" | "isCustom" | "createdAt">) => void;
}

const COMMON_EMOJIS = ["🍲", "🥘", "🍛", "🍝", "🥣", "🥙", "🍖", "🍗", "🍕", "🥩", "🥒", "🍆", "🫘", "🥪", "🍳", "🍮", "🍯"];

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  availableMeals,
  onAddMeal,
  onAddMenu,
}) => {
  const [activeTab, setActiveTab] = useState<"meal" | "menu">("meal");

  // Yemek Ekleme State'i
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MealCategory>("ana-yemek");
  const [emoji, setEmoji] = useState("🍲");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(30);
  const [ingredientsText, setIngredientsText] = useState("");

  // Menü Oluşturma State'i
  const [menuName, setMenuName] = useState("");
  const [menuSoup, setMenuSoup] = useState("");
  const [menuMain, setMenuMain] = useState("");
  const [menuSide, setMenuSide] = useState("");
  const [menuDessert, setMenuDessert] = useState("");

  if (!isOpen) return null;

  // Havuzdaki mevcut yemeklerin filtrelenmiş listeleri
  const soups = availableMeals.filter((m) => m.category === "corba");
  const mains = availableMeals.filter((m) =>
    ["ana-yemek", "etli", "tavuk", "firin", "bakliyat", "makarna-hamur"].includes(m.category)
  );
  const sides = availableMeals.filter((m) =>
    ["zeytinyagli", "pratik", "makarna-hamur"].includes(m.category)
  );
  const desserts = availableMeals.filter((m) => m.category === "tatli");

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    onAddMeal({
      name: name.trim(),
      category,
      emoji,
      prepTimeMinutes: prepTimeMinutes > 0 ? prepTimeMinutes : undefined,
      ingredients,
    });

    setName("");
    setIngredientsText("");
    setPrepTimeMinutes(30);
    onClose();
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim() || !menuMain.trim()) {
      alert("Lütfen en azından menü adı ve ana yemeği belirleyin.");
      return;
    }

    onAddMenu({
      name: menuName.trim(),
      soup: menuSoup.trim() || "Günün Çorbası",
      mainDish: menuMain.trim(),
      sideDish: menuSide.trim() || "Mevsim Salatası",
      dessert: menuDessert.trim() || "Günün Tatlısı",
    });

    setMenuName("");
    setMenuSoup("");
    setMenuMain("");
    setMenuSide("");
    setMenuDessert("");
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
    "tatli",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#161822] border-t sm:border border-[#2d3345] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto z-10">
        {/* Üst Sekmeli Buton (Yemek Ekle vs Menü Oluştur) */}
        <div className="flex items-center justify-between border-b border-[#262b3b] pb-3">
          <div className="grid grid-cols-2 p-1 bg-[#10121a] rounded-xl border border-[#202534] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("meal")}
              className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "meal"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yemek Ekle</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "menu"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menü Oluştur</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#202534] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. SEKME: TEK YEMEK EKLEME */}
        {activeTab === "meal" ? (
          <form onSubmit={handleMealSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Yemek Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Fırında Somon & Patates"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs transition-all"
              />
            </div>

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

            <div className="space-y-1">
              <label className="font-semibold text-gray-300">
                Malzemeler (Virgülle Ayırın - İsteğe Bağlı)
              </label>
              <textarea
                rows={2}
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Örn: Somon fileto, Patates, Zeytinyağı, Biberiye"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Yemeği Havuza Ekle
              </button>
            </div>
          </form>
        ) : (
          /* 2. SEKME: YEMEKLE KENDİ MENÜNÜ OLUŞTUR */
          <form onSubmit={handleMenuSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Menü Adı *</label>
              <input
                type="text"
                required
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="Örn: Pazar Ziyafeti, Misafir Menüsü"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            {/* Çorba Seçimi */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">1. Çorba</label>
              <input
                type="text"
                list="soup-options"
                value={menuSoup}
                onChange={(e) => setMenuSoup(e.target.value)}
                placeholder="Havuzdan seç veya yaz (Örn: Mercimek Çorbası)"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs"
              />
              <datalist id="soup-options">
                {soups.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>

            {/* Ana Yemek Seçimi */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">2. Ana Yemek *</label>
              <input
                type="text"
                required
                list="main-options"
                value={menuMain}
                onChange={(e) => setMenuMain(e.target.value)}
                placeholder="Havuzdan seç veya yaz (Örn: Karnıyarık & Pirinç Pilavı)"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs"
              />
              <datalist id="main-options">
                {mains.map((m) => (
                  <option key={m.id} value={m.name} />
                ))}
              </datalist>
            </div>

            {/* Eşlikçi Seçimi */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">3. Eşlikçi (Cacık, Turşu, Salata vb.)</label>
              <input
                type="text"
                list="side-options"
                value={menuSide}
                onChange={(e) => setMenuSide(e.target.value)}
                placeholder="Örn: Salatalıklı Soğuk Cacık, Karışık Turşu"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs"
              />
              <datalist id="side-options">
                <option value="Salatalıklı Soğuk Cacık" />
                <option value="Kuru Soğan & Karışık Turşu" />
                <option value="Mevsim Çoban Salatası" />
                <option value="Gavurdağı Salatası" />
                <option value="Sarımsaklı Süzme Yoğurt" />
                {sides.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>

            {/* Tatlı Seçimi */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">4. Tatlı</label>
              <input
                type="text"
                list="dessert-options"
                value={menuDessert}
                onChange={(e) => setMenuDessert(e.target.value)}
                placeholder="Havuzdan seç veya yaz (Örn: Fırın Sütlaç)"
                className="w-full px-3 py-2 bg-[#0f1118] border border-[#2b3144] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-xs"
              />
              <datalist id="dessert-options">
                {desserts.map((d) => (
                  <option key={d.id} value={d.name} />
                ))}
              </datalist>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Menüyü Kaydet ve Listeye Ekle
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
